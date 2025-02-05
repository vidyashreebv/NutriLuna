import React, { useState } from 'react';
import './LoginRegister.css';
import { PiUserFill,PiEnvelopeSimpleBold } from "react-icons/pi";
import { TbPasswordUser } from "react-icons/tb";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


const LoginRegister = () => {

    const[action,setAction]=useState('');
    const registerLink = () => {
        setAction('activate');
    };

    const loginLink = () => {
        setAction('');
    };

    return(
    <div className='loginregister'>
    <div className={`Wrapper ${action}`}>
            <div className="form-box-login">
                <form action="">
                    <h1>Login</h1>

                    <div className="input-box">
                        <input type='text' placeholder='username' required />
                        <PiUserFill className='icon'/>


                    </div>

                    <div className="input-box">
                        <input type='password'  placeholder='password' required />
                        <TbPasswordUser className='icon' />

                    </div>

                    <div className="remember-forget">
                        <label>
                            <input type='checkbox'/>
                            Remember me
                        </label>
                    </div>

                    <button type='submit'>Login</button>

                    <div className="new-register-link">
                        <p>
                            Don't have an account?
                            <a href='#' onClick={registerLink}>Register</a>               
                        </p>
                    </div>
                </form>
            </div>



            
            <div className="form-box-register">
                <form action="">
                    <h1>Register</h1>

                    <div className="input-box">
                        <input type='text' placeholder='username' required />
                        <PiUserFill className='icon'/>
                    </div>
                    <div className="input-box">
                        <input type='email' placeholder='Email' required />
                        <PiEnvelopeSimpleBold className='icon'/>
                        </div>

                    <div className="input-box">
                        <input type='password'  placeholder='password' required />
                        <TbPasswordUser className='icon' />

                    </div>

                    <div className="terms-condition">
                        <label>
                            <input type='checkbox'/>
                              I agree to the <a href='#'>terms and conditions</a>
                        </label>
                    </div>

                    <button type='submit'>Register</button>

                    <div className="login-link">
                        <p>
                            Already have an account?
                            <a href='#' onClick={loginLink}>Login</a>               
                        </p>
                    </div>
                </form>
            </div>             
        </div> 
    </div>
    );
};

export default LoginRegister
