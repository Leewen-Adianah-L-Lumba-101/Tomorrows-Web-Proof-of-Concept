// Navigator menu
import { Link } from 'react-router-dom';

export default function Navigator() {
    return (
        <header>
            <div className="navigator">
                <div className="admin-icon">
                    <Link to = "/">
                        <img src = "src/assets/hangit-icon.svg" height = "50px"></img>
                    </Link>
                </div>
                <Link to = "/register">
                    <button className="btn btn-shadow-drop btn-shadow-drop--black cafewhitebtn"> Sign Up </button>
                </Link>
            </div>

            <div className="ticker-wrap">
                <div className="ticker">
                    <div className="ticker__item"><img className="bordertop" src = "src/assets/border-top.svg"/></div>
                </div>
            </div>
        </header>
    )
}