import React from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {

  const navigate = useNavigate();
  const Logout= async() => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}logout`);
      navigate('/');
    } catch (error) {
      console.log(error);
      
    }
  }
  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="container">
      <div className="navbar-brand">
        <a className='navbar-item' href='#'>
          <img src="/japfalogo.jpeg" alt='logo JAPFA'/>
        </a>
    
        <a href='/' role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              <button onClick={Logout}className="button is-light">
                Log Out
              </button>
            </div>
          </div>
    </div>
    </div>
</nav>
)
}

export default Navbar
