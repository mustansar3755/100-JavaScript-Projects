function diceRoll() {
  const dice1=Math.floor(Math.random()*6)+1;
  const dice2=Math.floor(Math.random()*6)+1;

  document.getElementById('dice1').src=`image/dice${dice1}.png`
  document.getElementById('dice2').src=`image/dice${dice2}.png`

  let resultText="";

  if(dice1>dice2){
    resultText="🚩 Player 1 Wins!"
  }else if(dice2>dice1){
    resultText="🚩 Player 2 Wins!"
  }else{
    resultText="It's a Draw Match"
  }

  document.getElementById('result').innerText=resultText;
}