import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons'; 
import axios from 'axios';
import Auth from '../Auth';
import { useNavigate } from 'react-router-dom';
const backendUrl = process.env.REACT_APP_MONGODB_URL

function Login() {

    const navigate = useNavigate(); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Function to handle changes in input fields
    const handleChange = e => {
        const { name, value } = e.target;
        switch (name) {
          case 'email':
            setEmail(value);
            break;
          case 'password':
            setPassword(value);
            break;
          default:
            break;
        }
        setError(''); 
      };

    // Function to handle form submission 
    const onSubmit = e => {
      e.preventDefault();
      let data = {
        email,
        password,
      };

axios.post('https://image-time-backend.onrender.com/api/auth', data)
  .then(res => {
    console.log('Response:', res); // Inspectez la réponse
    if (res.data && res.data) {
      const { accessToken } = res.data.data;
          const id  = res.data.data.id;
          if (accessToken) {
            localStorage.setItem('authToken', accessToken);
            Auth.login(res.data);
            // navigate('/flux');
            console.log('Response:', res);
          } else {
            console.error("Structure de réponse invalide :", res.data);
    }
  })
  .catch(err => {
    console.error('Error:', err); // Inspectez l'erreur
    if (err.response) {
      console.error('Error response:', err.response); // Inspectez la réponse d'erreur
      setError(err.response.data.message); 
    } else {
      setError('Une erreur s\'est produite'); 
    }
  });    
      }

      // Function to navigate to the registration page
      const navigateToRegister = () => {
        navigate('/register');
      };

  return (  
    <div className="d-flex justify-content-center align-items-center vh-100 clr-out  ">
        <div className="text-center col-10 col-sm-8 col-md-6 col-lg-4 shadow-lg  rounded">
          <label className="fw-bold fs-1 font stacked-labels">Image Time</label>
          <div>
            <label className="fw-bold fs-4 stacked-labels">Login</label>
          </div>
          <form className="m-3 border border-2 rounded p-3 clr-in " onSubmit={onSubmit}>
             {error && (
                <div className="alert alert-danger" role="alert">
                  Invalid email or password
                </div>
              )}
              <div>
                <label htmlFor="exampleInputPassword1" className="form-label d-flex justify-content-start align-items-start fw-bolder">Email address</label>
                <div className="mb-3 input-group">
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faUser} style={{ color: '#3053df' }} />
                  </span>
                  <input type="text" name="email" value={email} placeholder="Please enter your Email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={handleChange}/>
                </div>
              </div>
                <div>
                  <label htmlFor="exampleInputPassword1" className="form-label d-flex justify-content-start align-items-start fw-bolder">Password</label>
                  <div className="mb-3 input-group">
                    <span className="input-group-text">
                      <FontAwesomeIcon icon={faLock} style={{ color: '#3053df' }} />
                    </span>
                    <input type="password" name="password" value={password}placeholder="Please enter your password" className="form-control" id="exampleInputPassword1" onChange={handleChange}/>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary p-auto">Login</button>
                <div className=" pt-2 fw-bolder"> or</div>
                <div className="pt-3">
                  <button type="button" className="btn btn-success ps-auto"  onClick={navigateToRegister}>Create a new account</button>
                </div>
              </form>
          </div>
       </div>
    );
}

export default Login;
