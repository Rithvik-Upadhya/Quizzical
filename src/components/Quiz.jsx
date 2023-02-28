import React from 'react'

export default function Quiz(props) {
    
    const choiceEls = props.choices.map((choice) => {
        function setClasses(choice) {
            let classArray = ["choice"]
            props.submitted === false && choice.isSelected && classArray.push("selected")
            choice.isCorrect && props.submitted && classArray.push("correct")
            choice.isSelected && choice.isCorrect === false && props.submitted && classArray.push("wrong")
            const classes = classArray.join(" ")
            return classes
        }
        return (
            <label key={choice.id} className={setClasses(choice)}>
                <input type="radio" name={props.id} value={choice.id} checked={choice.isSelected} onChange={() => props.submitted === false && props.select(props.id,choice.id,choice.isCorrect)} />
                {choice.value}
            </label>
        )
    }) 
    return (
        <div className="quiz">
            <div className="question">{props.question}</div>
            <div className="choices">{choiceEls}</div>
        </div>
    )
}