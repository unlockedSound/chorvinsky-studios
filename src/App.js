<<<<<<< HEAD
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Film from './components/Film';
import Footer from "./components/Footer";
import Header from "./components/Header";
import Admin from './components/Admin';

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
                    <Route path="/admin" element={<Admin />} />
                </Routes>
                <Footer/>
            </div>
        </Router>
=======
import './App.css';
import React, {Component} from 'react';


function App() {
    return (
        <div className="bg-white dark:bg-gray-900">
            <header>
                <div className="relative bg-white dark:bg-gray-900">
                    <div
                        className="max-w-7xl mx-0 px-4 py-2 sm:px-6 md:justify-start md:space-x-10 lg:px-8">
                        <div className="flex sm:flex-row flex-col justify-between">
                            <div className="flex justify-start w-full">
                                <img className="h-10 w-auto sm:h-16"
                                     src="./logo_purple.svg"
                                     alt=""/>
                                <div className="pl-3 sm:pl-6 py-1 text-3xl sm:text-4xl align-middle font-extrabold my-auto text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-900 dark:from-purple-400 dark:to-indigo-300">
                                    Chorvinsky Studios <span className="text-lg sm:text-xl">by&nbsp;David&nbsp;Chorvinsky</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main>
                <div className="">
                    <div className="bg-gradient-to-b from-white to-white dark:from-gray-900 dark:to-black overflow-auto">
                        <div className="columns-1 sm:columns-2 xl:columns-3 lg:gap-12 lg:m-10">
                            <img className="w-full aspect-auto relative bg-black dark:bg-white p-3" alt=" " src="./chorvinskystudios-00045.jpg"/>
                            <img className="w-full aspect-auto relative bg-black dark:bg-white p-3 mt-8" alt=" " src="./chorvinskystudios-02264.jpg"/>
                            <img className="w-full aspect-auto relative bg-black dark:bg-white p-3 mt-8" alt=" " src="./chorvinskystudios-04984.jpg"/>
                            <img className="w-full aspect-auto relative bg-black dark:bg-white p-3 mt-8" alt=" " src="./chorvinskystudios-05070.jpg"/>
                            <img className="w-full aspect-auto relative bg-black dark:bg-white p-3 mt-8" alt=" " src="./chorvinskystudios--6.jpg"/>
                            <img className="w-full aspect-auto relative bg-black dark:bg-white p-3 mt-8" alt=" " src="./chorvinskystudios-08849.jpg"/>
                            <img className="w-full aspect-auto relative bg-black dark:bg-white p-3 mt-8" alt=" " src="./chorvinskystudios-05998.jpg"/>
                            <img className="w-full aspect-auto relative bg-black dark:bg-white p-3 mt-8" alt=" " src="./chorvinskystudios-09282-2.jpg"/>
                            <img className="w-full aspect-auto relative bg-black dark:bg-white p-3 mt-8" alt=" " src="./chorvinskystudios-06280-2.jpg"/>
                            <img className="w-full aspect-auto relative bg-black dark:bg-white p-3 mt-8" alt=" " src="./chorvinskystudios-07703.jpg"/>
                            <img className="w-full aspect-auto relative bg-black dark:bg-white p-3 mt-8" alt=" " src="./chorvinskystudios-09074.jpg"/>
                            <img className="w-full aspect-auto relative bg-black dark:bg-white p-3 mt-8" alt=" " src="./chorvinskystudios-05255.jpg"/>
                            <img className="w-full aspect-auto relative bg-black dark:bg-white p-3 mt-8" alt=" " src="./chorvinskystudios-07888.jpg"/>
                            <img className="w-full aspect-auto relative bg-black dark:bg-white p-3 mt-8" alt=" " src="./chorvinskystudios-08185.jpg"/>

                        </div>
                    </div>
                </div>
            </main>
            <footer className="bg-gray-50 dark:bg-black" aria-labelledby="footer-heading">
                <div className="max-w-7xl mx-auto pb-5 px-4 sm:px-6 lg:px-8 pt-4">
                    <div
                        className="md:flex md:items-center md:justify-between">
                        <p className="mt-8 text-base text-gray-600 dark:text-white md:mt-0 md:order-1">
                            &copy; 2023 Chorvinsky Studios by David Chorvinsky, All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>

>>>>>>> parent of 3eea06a (adds the film page)
    );
}

export default App;
