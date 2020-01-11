import React, { useRef, useState, createContext } from 'react';
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { API } from 'aws-amplify';
import LoaderButton from '../components/LoaderButton';
import config from '../config';
import { S3Upload } from '../libs/awsLib';
import './NewNote.css';

export default function(props) {
  const file = useRef(null);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return content.length > 0;
  }

  function handleFileChange(event) {
    file.current = event.target.files[0];
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1000000} MB`);
      return;
    }
    
    setIsLoading(true);

    try {
      const attachment = file.current ? await S3Upload(file.current) : null;
      await createNote({ content, attachment });
      setIsLoading(false);
      props.history.push('/');
    }
    catch (e) {
      alert(e);
      console.error(`Error: [${JSON.stringify(e, null, 4)}]`);
      setIsLoading(false);
    }
  }

  function createNote(note) {
    return API.post('notes', '/notes', {
      body: note
    });
  }

  return (
    <div className='NewNote'>
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="content">
          <FormControl
            value={content}
            componentClass="textarea"
            onChange={e => setContent(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="file">
          <ControlLabel>Attachment</ControlLabel>
          <FormControl onChange={handleFileChange} type="file" />
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          bsStyle="primary"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Create
        </LoaderButton>
      </form>
    </div>
  );
}