export default function FinishScreen({points,maxPoints,highScore,dispatch}){

  const percentageScore=Math.ceil((points/maxPoints)*100);
  let emoji= percentageScore === 100 ?
             '🥇' :
             (percentageScore < 100 && percentageScore >=80) ?
             '🎉' :
             (percentageScore < 80 && percentageScore >=50) ?
             '🙂' :
             (percentageScore < 50 && percentageScore >0) ?
             '😒' :
             (percentageScore === 0) ?
             '🤦‍♂️' : '';
  
  return(
    <>
      <p className="result">
        <span>{emoji}</span>
        You scored <strong>{points}</strong> out of {maxPoints} ({percentageScore}%).
      </p>
      <p className="highscore">(Highscore : {highScore} points)</p>
      <button className="btn btn-ui" onClick={()=>dispatch({type:'restart'})}>Restart Quiz</button>
    </>
  );
}