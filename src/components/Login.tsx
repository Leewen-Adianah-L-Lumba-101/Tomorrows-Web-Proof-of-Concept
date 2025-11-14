import { Link } from 'react-router-dom';

const preventRefresh = (e: { preventDefault: () => void; }) => {
	e.preventDefault();
};

export default function Login() {
	return (
		<div className="wrapper signIn">
			<div className="form">
				<div className="heading">LOGIN</div>
				<form>
					<div>
						<label htmlFor="name">Name</label>
						<input type="text" id="name" placeholder="Enter your name" />
					</div>
					<div>
						<label htmlFor="e-mail">E-Mail</label>
						<input type="email" id="e-mail" placeholder="Enter you mail" />
					</div>
					<button type="submit" onClick={preventRefresh}>
						Submit
					</button>
				</form>
				<p>
					Don't have an account? <Link to="/register"><div className='clickablelink'> Sign In </div> </Link>
				</p>
			</div>
		</div>
	);
}