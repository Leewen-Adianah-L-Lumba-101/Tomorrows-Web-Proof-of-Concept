// REACT COMPONENT PAGE FOR MAIN NAVIGATIONS
import React from 'react';
import LoginMorpher from '../components/LoginMorpher';
import { Link } from 'react-router-dom';
import axios from 'axios';

// In order to connect to the MONGODB and Emailer servers,
// the library 'concurrently' was installed to run both of simultaneously

export default function Register() {

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {

    // Prevent the page from refreshing
    // Which is dangerous because it might mess up the form data
    event.preventDefault();

    // Interchangeable with the Emailer server
    const formElement = new FormData(event.currentTarget);
    const data = {
      name: formElement.get('name') as string,
      email: formElement.get('mail') as string,
      password: formElement.get('password') as string,
    };

    // THIS IS STRICTLY FOR THE MONGODB SERVER
    axios.post('http://localhost:3002/register', data)
    .then(result => console.log(result))
    .catch(err => console.log(err));

    try {
      const response = await fetch('http://localhost:3001/sendmail', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(data), 
      });

      // When the email has been sent, redirect to home page
      const result = await response.json();
      if (response.ok) {
        window.location.href = '/';

      } else {
        console.log('Error:', result.error);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  }

  return (
    <div className="wrapper signUp">
      <div className="illustration">
        <LoginMorpher />
      </div>
      
      <div className="form">
        <div className="heading"><h2>COME HANG WITH US</h2></div>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name</label>
            <input type="text" name="name" id="name" placeholder="Enter your name" />
          </div>
          <div>
            <label htmlFor="mail">E-Mail</label>
            <input type="email" name="mail" id="mail" placeholder="Enter your mail" />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" placeholder="Enter your password" />
          </div>
          <button type="submit" className="btn btn-shadow-drop-yellow btn-shadow-drop--yellowblack yellowbtn">Submit</button>
          <h2 className="or">OR</h2>
        </form>
        <p>
          Got an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
