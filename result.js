import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../App';

function Results() {
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResults();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchResults = async () => {
    try {
      const response = await fetch(`${API_URL}/results/latest`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        if (response.status === 404) {
          // No results found, redirect to instructions
          navigate('/instructions');
          return;
        }
        throw new Error('Failed to fetch results');
      }

      const data = await response.json();
      setResults(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleRetake = () => {
    localStorage.removeItem('sessionId');
    navigate('/instructions');
  };

  // Helper function to get color based on theta score
  const getThetaColor = (theta) => {
    if (theta >= 1.5) return 'green';
    if (theta >= 0) return 'amber';
    return 'red';
  };

  // Helper function to get theta class for styling
  const getThetaClass = (theta) => {
    if (theta > 0.5) return 'positive';
    if (theta < -0.5) return 'negative';
    return 'neutral';
  };

  // Calculate marker position on the graph (0-100%)
  const getMarkerPosition = (theta) => {
    // Convert theta from -3 to +3 into 0 to 100%
    return ((theta + 3) / 6) * 100;
  };

  if (loading) {
    return (
      <div className="results-container">
        <div className="loading-screen">
          <div className="loader"></div>
          <p>Loading results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="results-container">
        <div className="error-message">{error}</div>
        <button className="btn-retake" onClick={handleRetake}>
          Start New Assessment
        </button>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="results-container">
        <div className="no-results">
          <h2>No Results Found</h2>
          <p>You haven't completed any assessment yet.</p>
          <button className="btn-retake" onClick={handleRetake}>
            Start Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="results-container">
      <div className="results-header">
        <h1>Your Leadership Assessment Results</h1>
        <p>Based on {results.session?.total_triplets_shown || 0} responses</p>
      </div>

      {/* Theme Summary Table */}
      <section>
        <h2>Theme Summary</h2>
        <table className="theme-table">
          <thead>
            <tr>
              <th>Theme</th>
              <th>Theta Score</th>
              <th>Percentile</th>
            </tr>
          </thead>
          <tbody>
            {results.themes && results.themes.map((theme) => (
              <tr key={theme.id}>
                <td className="theme-name">{theme.name}</td>
                <td className={`theta-score ${getThetaClass(theme.theta)}`}>
                  {theme.theta > 0 ? '+' : ''}{theme.theta}
                </td>
                <td className="percentile">{theme.percentile}th</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Directional Graphs */}
      <section className="graph-section">
        <h2>Score Visualization</h2>
        {results.themes && results.themes.map((theme) => (
          <div key={theme.id} className="theme-graph">
            <div className="graph-title">{theme.name}</div>
            <div className="graph-container">
              <div 
                className="graph-marker" 
                style={{ left: `${getMarkerPosition(theme.theta)}%` }}
              >
                <div className="graph-tooltip">
                  Score: {theme.theta > 0 ? '+' : ''}{theme.theta} | {theme.percentile}th percentile
                </div>
              </div>
            </div>
            <div className="graph-labels">
              <span>Low (−3)</span>
              <span>High (+3)</span>
            </div>
          </div>
        ))}
      </section>

      {/* Strengths and Development Areas */}
      <section className="highlights-section">
        <div className="highlight-card strengths">
          <h3>🏆 Top Strengths</h3>
          {results.strengths && results.strengths.length > 0 ? (
            results.strengths.map((strength, index) => (
              <div key={index} className="highlight-item">
                <div className="highlight-name">{strength.name}</div>
                <div className="highlight-score">
                  Score: {strength.theta > 0 ? '+' : ''}{strength.theta} | {strength.percentile}th percentile
                </div>
              </div>
            ))
          ) : (
            <p>No strengths data available</p>
          )}
        </div>

        <div className="highlight-card development">
          <h3>📈 Development Areas</h3>
          {results.development_areas && results.development_areas.length > 0 ? (
            results.development_areas.map((area, index) => (
              <div key={index} className="highlight-item">
                <div className="highlight-name">{area.name}</div>
                <div className="highlight-score">
                  Score: {area.theta > 0 ? '+' : ''}{area.theta} | {area.percentile}th percentile
                </div>
              </div>
            ))
          ) : (
            <p>No development areas data available</p>
          )}
        </div>
      </section>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button className="btn-retake" onClick={handleRetake}>
          Take Assessment Again
        </button>
      </div>
    </div>
  );
}

export default Results;
