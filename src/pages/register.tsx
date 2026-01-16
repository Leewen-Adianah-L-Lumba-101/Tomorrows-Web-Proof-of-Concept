import React from 'react';
import LoginMorpher from '../components/LoginMorpher'
import { Link } from 'react-router-dom';

export default function Register() {
    async function handleSubmit(event : React.MouseEvent) {
      
    // Prevent default behavior, which is a page navigation
    event.preventDefault();

    const formElement = event.currentTarget as HTMLFormElement;
    const formData = new FormData(formElement);

    const response = await fetch('/users/signup', {
      method: 'POST',
      body: JSON.stringify({
        name: formData.get('name'),
        email: formData.get('mail'),
        password: formData.get('password'),
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    if (!response.ok) {
      // Handle error response
      return;
    }

    // Handle success flow
  }
  
  return (
    <div className="wrapper signUp">
      <div className="illustration">
        <LoginMorpher />
      </div>
      <div className="form">
        <div className="heading"><h2>COME HANG WITH US</h2></div>
        <form>
          <div>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" placeholder="Enter your name" />
          </div>
          <div>
            <label htmlFor="name">E-Mail</label>
            <input type="text" id="mail" placeholder="Enter your mail" />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Enter you password"/>
          </div>
          <button type="submit" className = "btn btn-shadow-drop-yellow btn-shadow-drop--yellowblack yellowbtn">Submit</button>
          <h2 className="or">
            OR
          </h2>
        </form>
        <p>
          Have an account? <Link to="/login"> Login </Link>
        </p>
      </div>
    </div>
  )
}

