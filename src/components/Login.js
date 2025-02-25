import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();
    
    const Auth = async (e) =>{
        e.preventDefault();
        try {
            const response =  await axios.post(`${process.env.REACT_APP_API_URL}login`,{
                username: username,
                password: password
            })
            
            const role = response.data.role; // Ambil role dari respons backend
            // Simpan role di localStorage (opsional, jika ingin persist login)
            localStorage.setItem("role", role);
            
            // Arahkan sesuai role
            if (role === "admin") {
                navigate('/admin');
            } else if (role === "intake") {
                navigate('/intake');
            } else if (role === "production") {
                navigate('/production');
            } else {
                navigate('/dashboard'); // Default jika role tidak dikenali
            }
        } catch (error) {
            if(error.response){
                console.log(error.response.data)
                alert(error.response.data.msg);
            }
        }
    }

  return (
    <section className="hero has-background-dark is-success is-fullheight is-fullwidth">
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-5-tablet is-4-desktop is-3-widescreen">
                <form onSubmit={Auth} className='box'>
                    {/* <p className='has-text-centered'>{msg}</p> */}
                    <div className="field mt-5">
                        <label className="label">Username</label>
                        <div className="controls">
                            <input type="text" className="input" placeholder='Username' value={username}  onChange={(e) => setUsername(e.target.value)}/>
                        </div>
                    </div>
                    <div className="field mt-5">
                        <label className="label">Password</label>
                        <div className="controls">
                            <input type="password" className="input" placeholder='********' value={password} onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                    </div>
                    <div className="field mt-5">
                        <button className="button is-success is-rounded is-fullwidth">Login</button>
                    </div>
                </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login
