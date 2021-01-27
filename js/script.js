// BlackJack game
let blackjackGame = {
  'you': {'scoreSpan': '#your-blackjack-result',  'div': '#your-box', 'score': 0 },
  'dealer': {'scoreSpan': '#dealer-blackjack-result',  'div': '#dealer-box', 'score': 0 },
  'cards': ['2','3','4','5','6','7','8','9','10','K','J','Q','A'],
  'cardsMap': {'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'K':10,'J':10,'Q':10,'A':[1,11]},
  'wins':0,
  'losses':0,
  'draws':0,
  'isSystem':false,
  'turnOver':false,

};

const YOU = blackjackGame['you']
const DEALER = blackjackGame['dealer']

const hitsound = new Audio("sound/sounds/swish.m4a");
const winsound = new Audio("sound/sounds/cash.mp3");
const lossound = new Audio("sound/sounds/aww.mp3");

document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackHit);
document.querySelector('#blackjack-system-button').addEventListener('click', systemLogic);
document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackDeal);

function blackjackHit(){
  if(blackjackGame['isSystem'] === false) {
  let card = random();
  showCard(card,YOU);
  updateScore(card, YOU);
  showSCore(YOU);
  
  }
}
function random(){
  let randomIndex = Math.floor(Math.random() * 13);
  return blackjackGame['cards'][randomIndex];
}

function showCard(card, activePlayer){
  //console.log(card);
  if(activePlayer['score'] <=21) {
  let cardImage = document.createElement('img');
  cardImage.src = 'images/'+ card +'.png';
  document.querySelector(activePlayer['div']).appendChild(cardImage);
  hitsound.play();
  }
}
function blackjackDeal() {
  //showResult(computeWinner());
  if (blackjackGame['turnOver'] === true) {
    blackjackGame['isSystem'] = false;
    let yourImages = document.querySelector('#your-box').querySelectorAll('img');
    let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
    
    for (i=0;i< yourImages.length; i++) {
      yourImages[i].remove();
    }
    for (i=0;i< dealerImages.length; i++) {
      dealerImages[i].remove();
    }
    YOU['score'] = 0;
    DEALER['score'] = 0;

    document.querySelector('#your-blackjack-result').textContent = 0;
    document.querySelector('#dealer-blackjack-result').textContent = 0;

    document.querySelector('#your-blackjack-result').style.color = '#ffffff';
    document.querySelector('#dealer-blackjack-result').style.color = '#ffffff';

    document.querySelector('#blackjack-result').textContent = "Let's Play";
    document.querySelector('#blackjack-result').style.color = "black";

    blackjackGame['turnOver'] = false;
  }
}
function updateScore(card, activePlayer){
  // if adding 11 keeps me below 21 add 11 otherwise,add 1
  if(card === 'A'){
    if(activePlayer['score'] + blackjackGame['cardsMap'][card][1] <=21){
      activePlayer['score'] += blackjackGame['cardsMap'][card][1];
    }else {
      activePlayer['score'] +=blackjackGame['cardsMap'][card][0];
    }
  }else{
    activePlayer['score'] += blackjackGame['cardsMap'][card];
  }
}

function showSCore(activePlayer){
  if(activePlayer['score'] > 21){
    document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!';
    document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    
  }else {
  document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve,ms));
}

async function systemLogic() {
  blackjackGame['isSystem'] = true;

  while(DEALER['score'] <16 && blackjackGame ['isSystem'] === true) {
    let card = random();
    showCard(card, DEALER);
    updateScore(card,DEALER);
    showSCore(DEALER);
    await sleep(1000);
  }
  
    blackjackGame['turnOver'] =true;
    let winner = computeWinner();
    showResult(winner);

  
}
//compute winner and return who just won
//update the wins, draws and losses
function computeWinner() {
  let winner;
  if(YOU['score'] <=21){
    //condition higher score then deraler or when dealer busts but yor are 
    if(YOU['score'] > DEALER['score'] || (DEALER['score'] > 21)){

      blackjackGame['wins']++;
      console.log('You won!');

    winner = YOU;

  }else if (YOU['score'] < DEALER['score']){

    blackjackGame['losses']++;
    console.log('You lost!');

    winner = DEALER;

  }else if(YOU['score'] === DEALER['score']){

    blackjackGame['draws']++;
    console.log('You drew!');

  }
    //condition when user bust but dealer cant
  }else if(YOU['score'] >21 && DEALER['score'] <= 21){

    blackjackGame['losses']++;
    console.log('You lost!');

    winner = DEALER;
    //condition when both busts
  }else if (YOU['score'] > 21 && DEALER['score'] >21){

    blackjackGame['draws']++;
    console.log('You drew!');
  }

  console.log(blackjackGame);
  return winner;
}


function showResult(winner){
  let msg,msgColor;
if(blackjackGame['turnOver'] === true){

  if(winner === YOU){
    document.querySelector('#wins').textContent=blackjackGame['wins'];
    msg = 'You Won!';
    msgColor = 'green';
    winsound.play();

  }else if(winner === DEALER){
    document.querySelector('#losses').textContent=blackjackGame['losses'];
    msg = 'You Lost!';
    msgColor = 'red';
    lossound.play();

  }else{
    document.querySelector('#draws').textContent=blackjackGame['draws'];
    msg = 'You drew!';
    msgColor = 'black';
  }
  document.querySelector('#blackjack-result').textContent = msg;
  document.querySelector('#blackjack-result').style.color = msgColor;
  }
}
