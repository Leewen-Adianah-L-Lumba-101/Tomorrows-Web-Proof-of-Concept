import Navigator from '../components/Header'
import BackToTop from '../components/BacktoTop'
import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div className = "index">
      <div className="header">
          <Navigator/>
      </div>

      <div className="opening">
        <div className='frontheading'>
          <h1>WELCOME TO</h1>
          <img src = "src\assets\hangit-logo-full-brown.svg"></img>
          <Link to = "/canvas">
            <button className= 'btn btn-shadow-drop-yellow btn-shadow-drop--yellowblack yellowbtn'>
                <img src = "src\assets\drawnew-icon.svg"></img>Start Drawing
            </button>
          </Link>
        </div>
      </div>

      <div className="instr1">
        <div className="instructions">Instructions</div>
        <div className='instrcontainerleft'>
          <img src = "src\assets\instr1-img.svg"></img>
          <div className=''>
            <h2>1. Start a Canvas</h2>
            <p> The very cornerstone of <span>HANGIT!</span> is to first make merry with your lines! Press
               the START DRAWING button to open up your canvas. Write your initials, draw smiley faces, 
               share with the world your little talents and hit SAVE. If you feel unready or want a fresh 
               start, press CLEAR.</p>
          </div>
        </div>
      </div>

      <div className="instr2">
        <div className='instrcontainerright'>
          <img src = "src\assets\instr2-img.svg"></img>
          <div className=''>
            <h2>2. Hang it Up</h2>
            <p> All works are automatically saved to your private gallery regardless of visibility!
              If you’re ready to take up a post at our public boards. Change the icon to <img></img> after 
              you <span>SAVE.</span> 
            </p>
            
            <p>
              To toggle this, press the eye icon again before hitting <span>PUBLISH.</span>
              <span>Be careful! Hitting publish will permanently store your artwork at the public gallery.</span>
            </p>

          </div>
        </div>
      </div>
      
      <div className="instr3">
        <div className='instrcontainerleft'>
          <img src = "src\assets\instr3-img.svg"></img>
          <div className=''>
            <h2>3. View your Work</h2>
            <p> Click the top left icon to view the public gallery or your profile!
                Your work can be seen in both your profile and (if allowed PUBLIC) in the public gallery.
            </p>
          </div>
        </div>
      </div>

      <div className="gotit">
         <div className="gotitheader">
            <div className='instructions'>
              Think you got it?
            </div>

            <p className="gotitinfo">
              Pick up that virtual pencil and get on with it!
            </p>
          </div>
         

         <div className="button-panel">
          <Link to = "/canvas">
            <button className= 'btn btn-shadow-drop-yellow btn-shadow-drop--yellowblack yellowbtn'>
                <img src = "src\assets\drawnew-icon.svg"></img>Start Drawing
            </button>
          </Link>

          {/* <Link to = "/canvas"> */}
              <button className="btn btn-shadow-drop btn-shadow-drop--black cafewhitebtn">
                <img src = "src/assets/user-icon.svg"></img>Register 
              </button>
          {/* </Link> */}

         </div>

        <div className="slider">
	        <div className="slide-track">
            <div className="slide">
			        <img src="src/assets/single-panel.png" width="250" alt="" />
		        </div>
          
            <div className="slide">
			        <img src="src/assets/single-panel.png" width="250" alt="" />
		        </div>

		        <div className="slide">
			        <img src="src/assets/single-panel.png" width="250" alt="" />
		        </div>

            <div className="slide">
			        <img src="src/assets/single-panel.png" width="250" alt="" />
		        </div>

            <div className="slide">
			        <img src="src/assets/single-panel.png" width="250" alt="" />
		        </div>
            
            <div className="slide">
			        <img src="src/assets/single-panel.png" width="250" alt="" />
		        </div>

            <div className="slide">
			        <img src="src/assets/single-panel.png" width="250" alt="" />
		        </div>

            <div className="slide">
			        <img src="src/assets/single-panel.png" width="250" alt="" />
		        </div>

            
            <div className="slide">
			        <img src="src/assets/single-panel.png" width="250" alt="" />
		        </div>
            
            <div className="slide">
			        <img src="src/assets/single-panel.png" width="250" alt="" />
		        </div>

            <div className="slide">
			        <img src="src/assets/single-panel.png" width="250" alt="" />
		        </div>
            
            <div className="slide">
			        <img src="src/assets/single-panel.png" width="250" alt="" />
		        </div>
          </div>
        </div>
      </div>

      <div className="footer">
        <img src = "src/assets/hangit-logo-full.svg"></img>
        <h1 className='yearfooter'>2025</h1>
      </div>
      <BackToTop/>

    </div>
  )
}

export default Home;