import React from 'react';
import { useNavigate } from 'react-router-dom';

function Instructions() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/assessment');
  };

  return (
    <div className="instructions-container">
      <div className="instructions-header">
        <h1>Leadership Assessment</h1>
        <p>A comprehensive psychometric evaluation for managers</p>
      </div>

      <div className="instructions-content">
        <h2>Purpose of This Assessment</h2>
        <p>
          This assessment is designed to evaluate your leadership competencies across multiple dimensions.
          It uses a scientifically validated approach to measure your strengths and areas for development
          in key leadership skills.
        </p>

        <h2>Forced-Choice Format</h2>
        <p>
          Unlike traditional questionnaires where you rate each statement independently, this assessment
          uses a <strong>forced-choice triplet format</strong>. For each question, you will see three
          statements and must choose:
        </p>
        <ul>
          <li><strong>1 Most Likely</strong> - The statement that best describes your typical behavior</li>
          <li><strong>1 Least Likely</strong> - The statement that least describes your typical behavior</li>
        </ul>

        <div className="format-example">
          <h3>Example:</h3>
          <table className="triplet-table">
            <thead>
              <tr>
                <th>Statement</th>
                <th>Most Likely</th>
                <th>Least Likely</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>A. I set clear goals for my team</td>
                <td>○</td>
                <td>○</td>
              </tr>
              <tr>
                <td>B. I prefer to work alone on complex tasks</td>
                <td>○</td>
                <td>○</td>
              </tr>
              <tr>
                <td>C. I encourage team members to share ideas</td>
                <td>○</td>
                <td>○</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>How to Answer</h2>
        <ul>
          <li>Read all three statements carefully</li>
          <li>Select the one that is <strong>most</strong> like you</li>
          <li>Select the one that is <strong>least</strong> like you</li>
          <li>You cannot select the same statement for both</li>
          <li>Answer as honestly as possible - there are no right or wrong answers</li>
          <li>Trust your first instinct - don't overthink your responses</li>
        </ul>

        <h2>Adaptive Assessment</h2>
        <p>
          This assessment uses adaptive logic to personalize your experience. Based on your responses,
          the system will select the most relevant questions to measure your leadership competencies
          efficiently. This means:
        </p>
        <ul>
          <li>You'll answer between 15-30 triplet questions</li>
          <li>The system adapts to focus on areas where more measurement is needed</li>
          <li>You'll only see each question once</li>
        </ul>

        <div className="confidentiality-note">
          <strong>Confidentiality:</strong> Your responses are completely confidential and will only be
          used for your personal development. No individual responses will be shared with anyone.
        </div>

        <button className="btn-start" onClick={handleStart}>
          Start Assessment
        </button>
      </div>
    </div>
  );
}

export default Instructions;
