// Back to Top Button

export default function BackToTop() {

    function scrollToTop() {
        window.scrollTo({top: 0, behavior: 'smooth'});
    }

    return (
        <div className="backtotopdiv">
            <button id="backtotopbutton" title="Go to top"><img src ="src/assets/arrow-up.svg"
            onClick={scrollToTop}></img></button>
            <img src = "src/assets/button-border.svg" id = "backtotopborder"></img>
        </div>
    )
}