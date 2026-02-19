import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../App';

function TakeTest() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [triplet, setTriplet] = useState(null);
  const [mostLikely, setMostLikely] = useState(null);
  const [leastLikely, setLeastLikely] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // Start assessment and get first triplet
  useEffect(() => {
    const initializeAssessment = async () => {
      try {
        // First, try to start a new session
        const startResponse = await fetch(`${API_URL}/assessment/start`, {
          method: 'POST',
          headers: getAuthHeaders()
        });

        if (!startResponse.ok) {
          throw new Error('Failed to start assessment');
        }

        const startData = await startResponse.json();
        const sessionId = startData.session.id;
        localStorage.setItem('sessionId', sessionId);

        // Get the first triplet
        const tripletResponse = await fetch(`${API_URL}/assessment/next-triplet`, {
          headers: getAuthHeaders()
        });

        if (!tripletResponse.ok) {
          throw new Error('Failed to get triplet');
        }

        const tripletData = await tripletResponse.json();
        setSession(tripletData.session);
        setTriplet(tripletData.triplet);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    initializeAssessment();
  }, []);

  const handleSubmit = async () => {
    if (!mostLikely || !leastLikely) {
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const sessionId = localStorage.getItem('sessionId');
      
      const response = await fetch(`${API_URL}/assessment/submit-response`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          session_id: sessionId,
          triplet_id: triplet.id,
          most_likely_statement_id: mostLikely,
          least_likely_statement_id: leastLikely
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit response');
      }

      // Check if we should stop or get next triplet
      if (data.should_stop) {
        // Complete the assessment
        await completeAssessment(sessionId);
      } else {
        // Get next triplet
        await getNextTriplet();
      }
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  const getNextTriplet = async () => {
    try {
      const response = await fetch(`${API_URL}/assessment/next-triplet`, {
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get next triplet');
      }

      if (!data.triplet) {
        // No more triplets, complete the assessment
        const sessionId = localStorage.getItem('sessionId');
        await completeAssessment(sessionId);
        return;
      }

      setSession(data.session);
      setTriplet(data.triplet);
      setMostLikely(null);
      setLeastLikely(null);
      setSubmitting(false);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  const completeAssessment = async (sessionId) => {
    try {
      const response = await fetch(`${API_URL}/assessment/complete`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ session_id: sessionId })
      });

      if (!response.ok) {
        throw new Error('Failed to complete assessment');
      }

      // Navigate to processing page
      navigate('/processing');
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  const isValidSelection = mostLikely && leastLikely && mostLikely !== leastLikely;

  // Calculate progress percentage
  const progress = session ? Math.min((session.total_triplets_shown / 20) * 100, 100) : 0;

  if (loading) {
    return (
      <div className="test-container">
        <div className="loading-screen">
          <div className="loader"></div>
          <p>Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (error && !triplet) {
    return (
      <div className="test-container">
        <div className="error-message">{error}</div>
        <button className="btn-start" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  if (!triplet) {
    return (
      <div className="test-container">
        <p>No triplet available. Please try again.</p>
        <button className="btn-start" onClick={() => window.location.reload()}>
          Reload
        </button>
      </div>
    );
  }

  return (
    <div className="test-container">
      {error && <div className="error-message">{error}</div>}

      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="progress-text">
          Question {session?.total_triplets_shown || 1} in progress...
        </div>
      </div>

      <div className="triplet-question">
        <div className="triplet-header">
          <h2>Leadership Assessment</h2>
          <p className="triplet-instruction">
            Select one statement as <strong>Most Likely</strong> and one as <strong>Least Likely</strong>
          </p>
        </div>

        <table className="triplet-table-full">
          <thead>
            <tr>
              <th>Statement</th>
              <th>Most Likely</th>
              <th>Least Likely</th>
            </tr>
          </thead>
          <tbody>
            {triplet.statements.map((statement, index) => {
              const letter = String.fromCharCode(65 + index); // A, B, C
              return (
                <tr key={statement.id}>
                  <td>
                    <span className="statement-text">
                      <strong>{letter}.</strong> {statement.statement_text}
                    </span>
                  </td>
                  <td>
                    <div className="radio-group">
                      <label className="radio-label most-likely">
                        <input
                          type="radio"
                          name="most-likely"
                          checked={mostLikely === statement.id}
                          onChange={() => setMostLikely(statement.id)}
                        />
                        Select
                      </label>
                    </div>
                  </td>
                  <td>
                    <div className="radio-group">
                      <label className="radio-label least-likely">
                        <input
                          type="radio"
                          name="least-likely"
                          checked={leastLikely === statement.id}
                          onChange={() => setLeastLikely(statement.id)}
                        />
                        Select
                      </label>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {!isValidSelection && (mostLikely || leastLikely) && (
          <div className="validation-message">
            Please select two different statements - one for Most Likely and one for Least Likely.
          </div>
        )}

        <button
          className="btn-next"
          onClick={handleSubmit}
          disabled={!isValidSelection || submitting}
        >
          {submitting ? 'Submitting...' : 'Next'}
        </button>
      </div>
    </div>
  );
}

export default TakeTest;
