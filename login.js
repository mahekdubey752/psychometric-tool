import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../App';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          full_name: fullName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      onLogin(data.user, data.access_token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h1>{isRegister ? 'Create Account' : 'Welcome Back'}</h1>
        <p>{isRegister ? 'Sign up for the Psychometric Assessment' : 'Sign in to continue'}</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        {isRegister && (
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              required={isRegister}
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
        </button>
      </form>

      <div className="login-footer">
        {isRegister ? (
          <p>
            Already have an account?{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); setIsRegister(false); }}>
              Sign In
            </a>
          </p>
        ) : (
          <p>
            Don't have an account?{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); setIsRegister(true); }}>
              Sign Up
            </a>
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;
