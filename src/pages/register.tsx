// filepath: c:\Users\hp\Desktop\Git Repositories\Tomorrows-Web-Proof-of-Concept\src\pages\register.tsx
import React from 'react';
import LoginMorpher from '../components/LoginMorpher';
import { Link } from 'react-router-dom';

export default function Register() {
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {

    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('mail') as string,
      password: formData.get('password') as string,
    };

    try {
      const response = await fetch('http://localhost:3001/sendmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),  // Fixed: no extra {formData}
      });

      const result = await response.json();
      if (response.ok) {
        window.location.href = '/login';
        
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
          Have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
