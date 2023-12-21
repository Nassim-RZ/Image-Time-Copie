import React from "react";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Login, Register, Profile, Flux} from './views';
import {Route, BrowserRouter as Router, Routes as Switch} from 'react-router-dom'

function App() {
  return (
    <div id="main-container" className="container-fluid">
        <Router>
          <Switch>
            <Route path='/Flux' exact element={<Flux />} redirect='/' />
            <Route path='/Register' exact element={<Register />} redirect='/' />
            <Route path='/' exact element={<Login />} redirect='/' />
            <Route path='/profile/:id' exact element={<Profile />} redirect='/' />
          </Switch>
        </Router>
      </div>
  );
}

export default App;
