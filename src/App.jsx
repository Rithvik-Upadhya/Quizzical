import React, { useState } from 'react'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'
import Quiz from './components/Quiz'
import { decodeHTML } from './utils/decodeHTML'

export default function App() {

    const [quizes, setQuizes] = useState([])
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)

    async function newQuizes() {
        // enable loading screen
        setLoading(true)
        // get category code
        const category = document.getElementById("category").value 
        console.log(category)
        // async fetch quizes from API
        const response = await fetch(`https://opentdb.com/api.php?amount=5&category=${category}&difficulty=medium&type=multiple`)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // restructure the response
        const quizData = await data.results.map((quiz) => (
            {
                id: nanoid(),
                question: decodeHTML(quiz.question),
                choices: createChoices(quiz.incorrect_answers,quiz.correct_answer),
                selectedIsCorrect: false
            }
        ))
        // set submitted to false and quizes to restructured response
        setSubmitted(false)
        setQuizes(quizData)
        //disable loading screen
        setLoading(false)
    }

    function createChoices(choices,answer) {
        // insert correct answer randomly into array of decoys
        // and return an array of objects with decoded HTML strings
        const randomIndex = Math.floor(Math.random() * 4)
        choices.splice(randomIndex, 0, answer)
        const choiceObjects = choices.map((choice, index) => ({
            id: nanoid(),
            value: decodeHTML(choice),
            isSelected: false,
            isCorrect: randomIndex === index ? true : false
        }))
        return choiceObjects
    }

    function select(quizId, choiceId, isCorrect) {
        const updatedQuizes = quizes.map(quiz => {
            return quiz.id != quizId ?
            quiz : {
                ...quiz, 
                choices: updateChoice(quiz, choiceId), 
                selectedIsCorrect: isCorrect
            }
        })
        setQuizes(updatedQuizes)
    }

    function updateChoice(quiz, choiceId) {
        return quiz.choices.map(choice => {
            return choice.id != choiceId ?
            {...choice, isSelected: false} : {...choice, isSelected: !choice.isSelected}
        })
    }

    function checkAnswers() {
        let correctAnswers = 0;
        quizes.forEach(quiz => {
            quiz.selectedIsCorrect && correctAnswers++
        })
        return correctAnswers
    }

    function resetQuizes() {
        setQuizes([])
    }

    const quizEls = quizes.map((quiz) => {
        return (
            <Quiz
            key={quiz.id}
            id={quiz.id}
            question={quiz.question}
            choices={quiz.choices || []}
            answer={quiz.answer}
            select={select}
            submitted={submitted}
        />
        )
    })

    return (
        <main>
            <div id="quizzical" className={quizes.length > 0 ? "active" : ""}>
            {checkAnswers() === 5 && <Confetti recycle={false} />}
                <div className="container">
                    <img id="blob-1" src="/images/blob-1.png" alt="blob" />
                    <img id="blob-2" src="/images/blob-2.png" alt="blob" />
                    {loading ? <div id="loading">Loading...</div> : quizes.length > 0 ? 
                        <>
                        <div id="quizes">{quizEls}</div>
                        {!submitted && <button onClick={() => setSubmitted(true)}>Check Answers</button>}
                        {submitted && <div id="score"><span>You scored {checkAnswers()} / 5 correct answers</span><button onClick={resetQuizes}>Play Again</button></div>}
                        </>
                    : 
                        <> 
                        <h1>Quizzical</h1>
                        <p>Choose your topic!</p>
                        <select name="category" id="category">
                            <option value="9">General Knowledge</option>
                            <option value="11">Film</option>
                            <option value="18">Computers</option>
                            <option value="31">Anime & Manga</option>
                            <option value="23">History</option>
                            <option value="12">Music</option>
                            <option value="17">Science & Nature</option>
                        </select>
                        <button onClick={newQuizes}>Start Quiz</button>
                        </>
                    }
                </div>
            </div>
        </main>
    )
}