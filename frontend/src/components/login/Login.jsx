import './login.css'
import { useEffect } from "react";
import PropTypes from 'prop-types'
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useRegisterUserMutation, useLoginUserMutation } from '../../services/userAuthApi';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Typography,CircularProgress } from '@mui/material';
import {getToken, storeToken } from '../../services/LocalStorageService';
import { setUserToekn } from '../../features/authSlice';
import { useDispatch } from 'react-redux';

export default function Login(props) {
  const { Handle } = props;
  // console.log(Handle)

  useEffect(() => {
    const signInHandler = () => {
      container.classList.remove("sign-up-mode");
    };
    const signUpHandler = () => {
      container.classList.add("sign-up-mode");
    };

    const sign_in_btn = document.querySelector("#sign-in-btn");
    const sign_up_btn = document.querySelector("#sign-up-btn");
    const container = document.querySelector(".container");

    sign_up_btn.addEventListener("click", signUpHandler);
    sign_in_btn.addEventListener("click", signInHandler);

    return () => {
      sign_up_btn.removeEventListener("click", signUpHandler);
      sign_in_btn.removeEventListener("click", signInHandler);
    };
  }, []);


  const [server_error, setServerError] = useState({})
  const navigate = useNavigate();
  const [registerUser] = useRegisterUserMutation()
  const [loginUser,{isLoading}] = useLoginUserMutation()
  const dispatch = useDispatch();

  const handleRegSubmit = async (e) => {
    e.preventDefault();
    const dataa = new FormData(e.currentTarget);
    const actualDataa = {
      name: dataa.get('name'),
      email: dataa.get('email'),
      password: dataa.get('password'),
      password2: dataa.get('password2'),
      tc: dataa.get('tc'),
    }
    const ress = await registerUser(actualDataa)
    if (ress.error) {
      // console.log(res.error.data.errors)
      setServerError(ress.error.data.errors)
    }
    if (ress.data) {
      // console.log(ress.data)
      storeToken(ress.data.token)
      navigate('/application/land')
    }
  }

  const handleLogInSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
  
    const email = data.get('email');
    const password = data.get('password');
  
    // Validation
    let errors = {};
    if (!email) {
      errors.email = ["Email is required"];
    }
    if (!password) {
      errors.password = ["Password is required"];
    }
  
    setServerError(errors);
  
    // If there are validation errors, stop form submission
    if (Object.keys(errors).length > 0) {
      return;
    }
  
    try {
      const actualData = {
        email,
        password,
      };
  
      const res = await loginUser(actualData);
  
      if (res.error) {
        setServerError(res.error.data.errors);
      } else if (res.data) {
        // console.log(res.data);
        storeToken(res.data.token);
        dispatch(setUserToekn(res.data.token))
        navigate('/application/land');
      }
    } catch (err) {
      console.error("An unexpected error occurred during login:", err);
      setServerError({ general: "Something went wrong. Please try again." });
    }
  };//handleLogINSubmit Ends Here
  

  const handleForgotClick = () => {
    navigate('/forget')
  }



  let {access_token} = getToken();
  useEffect(()=>{
    dispatch(setUserToekn(access_token));
    // console.log(access_token)
  },[access_token,dispatch])
  
  return (

    <div className="auth-page">

      <div className="container">

        <div className="forms-container">
          <div className="signin-signup">

            <form action="#" className="sign-in-form" onSubmit={handleLogInSubmit}>
              <h2 className="title">Sign In</h2>
              <div className="input-field">
                <i className="fas fa-user"></i>
                <input type="text" placeholder="Email" name='email'/>
              </div>
              {server_error.email ? <Typography style={{
                fontSize: 12,
                color: 'red',
                paddingLeft: 10
              }}>{server_error.email[0]}</Typography> : ""}
              <div className="input-field">
                <i className="fas fa-lock"></i>
                <input type="password" placeholder="Password" name='password'/>
              </div>
              {server_error.password ? <Typography style={{
                fontSize: 12,
                color: 'red',
                paddingLeft: 10
              }}>{server_error.password[0]}</Typography> : ""}
              <label htmlFor="forgotpass" className='forgetpass' onClick={handleForgotClick}>Forgot Password ?</label>


              {isLoading ? <CircularProgress color='green'/> :  <input type="submit" value="Login" className="btn solid"/>}

              {server_error.non_field_errors && server_error.non_field_errors.length > 0 ? (
                <div style={{ color: "red" }}>{server_error.non_field_errors[0]}</div>
              ) : (
                ""
              )}

              <p className="social-text">Or Sign in with social platforms</p>
              <div className="social-media">
                <a href="https://chat.whatsapp.com/H0TQTvaMh8N1mufwLswBSW" className="social-icon">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="https://chat.whatsapp.com/H0TQTvaMh8N1mufwLswBSW" className="social-icon">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="https://chat.whatsapp.com/H0TQTvaMh8N1mufwLswBSW" className="social-icon">
                  <i className="fab fa-google"></i>
                </a>
                <a href="https://chat.whatsapp.com/H0TQTvaMh8N1mufwLswBSW" className="social-icon">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </form>


            <form action="#" className="sign-up-form" onSubmit={handleRegSubmit}>
              <h2 className="title">Sign Up</h2>
              <div className="input-field">
                <i className="fas fa-user"></i>
                <input type="text" placeholder="Name" name='name' />
              </div>
              {server_error.name ? <Typography style={{
                fontSize: 12,
                color: 'red',
                paddingLeft: 10
              }}>{server_error.name[0]}</Typography> : ""}
              <div className="input-field">
                <i className="fas fa-envelope"></i>
                <input type="email" placeholder="Email" name='email' />
              </div>
              {server_error.email ? <Typography style={{
                fontSize: 12,
                color: 'red',
                paddingLeft: 10
              }}>{server_error.email[0]}</Typography> : ""}
              <div className="input-field">
                <i className="fas fa-lock"></i>
                <input type="password" placeholder="Password" name='password' />
              </div>
              {server_error.password ? <Typography style={{
                fontSize: 12,
                color: 'red',
                paddingLeft: 10
              }}>{server_error.password[0]}</Typography> : ""}
              <div className="input-field">
                <i className="fas fa-lock"></i>
                <input type="password" placeholder="Password" name='password2' />
              </div>
              {server_error.password2 ? <Typography style={{
                fontSize: 12,
                color: 'red',
                paddingLeft: 10
              }}>{server_error.password2[0]}</Typography> : ""}
              <label htmlFor="tc">
                <input type="checkbox" id="tc" name="tc" value="true" placeholder="I agree Terms and Conditions" />
                I agree to the Terms and Conditions
              </label>
              {server_error.non_field_errors && server_error.non_field_errors.length > 0 ? (
                <div style={{ color: "red" }}>{server_error.non_field_errors[0]}</div>
              ) : (
                ""
              )}
              <input type="submit" className="btn" value="Sign Up" />
              <p className="social-text">Or Sign up with social platforms</p>
              <div className="social-media">
                <a href="https://chat.whatsapp.com/H0TQTvaMh8N1mufwLswBSW" className="social-icon">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="https://chat.whatsapp.com/H0TQTvaMh8N1mufwLswBSW" className="social-icon">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="https://chat.whatsapp.com/H0TQTvaMh8N1mufwLswBSW" className="social-icon">
                  <i className="fab fa-google"></i>
                </a>
                <a href="https://chat.whatsapp.com/H0TQTvaMh8N1mufwLswBSW" className="social-icon">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </form>
          </div>
        </div>

        <div className="panels-container">
          <div className="panel left-panel">
            <div className="content">
              <h3>New here ?</h3>
              <p>
                Sign up to unlock more features like personalized farm insights, real-time weather updates, crop health monitoring, and market trend analysis. Access expert advice, new schemes, and join a community of farmers to grow your farm efficiently
              </p>
              <button className="btn transparent" id="sign-up-btn">
                Sign Up
              </button>
            </div>
            <img src="assets/auth/log.svg" className="image" alt="Sign in illustration" />
          </div>
          <div className="panel right-panel">
            <div className="content">
              <h3>One of us ?</h3>
              <p>
                Sign in for personalized updates on your farm's progress, weather forecasts, crop health, and market trends. Access expert advice, new farming schemes, and community discussions. Stay informed with real-time insights tailored to your farm.
              </p>
              <br />
              <button className="btn transparent" id="sign-in-btn">
                Sign In
              </button>
            </div>
            <img src="assets/auth/register.svg" className="image" alt="Sign up illustration" />
          </div>
        </div>
      </div>
    </div>
  )
}
Login.propTypes = {
  Handle: PropTypes.func.isRequired,
};