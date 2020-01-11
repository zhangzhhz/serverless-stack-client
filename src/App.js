import React, { useState, useEffect } from 'react';
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Auth } from 'aws-amplify';
import Routes from './Routes';
import './App.css';

function App(props) {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    onLoad();
  }, []);
  
  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    }
    catch (e) {
      if (e === 'No current user') {
        console.log(e);
      } else {
        console.log(`onLoad part got error: ${JSON.stringify(e, null, 4)}`);
      }
    }
    setIsAuthenticating(false);
  }

  async function handleLogout() {
    try {
      await Auth.signOut();
      userHasAuthenticated(false);
      console.log(`Logged out. Redirecting to login page...`);
      props.history.push('/login');
    }
    catch (e) {
      alert(JSON.stringify(e, null, 4));
    }
  }

  return (
    ! isAuthenticating &&
    <div className="App container">
      <Navbar fluid collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">Scratch</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            {isAuthenticated
              // ? <LinkContainer to='/logout'><NavItem>Logout</NavItem></LinkContainer>
              ? (
                <>
                  <LinkContainer to='/settings'>
                    <NavItem>Settings</NavItem>
                  </LinkContainer>
                  <NavItem onClick={handleLogout}>Logout</NavItem>
                </>
              )
              : <>
                <LinkContainer to="/signup">
                  <NavItem>Signup</NavItem>
                </LinkContainer>
                <LinkContainer to="/login">
                  <NavItem>Login</NavItem>
                </LinkContainer>
              </>
            }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Routes appProps={{ isAuthenticated, userHasAuthenticated, isAuthenticating }} />
    </div>
  );
}

export default withRouter(App);
