import { Link } from 'react-router-dom';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

const preventRefresh = (e: { preventDefault: () => void; }) => {
	e.preventDefault();
};

export default function Login() {
	return (
		<div className="wrapper2 signIn">
			<div className="form">
				<div className="heading">LOGIN</div>
				<form>
					<div>
						<label htmlFor="name">Name</label>
						<input type="text" id="loginname" placeholder="Enter your name" />
					</div>
					<div>
						<label htmlFor="e-mail">E-Mail</label>
						<input type="email" id="e-mail" placeholder="Enter you mail" />
					</div>
					<button type="submit" className="btn btn-shadow-drop-yellow btn-shadow-drop--yellowblack yellowbtn" onClick={preventRefresh}>
						Submit
					</button>
				</form>
				<p id = "pinfo">
					Don't have an account? <Link to="/register"><div className='clickablelink'>Sign In</div></Link>
				</p>
			</div>
		</div>
	);
}