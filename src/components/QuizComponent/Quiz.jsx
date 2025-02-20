import { useCallback, useEffect, useState } from "react"
import { data } from "../../utils/quizdata.js"
import toast, { Toaster } from 'react-hot-toast'
import { openDatabase, saveResult, getResults } from "../../utils/helperfn.js"
import "./Quiz.css"

const Quiz = () => {
    const [index, setIndex] = useState(0)
    const [question, setQuestion] = useState(data[index])
    const [lock, setLock] = useState(false)
    const [score, setScore] = useState(0)
    const [showScore, setShowScore] = useState(false)
    const [timeLeft, setTimeLeft] = useState(30)
    const [savedResults, setSavedResults] = useState([])
    const [userAnswer, setUserAnswer] = useState('')

    const resetOptions = () => {
        const options = document.querySelectorAll(".list li, .input-container input")
        options.forEach(option => {
            option.classList.remove("correct", "wrong")
        })
    }

    const resetQuiz = () => {
        setIndex(0)
        setQuestion(data[0])
        setLock(false)
        setShowScore(false)
        setScore(0)
        setTimeLeft(30)
        setSavedResults([])
        setUserAnswer('')
    }

    const checkAns = (e, ans) => {
        if (lock === false) {
            if (question.answerType === "multipleChoice") {
                if (ans === question.ans) {
                    e.target.classList.add("correct")
                    toast.success("Correct Answer!")
                    setLock(true)
                    setScore(score + 1)
                } else {
                    e.target.classList.add("wrong")
                    toast.error("Wrong Answer!")
                    setLock(true)
                }
            } else if (question.answerType === "input") {
                const inputElement = e.target.previousSibling; // The input field
                if (userAnswer.trim() === question.ans) {
                    inputElement.classList.add("correct")
                    toast.success("Correct Answer!")
                    setLock(true)
                    setScore(score + 1)
                } else {
                    inputElement.classList.add("wrong")
                    toast.error("Wrong Answer!")
                    setLock(true)
                }
            }
        } else {
            toast.error("You can only select one answer!")
        }
    }

    const next = useCallback(() => {
        resetOptions()
        if (index + 1 === data.length) {
            setShowScore(true)
        } else {
            setIndex(index + 1)
            setQuestion(data[index + 1])
        }
        setLock(false)
        setTimeLeft(30)
        setUserAnswer('')
    }, [index])

    const endQuiz = async () => {
        const db = await openDatabase()
        const result = {
            score: score,
            totalQuestions: data.length,
            date: new Date().toISOString()
        };

        try {
            await saveResult(db, result)
            toast.success("Your result has been saved!")
            fetchSavedResults()
        } catch (error) {
            toast.error("Error saving result: " + error)
        }
    };

    const fetchSavedResults = async () => {
        const db = await openDatabase()
        try {
            const results = await getResults(db)
            setSavedResults(results)
        } catch (error) {
            toast.error("Error retrieving saved results: " + error)
        }
    };

    useEffect(() => {
        if (timeLeft === 0) {
            next()
        } else {
            const timer = setInterval(() => {
                setTimeLeft(prevTime => prevTime - 1)
            }, 1000)
            return () => clearInterval(timer)
        }
    }, [timeLeft, next])

    return (
        <div className="quiz-container">
            <h1>Quiz Application</h1>
            <hr />
            {
                showScore ?
                    <>
                        <h2 style={{ textAlign: "center" }}>Scoreboard: </h2>
                        <h3 style={{ textAlign: "center" }}>Final Score: {score} out of {data.length}</h3>
                        <button className="qbtn" onClick={resetQuiz} style={{ margin: "auto" }}>Try again?</button>
                        <button className="qbtn" onClick={endQuiz} style={{ margin: "auto" }}>Save Result</button>
                    </> :
                    <>
                        <h3>{index + 1}. {question.question}</h3>
                        <ul className="list">
                            {question.answerType === "multipleChoice" ? (
                                <>
                                    <li onClick={(e) => checkAns(e, question.option1)}>{question.option1}</li>
                                    <li onClick={(e) => checkAns(e, question.option2)}>{question.option2}</li>
                                    <li onClick={(e) => checkAns(e, question.option3)}>{question.option3}</li>
                                    <li onClick={(e) => checkAns(e, question.option4)}>{question.option4}</li>
                                </>
                            ) : (
                                <div className="input-container">
                                    <input
                                        type="text"
                                        value={userAnswer}
                                        onChange={(e) => setUserAnswer(e.target.value)}
                                        placeholder="Your answer"
                                    />
                                    <button className="qbtn submit-btn" onClick={(e) => checkAns(e, userAnswer)}>
                                        Submit
                                    </button>
                                </div>
                            )}
                        </ul>
                        <div className="btncontainer">
                            <button className="qbtn" onClick={next}>Next question</button>
                        </div>
                        <div className="index">{index + 1} of {data.length} questions</div>
                        <div className="timer">Time Left: {timeLeft}s</div>
                    </>
            }

            {savedResults.length > 0 && (
                <div className="saved-results" style={{ marginTop: "20px" }}>
                    <h3>Saved Results:</h3>
                    <ul>
                        {savedResults.map((result, index) => (
                            <li key={index} style={{ marginBottom: "10px" }}>
                                <p>Score: {result.score} / {result.totalQuestions}</p>
                                <p>Date: {new Date(result.date).toLocaleString()}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <Toaster position="bottom-center" reverseOrder={false} />
        </div>
    )
}

export default Quiz