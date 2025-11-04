import { useState } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { Home } from './pages/home'
import { Canvas } from './pages/canvas'
import { Gallery } from './pages/maingallery'
import { SignUp } from './pages/signup'

function App() {
  return (
    <Router>
      <Routes>
        <Route path = "/" element = {<Home/>}/>
        <Route path = "/canvas" element = {<Canvas/>}/>
        <Route path = "/maingallery" element = {<Gallery/>}/>
        <Route path = "/signup" element = {<SignUp/>}/>
      </Routes>
    </Router>
  )
}

export default App
      