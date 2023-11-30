import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons'; 
import { faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';
import Auth from '../Auth';
import { useNavigate } from 'react-router-dom';

function Register() { 

  const navigate = useNavigate(); 

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [day, setDay] = useState('1');
    const [month, setMonth] = useState('1');
    const [year, setYear] = useState('2023');
    const [gender, setGender] = useState('');
    const [error, setError] = useState('');

    const handleChange = e => {
        const { name, value } = e.target;
        switch (name) {
          case 'name':
            setName(value);
            break;
          case 'email':
            setEmail(value);
            break;
          case 'password':
            setPassword(value);
            break;
          case 'confirmPassword':
            setConfirmPassword(value);
            break;
          case 'day':
            setDay(value);
            break;
          case 'month':
            setMonth(value);
            break;
          case 'year':
            setYear(value);
            break;
          case 'gender':
            setGender(value);
            break;
          default:
            break;
        }
        setError(''); 
      };

      const onSubmit = e => {
        e.preventDefault();
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        
        let data = {
          name,
          email,
          password,
          dateOfBirth: {
            day,
            month,
            year,
          },
          gender,
        };
        axios.post('/api/auth/register', data)
        .then(res => {
          Auth.login(res.data);
          navigate('/flux'); 
        })
        .catch(err => {
          setError(err.response.data.message);
        });        
      }

    return (  
      <div className="d-flex justify-content-center align-items-center vh-100 clr-out " >
        <div className="text-center shadow-lg  rounded">
            <label className="fw-bold fs-1 font stacked-labels">Image Time</label>
            <div>
              <label className="fw-bold fs-4 stacked-labels">Create a new account</label>
            </div>
                <form className="m-3 border border-2 rounded p-3 clr-in " onSubmit={onSubmit}>
                    {error && (
                      <div className="alert alert-danger" role="alert">
                        {error}
                      </div>
                    )}
                    <div className="mb-3 input-group">
                        <span className="input-group-text">
                            <FontAwesomeIcon icon={faUser} style={{ color: '#3053df' }} />
                        </span>
                        <input type="text" name="name" value={name} placeholder="Please enter your name" className="form-control" id="exampleInputName1" aria-describedby="emailHelp" onChange={handleChange} />
                    </div>
                    <div className="mb-3 input-group">
                        <span className="input-group-text">
                          <FontAwesomeIcon icon={faEnvelope} style={{ color: "#3053df" }} />
                        </span>
                        <input type="email" name="email" value={email} placeholder="Please enter your email address" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={handleChange}/>
                    </div>
                    <div className="mb-3 input-group">
                        <span className="input-group-text">
                        < FontAwesomeIcon icon={faLock} style={{ color: '#3053df' }} />
                        </span>
                        <input type="password" name="password" value={password} placeholder="Please enter your password" className="form-control" id="exampleInputPassword1" onChange={handleChange}/>
                    </div>
                    <div className="mb-3 input-group">
                        <span className="input-group-text">
                          <FontAwesomeIcon icon={faRotateLeft} style={{ color: '#3053df' }} />
                        </span>
                        <input type="password" name="confirmPassword" value={confirmPassword} placeholder="Please confirm your password" className="form-control" id="exampleInputPassword2" onChange={handleChange}/>
                    </div>
                    <div className="row border border-2 rounded-4 pb-2">
                        <label className="fw-bolder"> Date of birth </label>
                        <div className="col">
                            <label htmlFor="day">Day</label>
                            <input type="number" name="day" value={day} className="form-control" id="day" placeholder="Day" min="1" max="31" onChange={handleChange}/>
                        </div>
                        <div className="col">
                            <label htmlFor="month">Month</label>
                            <input type="number" name="month" value={month} className="form-control" id="month" placeholder="Month" min="1" max="12" onChange={handleChange}/>
                        </div>
                            <div className="col">
                            <label htmlFor="year">Year</label>
                            <input type="number" name="year" value={year} className="form-control" id="year" placeholder="Year" min="1900" max="2023" onChange={handleChange}/>
                        </div>
                    </div>
                    <div className="pt-3 pb-3">
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="gender" value="woman" id="inlineRadio1" onChange={handleChange}/>
                            <label className="form-check-label" htmlFor="inlineRadio1">Woman</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="gender" value="man" id="inlineRadio2" onChange={handleChange}/>
                            <label className="form-check-label" htmlFor="inlineRadio2">Man</label>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-success p-auto ">Create</button>
                    <p className="pt-4"><a className="link-opacity-25-hover" href="/login">Already have an account?</a></p>
                </form>
            </div>
        </div>
    );
}
    
export default Register;
