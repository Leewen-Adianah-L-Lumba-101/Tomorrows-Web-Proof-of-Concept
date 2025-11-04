import { useState } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { Home } from './pages/home'
import { Canvas } from './pages/canvas'

function App() {
  return (
    <Router>
      <Routes>
        <Route path = "/" element = {<Home/>}/>
        <Route path = "/canvas" element = {<Canvas/>}/>
      </Routes>
    </Router>
  )
}

export default App
      