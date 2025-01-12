import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Categories from './components/Categories';
import Meals from './components/Meals';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Categories />} />
          <Route path="/meals/:category" element={<Meals />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
