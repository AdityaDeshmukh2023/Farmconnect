import './resetpassword.css';
import { useState } from 'react';
import { useResetPasswordMutation } from '../../services/userAuthApi';
import { useParams } from "react-router-dom";
import {  Alert, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
export default function ResetPassword() {
  const [server_error,setServerError] = useState({})
 const [server_msg,setServerMsg] = useState({});
 const [resetpassword] = useResetPasswordMutation()
 const {id,token} = useParams();
const navigate = useNavigate();

 const handleSubmit = async (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const actualData = {
    password: data.get('password'),
    password2: data.get('password2'),
  }

  const res = await resetpassword({actualData,id,token})

  if(res.error){
    setServerError(res.error.data.errors)
  }
  if(res.data){
    // console.log(res.data)
    setServerMsg(res.data);
    setServerError({})
    document.getElementById("password-change-form").reset();
    setTimeout(()=>{
      navigate('/auth')
    },3000)
  }
 
};

  return (
    <div className="change-password-wrapper">
      <div className="change-password-container">
        <div className="change-password-box">
          <h2>Reset Password</h2>
          <p>Enter your current and new password below to update your credentials.</p>
          <form onSubmit={handleSubmit} id='password-change-form'>
            <input
              type="password"
              placeholder="New Password"
              className="change-password-input"
              name='password'
            />
            {server_error.password ? <Typography style={{fontSize:12,color:'red',paddingLeft:10}}>{server_error.password[0]}</Typography>: " "}
            <input
              type="password"
              placeholder="Confirm New Password"
              className="change-password-input"
              name='password2'
            />
            {server_error.password2 ? <Typography style={{fontSize:12,color:'red',paddingLeft:10}}>{server_error.password2[0]}</Typography>: " "}
            <button type="submit" className="change-password-btn">
              Reset Password
            </button>
            {server_error.non_field_errors ? <Alert severity='error'>{server_error.non_field_errors[0]}</Alert>:""}
        {server_msg.msg ? <Alert severity='success'>{server_msg['msg']}</Alert>:""}
          </form>
          <a href="/auth" className="back-link">
            Back to Login
          </a> 
        </div>
      </div>
    </div>
  );
}
