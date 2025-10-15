import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import Message from './Message'

import Navigator from './Header-Footer'
import BackToTop from './BacktoTop'
import Marquee from "react-fast-marquee";

function App() {
  return (
    <div className = "index">
      <div className="header">
          <Navigator/>
      </div>

      <div className="opening">
        <Marquee direction="up" speed={30} autoFill={true} className='panel1'><img src = "/single-panel.png"></img></Marquee>
        <Marquee direction="down" speed={30} autoFill={true} className='panel2'><img src = "/single-panel.png"></img></Marquee>
        <Marquee direction="up" speed={30} autoFill={true} className='panel3'><img src = "/single-panel.png"></img></Marquee>
        <Marquee direction="down" speed={30} autoFill={true} className='panel4'><img src = "/single-panel.png"></img></Marquee>

        <div className='frontheading'>
          <h1>WELCOME TO</h1>
          <img src = "/hangit-logo-full-brown.svg"></img>
        </div>

      </div>

      <div className="instr1">
      </div>

      <div className="instr2">
      </div>
      
      <div className="instr3">
      </div>

      <div className="gotit">
      </div>

      <div className="footer">
      </div>

      <BackToTop/>
    
    </div>
  )
}

export default App

    // <div className="App">
    // </div>
  // const [count, setCount] = useState(0)
{/* <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
          <div><Message/></div>
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
      