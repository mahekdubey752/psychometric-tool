import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Processing() {
  const navigate = useNavigate();

  useEffect(() => {
    // Wait a moment for the scores to be computed, then navigate to results
    const timer = setTimeout(() => {
      navigate('/results');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="processing-container">
      <div className="processing-spinner"></div>
      <div className="processing-message">
        <h2>Computing Your Results</h2>
        <p>
          Please wait while we analyze your responses and calculate your leadership profile...
        </p>
      </div>
    </div>
  );
}

export default Processing;
