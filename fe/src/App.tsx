import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Resume from './pages/Resume';
import Snippets from './pages/Snippets';
import Contact from './pages/Contact';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-indigo-100 to-pink-100 flex flex-col">
        <Navbar />
        <main className="flex-1 flex justify-center items-start py-8 px-2 sm:px-6 lg:px-8">
          <div className="w-full max-w-4xl bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-10 mt-6 mb-10">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/resume" element={<Resume />} />
              <Route path="/snippets" element={<Snippets />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
