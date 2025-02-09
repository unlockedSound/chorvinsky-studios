import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Film from './components/Film';
import Footer from "./components/Footer";
import Header from "./components/Header";


function App() {
    return (
        <Router>
            <div>
                <Header/>
                {/* Navigation shows on every page */}
                <Navigation />
                {/* Define your routes */}
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/film" element={<Film />} />
                </Routes>
                <Footer/>
            </div>
        </Router>
    );
}

export default App;
