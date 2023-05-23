import Title from "./components/Title"
import { useState, useEffect } from "react"
import QuestionsBlock from "./components/QuestionsBlock"
import AnswerBlock from "./components/AnswerBlock"

const App = () => {

  const [quiz, setQuiz] = useState(null)
  const [chosenAnswerItems, setChosenItemAnswers] = useState([])
  const [unansweredQuestionIds, setUnansweredQuestionIds] = useState([null])
  const [showAnswer, setShowAnswer] = useState(false)

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8000/quiz')
      const json = await response.json()
      setQuiz(json)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const unansweredIds = quiz?.content?.map(({id}) => id)
    setUnansweredQuestionIds(unansweredIds)
  }, [quiz])

  useEffect(() => {
    if (unansweredQuestionIds) {
      if (unansweredQuestionIds.length <=0 && chosenAnswerItems.length >= 1) {
        // scroll to answer block
        setShowAnswer(true)
        const answerBlock = document.getElementById("answer-block")
        answerBlock?.scrollIntoView({ behavior: "smooth" })
      }
      // scroll to highest unansweredQuestionId
      const highestId = Math.min(...unansweredQuestionIds)
      const highestElement =  document.getElementById(highestId)
      highestElement?.scrollIntoView({ behavior: "smooth" })
    }
  }, [unansweredQuestionIds, chosenAnswerItems, showAnswer])
  
  return (
    <div className="app">
      <Title title={quiz?.title} subtitle={quiz?.subtitle} /> 
      {quiz?.content?.map(contentItem => (
        <QuestionsBlock
          key={contentItem.id} 
          quizItem={contentItem}
          setChosenAnswerItems={setChosenItemAnswers}
          chosenAnswerItems={chosenAnswerItems}
          setUnansweredQuestionIds={setUnansweredQuestionIds}
          unansweredQuestionIds={unansweredQuestionIds}
        />
      ))}
      {showAnswer && (
        <AnswerBlock 
          answerOptions={quiz?.answers}
          chosenAnswers={chosenAnswerItems}
        />
      )}
    </div>
  )
}

export default App