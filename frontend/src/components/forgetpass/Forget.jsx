import './forget.css';
import { useSendPasswordResetEmailMutation } from '../../services/userAuthApi';
import { useState } from 'react';
import { Alert ,CircularProgress,Typography} from "@mui/material";
export default function Forget() {
  const [server_error,setServerError] = useState({})
 const [server_msg,setServerMsg] = useState({});
 const [sendPasswordResetEmail,{isLoading}] = useSendPasswordResetEmailMutation()

 const handleSubmit = async (e) => {
  e.preventDefault();
  const data = new FormData(e.currentTarget);
  const actualData = {
    email: data.get('email'),
  }
  const res = await sendPasswordResetEmail(actualData)
  if(res.error){
    setServerError(res.error.data.errors)
  }
  if(res.data){
    // console.log(res.data)
    setServerMsg(res.data);
    setServerError({})
    document.getElementById("password-reset-email-form").reset();
  }
 
}
  return (
    <div className="forget-wrapper">

   
    <div className="forget-container">
      <div className="forget-box">
        <h2>Forgot Password</h2>
        <p>Enter your email address, and we'll send you a link to reset your password.</p>
        <form onSubmit={handleSubmit} id='password-reset-email-form'>
          <input
            type="email"
            placeholder="Enter your email"
            className="forget-input"
            required
            name='email'
          />
          {server_error.email ? <Typography style={{fontSize:12,color:'red',paddingLeft:10}}>{server_error.email[0]}</Typography>: " "}
          
          {isLoading ? <CircularProgress/> : <button type="submit" className="forget-btn">Send Reset Link</button>}
        </form>
        <br />
    
        {server_error.non_field_errors ? <Alert severity='error'>{server_error.non_field_errors[0]}</Alert>:""}
        {server_msg.msg ? <Alert severity='success'>{server_msg['msg']}</Alert>:""}
        <br />
       
        <a href="/auth" className="back-link">Back to Login</a>
      </div>
    </div>
    </div>
  );
}