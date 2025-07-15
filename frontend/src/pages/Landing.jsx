import React from 'react'
import {Link} from 'react-router-dom'
import "../App.css";
const Landing = () => {
  return (
   <div className="landingPageContainer">
        <nav>
            <div className='navHeader'>
                <a href="#">
                <img src="./logolbg-removed.png" alt="" />
                </a>
            </div>
            <div className='navList'>
                <p>Join as guest</p>
                <p>Register</p>
                <div role='button'>
                    <p>Login</p>
                </div>
            </div>
        </nav>

    <div className="landingMainContainer">
        <div>
            <h1><span style={{color:"#ffffffff"}}>Connect </span>with your peers</h1>
            <p>Ace your Interviews Together</p>

            <div role='button'>
                <Link to="/home">Get Started</Link>
            </div>
        </div>
        <div>
            <img src="./demo3.jpg" alt="intervies" />
        </div>
    </div>
   </div>
  )
}

export default Landing
