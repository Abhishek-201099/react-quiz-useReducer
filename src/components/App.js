import { useEffect,useReducer } from 'react';
import Header from './Header';
import Main from './Main';
import Loader from './Loader';
import Error from './Error';
import StartScreen from './StartScreen';
import Question from './Question';
import NextButton from './NextButton';
import Progress from './Progress';
import FinishScreen from './FinishScreen';
import Footer from './Footer';
import Timer from './Timer';

const SECS_PER_QUESTIONS=30;

const initialState={
  questions:[],
  // 'loading','error','ready','active','finished'
  status:'loading',
  index:0,
  answer:null,
  points:0,
  highScore:0,
  secondsRemaining:null,
};

function reducer(state,action){

  switch(action.type){
    case 'dataReceived': return {...state ,questions:action.payload, status:'ready'};
    case 'dataFailed'  : return {...state, status:'error'};
    case 'start'       : return {...state, status:'active',secondsRemaining:state.questions.length * SECS_PER_QUESTIONS};
    case 'newAnswer'   : return {...state, answer:action.payload, points: (action.payload === state.questions[state.index].correctOption) ? (state.points + state.questions[state.index].points): state.points};
    case 'nextQuestion': return {...state, index:state.index+1, answer:null};
    case 'finish'      : return {...state, status:'finish', highScore: state.points > state.highScore ? state.points : state.highScore};
    case 'restart'     : return {...initialState, questions:state.questions, status:'ready', highScore:state.highScore};
    case 'startTimer'  : return {...state,secondsRemaining:state.secondsRemaining-1,status:state.secondsRemaining===0 ? 'finish' : state.status};
    default            : throw new Error('Unknown action type');
  };

};

export default function App(){
  const [{questions,status,index,answer,points,highScore,secondsRemaining},dispatch]=useReducer(reducer,initialState);

  const maxPoints=questions.reduce((acc,question)=>acc+question.points,0);

  useEffect(function(){
    async function fetchQuestions(){
      try{
        const response=await fetch(`http://localhost:5000/questions`);
        const data=await response.json();
        dispatch({type:'dataReceived',payload:data});
      }catch(err){
        dispatch({type:'dataFailed'});
      }
    }
    fetchQuestions();
  },[])

  return (
    <div className='app'>
      <Header/>
      <Main>
        {status==='loading'&&<Loader/>}
        {status==='error'&&<Error/>}
        {status==='ready'&&<StartScreen numQuestions={questions.length} dispatch={dispatch}/>}
        {status==='active'&&
        <>
          <Progress numQuestions={questions.length} index={index} points={points} maxPoints={maxPoints} answer={answer}/>
          <Question question={questions[index]} dispatch={dispatch} answer={answer}/>
          <Footer>
            <Timer secondsRemaining={secondsRemaining} dispatch={dispatch}/>
            <NextButton dispatch={dispatch} answer={answer} index={index} numQuestions={questions.length}/>
          </Footer>
        </>}
        {status==='finish'&&<FinishScreen points={points} maxPoints={maxPoints} highScore={highScore} dispatch={dispatch}/>}
      </Main>
    </div>
  );
};