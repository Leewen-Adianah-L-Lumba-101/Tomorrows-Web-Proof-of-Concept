import { useEffect, useState } from 'react';

export default function loadingScreen () {

  // const [loading, setLoading] = useState(true)

  // useEffect(() => {
  //     setTimeout(() => {
  //         setLoading(false)
  //     }, 4000);
  // }, [])

  // let $ = (e : any) => document.querySelector(e);
  // let dots = document.getElementsByClassName("dots");

  // function animate (element: any, className: any) {
  //   element.classList.add(className)
  //   setTimeout(() => {
  //       element.classList.remove(className)
  //       setTimeout(() => {
  //       animate(element, className)
  //       }, 500);
  //   }, 2500);
  // }

  // setInterval(() => {
  // }, 8000)
 
  return (
    <div className="loading-container">
    <h1>Loading
      {/* Loading screen with dots, template from */}
      <div className="dots">
        <div className="dot"></div>
        <div className="dot dot2"></div>
        <div className="dot dot3"></div>
      </div>
    </h1>
    </div>
  )
}
