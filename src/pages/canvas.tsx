import Navigator from '../components/Header'
import BackToTop from '../components/BacktoTop'
import { useEffect, useState } from 'react'
import LoadingScreen from '../components/LoadingScreen'

export default function Canvas() {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 5000);
    }, [])

    return (    
    <div className='bodyCanvas'>
        {/* If loading is set as true, pull up the loading screen */}
        { loading ? (
            <LoadingScreen/>
        ) :
            (
                <div className="">
                    <Navigator/>
                    <div className='canvasArea'>
                        <div className="container">
                            {/* Tools Board */}
                            <section className="tools-board">
                                <div className="row">
                                    <label className="title">Shapes</label>
                                    <ul className="options">
                                        <li className="option tool" id="rectangle">
                                            <img src="icons/rectangle.svg" alt=""></img>
                                            <span>Rectangle</span>
                                        </li>
                                        <li className="option tool" id="circle">
                                            <img src="icons/circle.svg" alt=""></img>
                                            <span>Circle</span>
                                        </li>
                                        <li className="option tool" id="triangle">
                                            <img src="icons/triangle.svg" alt=""></img>
                                            <span>Triangle</span>
                                        </li>
                                        <li className="option">
                                        </li>
                                    </ul>
                                </div>
                                <div className="row">
                                    <label className="title">Options</label>
                                    <ul className="options">
                                        <li className="option active tool" id="brush">
                                            <img src="icons/brush.svg" alt=""></img>
                                            <span>Brush</span>
                                        </li>
                                        <li className="option tool" id="eraser">
                                            <img src="icons/eraser.svg" alt=""></img>
                                            <span>Eraser</span>
                                        </li>
                                        <li className="option">
                                            <input type="range" id="size-slider" min="1" max="30" value="5" />
                                        </li>
                                    </ul>
                                </div>
                                <div className="row colors">
                                    <label className="title">Colors</label>
                                    <ul className="options">
                                        <li className="option"></li>
                                        <li className="option selected"></li>
                                        <li className="option"></li>
                                        <li className="option"></li>
                                        <li className="option">
                                            <input type="color" id="color-picker" value="#4A98F7" />
                                        </li>
                                    </ul>
                                </div>
                                <div className="row buttons">
                                    <button className="clear-canvas btn btn-shadow-drop-yellow btn-shadow-drop--yellowblack yellowbtn">Clear Canvas</button>
                                    <button className="save-img btn btn-shadow-drop btn-shadow-drop--black cafewhitebtn">Save As Image</button>
                                </div>
                            </section>

                            {/* Canvas Section */}
                            <section className="drawing-board">
                                <canvas></canvas>
                            </section>
                        </div>
                    </div>
                </div>
            )
        }
    </div>
    )
}