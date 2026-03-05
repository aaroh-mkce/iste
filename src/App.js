import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Institution from './components/Institution';
import VisionMission from './components/VisionMission';
import Events from './components/Events';
import Team from './components/Team';
import Gallery from './components/Gallery';
import Certificates from './components/Certificates';
import Feedback from './components/Feedback';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <About />
      <Institution />
      <VisionMission />
      <Events />
      <Team />
      <Gallery />
      <Certificates />
      <Feedback />
      <Footer />
    </div>
  );
}

export default App;
