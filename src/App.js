// src/App.js
import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PremData from './components/PremData'; // Import your PremData component
import Home from './components/Home';
import Contact from './components/Contact';
import About from './components/About';
import DisplayXml from './components/DisplayXml';

// Rename the functional component to AppFunction
function AppFunction() {
  return (
   <Router>

<nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/contact">OurXml</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>

     

        </ul>
      </nav>
      {/* Use Routes component instead of Route */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
  

        
      </Routes>
      
    </Router>
  );
}

class App extends Component {
  render() {
    return (
      <div className="App">



        <h1>My React App</h1>
        {/* Render your PremData component */}
     
        <AppFunction />
   
      </div>
    );
  }
}

export default App;
