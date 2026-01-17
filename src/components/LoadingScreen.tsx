export default function loadingScreen () {
 
  return (
    <div className="loading-container">
    <h1>Loading
      {/* Loading screen with dots */}
      <div className="dots">
        <div className="dot"></div>
        <div className="dot dot2"></div>
        <div className="dot dot3"></div>
      </div>
    </h1>
    </div>
  )
}