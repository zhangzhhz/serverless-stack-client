import React, { useState, useEffect } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { Auth } from 'aws-amplify';
import LoaderButton from '../components/LoaderButton';
import { useFormFields } from "../libs/hooksLib";
import './Login.css';

export default function Login(props) {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    email: '',
    password: ''
  })

  // useEffect(() => console.log(password), [password]);

  function validateForm() {
    // return email.length > 0 && password.length > 0;
    return fields.email.length > 0 && fields.password.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
      console.log("Authenticating...");
      // await Auth.signIn(email, password);
      await Auth.signIn(fields.email, fields.password);
      setIsLoading(false);
      props.userHasAuthenticated(true);
      // The following seems to cause setting state on a unmounted component
      // due to the program control already going to UnauthenticatedRoute.
      // Move it to before the previous userHasAuthenticated statement if you want to set it.
      // setIsLoading(false);
      console.log(`userHasAuthenticated... Redirecting accordingly by UnauthenticatedRoute..`);
      // props.history.push("/"); // redirection is done by UnauthenticatedRoute now
    } catch (e) {
      setIsLoading(false);
      alert(e.message);
    }
  }

  return (
    <div className='Login'>
      <form onSubmit={handleSubmit}>
        <FormGroup controlId='email' bsSize='large'>
          <ControlLabel>Email</ControlLabel>
          <FormControl
            autoFocus
            type='email'
            // value={email}
            // onChange={e => setEmail(e.target.value)}
            value={fields.email}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <FormGroup controlId='password' bsSize='large'>
          <ControlLabel>Password</ControlLabel>
          <FormControl
            type='password'
            // value={password}
            // onChange={e => setPassword(e.target.value)}
            value={fields.password}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <LoaderButton block bsSize='large' disabled={!validateForm()} isLoading={isLoading} type='submit'>
          Login
        </LoaderButton>
      </form>
    </div>
  );
}