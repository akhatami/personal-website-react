import React from 'react';
import {Route, Routes} from 'react-router-dom';

import HomePage from './components/HomePage';
import LastfmStats from './components/LastfmStats';
import Publications from "./components/Publications";
import Contact from "./components/Contact";
import Interests from "./components/Interests";
const App = () => {
    return (
        <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<HomePage />} />
                <Route path="/lastfm-stats" element={<LastfmStats />} />
                <Route path="/publications" element={<Publications />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/interests" element={<Interests />} />
        </Routes>
    );
};

export default App;
