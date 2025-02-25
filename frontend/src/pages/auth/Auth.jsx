import './auth.css';
import Login from '../../components/login/Login';
import Application from '../application/Application'
import { Routes,Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import PropTypes  from 'prop-types'





export default function Auth(props) {

  const navigate = useNavigate();
  

  const HandleLogInClick = () => {
    navigate('/application/land');
  };

  
  const LogIn = () =>{
    return <Login Handle={HandleLogInClick}/>
  }
  
  const LogOut = () =>{
   return <Application city={props.city}/>
  }

  return (
   
    <Routes>
      <Route path="/" element={<LogIn/>}/> 
      <Route path="land" element={<LogOut/>}/> 
    </Routes>
 
)

}

Auth.propTypes = {
    city : PropTypes.string,
    name : PropTypes.string,

  }