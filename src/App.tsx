import { useState } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Canvas from './pages/canvas'
import Gallery from './pages/maingallery'
import Login from "./components/Login";
import Register from "./pages/register";
import Error  from "./components/Error";

function App() {
  return (
    <Router>
      <Routes>
        <Route path = "/" element = {<Home/>}/>
        <Route path = "/canvas" element = {<Canvas/>}/>
        <Route path = "/maingallery" element = {<Gallery/>}/>
        <Route path = "/register" element = {<Register/>}/>
        <Route path="/login" element = {<Login/>} />
        <Route element = {<Error/>} />
      </Routes>
    </Router>
  )
}

export default App
      