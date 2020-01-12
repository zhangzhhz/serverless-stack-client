import React, { useRef, useState, useEffect } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { API, Storage } from 'aws-amplify';
import LoaderButton from "../components/LoaderButton";
import { S3Upload, S3Delete } from "../libs/awsLib";
import config from '../config';
import './Notes.css';

export default function Notes(props) {
  const file = useRef(null);
  const [note, setNote] = useState(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    function loadNote() {
      return API.get('notes', `/notes/${props.match.params.id}`)
    }

    async function onLoad() {
      try {
        const note = await loadNote();
        /* note:
          {
              "attachment": "1578744435441-skipped.txt",
              "content": "attachment test",
              "createdAt": 1578744437606,
              "noteId": "e9738060-346a-11ea-8286-c990470a302a",
              "userId": "ap-northeast-1:33fb91fc-825a-4598-8033-b628ec122f73"
          }
        */
        const { content, attachment } = note;
        // console.log(`{${JSON.stringify(note, null, 4)}}`);
        // console.log(`[${content}]`);

        if (attachment) {
          note.attachmentURL = await Storage.vault.get(attachment);
        }

        setContent(content);
        setNote(note);
      }
      catch (e) {
        console.error(`Error: [${JSON.stringify(e, null, 4)}]`);
        alert(e);
      }
    }

    onLoad();
  }, [props.match.params.id]);

  function validateForm() {
    return content.length > 0;
  }

  // we prefix Date.now() + "-" before file name when uploading to S3,
  // so now we remove the prefix and get the file name.
  function formatFilename(str) {
    return str.replace(/^\w+-/, '');
  }

  function handleFileChange(event) {
    console.log(`event.target.files = [${JSON.stringify(event.target.files)}]`);
    file.current = event.target.files[0];
  }

  function saveNote(note) {
    return API.put('notes', `/notes/${props.match.params.id}`, {
      body: note
    });
  }

  async function handleSubmit(event) {
    let attachment;

    event.preventDefault();

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1000000} MB`);
      return;
    }

    setIsLoading(true);

    try {
      if (file.current) {
        attachment = await S3Upload(file.current);
        // delete existing attachment. Do not wait for S3Delete to return
        S3Delete(note.attachment);
      }
      await saveNote({
        content,
        attachment: attachment || note.attachment
      });
      setIsLoading(false);
      props.history.push("/");
    }
    catch (e) {
      console.error(`Error: [${JSON.stringify(e, null, 4)}]`);
      alert(e);
      setIsLoading(false);
    }
  }

  function deleteNote() {
    return API.del('notes', `/notes/${props.match.params.id}`);
  }

  async function handleDelete(event) {
    event.preventDefault();

    const confirmed = window.confirm("Are you sure you want to delete this note?");

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteNote();
      // delete attachment if any
      if (note.attachment) {
        // console.log(`Deleting note attachment: [${note.attachment}]`);
        S3Delete(note.attachment);
      }
      setIsDeleting(false);
      props.history.push('/');
    }
    catch (e) {
      console.error(`Error: [${JSON.stringify(e, null, 4)}]`);
      alert(e);
      setIsDeleting(false);
    }
  }
  
  return (
    <div className='Notes'>
      {note && (
        <form onSubmit={handleSubmit}>
          <FormGroup controlled='content'>
            <FormControl
              value={content}
              componentClass="textarea"
              onChange={e => setContent(e.target.value)}
            />
          </FormGroup>
          {note.attachment && (
            <FormGroup>
              <ControlLabel>Attachment</ControlLabel>
              <FormControl.Static>
                <a
                  target='_blank'
                  rel='noopener noreferrer'
                  href={note.attachmentURL}
                >
                  {formatFilename(note.attachment)}
                </a>
              </FormControl.Static>
            </FormGroup>
          )}
          <FormGroup controlId='file'>
            {!note.attachment && <ControlLabel>Attachment</ControlLabel>}
            <FormControl onChange={handleFileChange} type='file' />
          </FormGroup>
          <LoaderButton
            block
            type='submit'
            bsSize='large'
            bsStyle='primary'
            isLoading={isLoading}
            disabled={!validateForm()}
          >
            Save
          </LoaderButton>
          <LoaderButton
            block
            bsSize='large'
            bsStyle='danger'
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Delete
          </LoaderButton>
        </form>
      )}  
    </div>
  );
}