import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Instructions from './pages/Instructions';
import TakeTest from './pages/TakeTest';
import Processing from './pages/Processing';
import Results from './pages/Results';
import './App.css';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('sessionId');
    setUser(null);
  };

  if (loading) {
    return <div className="loading-screen"><div className="loader"></div></div>;
  }

  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <div className="nav-logo">Psychometric Assessment</div>
            <div className="nav-menu">
              {user ? (
                <>
                  <span className="nav-user">Welcome, {user.full_name || user.email}</span>
                  <button onClick={handleLogout} className="btn-logout">Logout</button>
                </>
              ) : null}
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={user ? <Navigate to="/instructions" /> : <Login onLogin={handleLogin} />} />
            <Route path="/login" element={user ? <Navigate to="/instructions" /> : <Login onLogin={handleLogin} />} />
            <Route path="/instructions" element={user ? <Instructions /> : <Navigate to="/login" />} />
            <Route path="/assessment" element={user ? <TakeTest /> : <Navigate to="/login" />} />
            <Route path="/processing" element={user ? <Processing /> : <Navigate to="/login" />} />
            <Route path="/results" element={user ? <Results /> : <Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>&copy; 2024 Psychometric Assessment Platform</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
export { API_URL };
