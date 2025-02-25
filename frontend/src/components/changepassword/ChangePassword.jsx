import './changepassword.css';
import { useState } from 'react';
import { useChnageUserPasswordMutation } from '../../services/userAuthApi';
import {getToken} from '../../services/LocalStorageService'
import {  Alert, Typography } from '@mui/material';

export default function ChangePassword() {
  const [server_error,setServerError] = useState({})
 const [server_msg,setServerMsg] = useState({});
 const [changeUserPassword] = useChnageUserPasswordMutation()
 const {access_token} = getToken()
 const handleSubmit = async (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const actualData = {
    password: data.get('password'),
    password2: data.get('password2'),
  }

  const res = await changeUserPassword({actualData,access_token})

  if(res.error){
    setServerError(res.error.data.errors)
  }
  if(res.data){
    // console.log(res.data)
    setServerMsg(res.data);
    setServerError({})
    document.getElementById("password-change-form").reset();
  }
 
};

  return (
    <div className="change-password-wrapper">
      <div className="change-password-container">
        <div className="change-password-box">
          <h2>Change Password</h2>
          <p>Enter your current and new password below to update your credentials.</p>
          <form onSubmit={handleSubmit} id='password-change-form'>
            <input
              type="password"
              placeholder="Current Password"
              className="change-password-input"
              name='current-password'
            />
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
              Update Password
            </button>
            {server_error.non_field_errors ? <Alert severity='error'>{server_error.non_field_errors[0]}</Alert>:""}
        {server_msg.msg ? <Alert severity='success'>{server_msg['msg']}</Alert>:""}
          </form>
          <a href="/application/profile-view" className="back-link">
            Back to Profile
          </a>
        </div>
      </div>
    </div>
  );
}
