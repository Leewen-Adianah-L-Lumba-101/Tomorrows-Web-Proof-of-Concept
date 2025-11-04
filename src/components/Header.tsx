// Navigator menu
import Marquee from "react-fast-marquee";
import { Link } from 'react-router-dom';

function Navigator() {
    return (
        <header>
            <div className="navigator">
                <div className="admin-icon">
                    <Link to = "/">
                        <img src = "src/assets/hangit-icon.svg" height = "50px"></img>
                    </Link>
                </div>
                <button className="btn btn-shadow-drop btn-shadow-drop--black cafewhitebtn"> Register </button>
            </div>

            <div className="ticker-wrap">
                <div className="ticker">
                    <div className="ticker__item"><img className="bordertop" src = "src/assets/border-top.svg"/></div>
                </div>
            </div>
        </header>
    )
}

export default Navigator;
