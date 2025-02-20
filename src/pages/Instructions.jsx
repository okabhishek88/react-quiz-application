// import React from 'react';
import { Link } from 'react-router-dom'
import './Instructions.css'

const Instructions = () => {
    return (
        <div className="instructions-container">
            <h1 className="instructions-title">Quiz Instructions</h1>
            <div className="instructions-content">
                <ol>
                    <li>For multiple-choice questions, select the one best answer (A, B, C, or D).</li>
                    <li>For integer-type questions, write your numerical answer clearly.</li>
                    <li>No calculators unless specified.</li>
                    <li>You have 30 minutes to complete this quiz.</li>
                </ol>
            </div>
            <div className="instructions-btn-container">
                <Link to="/quiz"><button className="start-quiz-btn">Start Quiz</button>
                </Link>
            </div>
            <div>
                <p style={{ textAlign: "center" }}>Made with &#10084; by Abhishek Chauhan</p>
            </div>
        </div>
    )
}

export default Instructions
