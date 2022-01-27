/* function createCells() {
  for (let i = 1; i <= 200; i++) {
    const DIV = document.createElement("div");
    DIV.id = i;
    document.body.appendChild(div);
    console.log(i);
  }
} */

const WIDTH = 10; //The current quantity of cells in a row of the grid
const GRID = document.querySelector(".grid"); 
const SQUARES = Array.from(document.querySelectorAll(".grid div")); //We pick all the divs inside the grid and make an array of divs
const SCORE = document.getElementById("#score");
const START_BTN = document.getElementById("#start-button");

console.log(SQUARES);

//Tetris pieces. Each field of an array is a different position of a piece. It's based on: 
/* [0,0]  [0,1]  [0,2]
   [1,0]  [1,1]  [1,2]
   [2,0]  [2,1]  [2,2]  
   [3,0]  [3,1]  [3,2]  */

const PIECE_L = [
  [1, WIDTH+1, WIDTH*2+1, 2],
  [WIDTH, WIDTH+1, WIDTH+2, WIDTH*2+2],
  [1, WIDTH+1, WIDTH*2+1, WIDTH*2],
  [WIDTH, WIDTH*2, WIDTH*2+1, WIDTH*2+2]
]

const PIECE_Z = [
  [WIDTH*2, WIDTH*2+1, WIDTH+1, WIDTH+2],
  [0, WIDTH, WIDTH+1, WIDTH*2+1],
  [WIDTH*2, WIDTH*2+1, WIDTH+1, WIDTH+2],
  [0, WIDTH, WIDTH+1, WIDTH*2+1]
]

const PIECE_T = [
  [WIDTH, 1, WIDTH+1, WIDTH+2],
  [1, WIDTH+1, WIDTH+2, WIDTH*2+1],
  [WIDTH, WIDTH*2+1, WIDTH+1, WIDTH+2],
  [WIDTH, 1, WIDTH+1, WIDTH*2+1]
]

const PIECE_O = [
  [0, 1, WIDTH, WIDTH+1],
  [0, 1, WIDTH, WIDTH+1],
  [0, 1, WIDTH, WIDTH+1],
  [0, 1, WIDTH, WIDTH+1]
]

const PIECE_I = [
  [1, WIDTH+1, WIDTH*2+1, WIDTH*3+1],
  [WIDTH, WIDTH+1, WIDTH+2, WIDTH+3],
  [1, WIDTH+1, WIDTH*2+1, WIDTH*3+1],
  [WIDTH, WIDTH+1, WIDTH+2, WIDTH+3]
]

//Painting the pieces
const PIECES = [PIECE_L, PIECE_Z, PIECE_T, PIECE_O, PIECE_I];
let currentPosition = 3; //Start position at X axis in the grid
let randomPiece = Math.floor(Math.random() * PIECES.length); //Randomly select a piece
let pieceRotation = 0; //The pieces will always start with their first rotation
let currentPiece = PIECES[randomPiece][pieceRotation]; //The piece shown in the grid

function drawPiece(){
  currentPiece.forEach(item => { //Each div from SQUARES array is painted, according to the selected piece
    SQUARES[currentPosition + item].classList.add('piece'); //The class 'piece' is added to each div to gain color
  })
}

//Unpainting the pieces
function undrawPiece(){
  currentPiece.forEach(item => {
    SQUARES[currentPosition + item].classList.remove('piece'); //The class 'piece' is removed from each div
  })
}

//Freezing the pieces at the end of the grid
function freeze(){
  if(currentPiece.some(item => SQUARES[currentPosition + item + WIDTH].classList.contains('taken'))){ //Evaluate if the piece has reached the end of the grid
    currentPiece.forEach(item => SQUARES[currentPosition + item].classList.add('taken'));
    console.log(randomPiece)

    //Initialize a new piece in the grid
    pieceRotation = 0;
    randomPiece = Math.floor(Math.random() * PIECES.length);
    currentPiece = PIECES[randomPiece][pieceRotation];
    currentPosition = 3;
    drawPiece();
  }
}

//Manging the moves -------> REVISAR
function movesControl(e){
  if(e.keyCode === 37) {moveLeft();}
  if(e.keyCode === 39) {moveRight();}
  if(e.keyCode === 32) {rotate();}
}

document.addEventListener('keyup', movesControl);

//Moving the pieces
let timerId = setInterval(moveDown, 500); //Every 1 second, the piece will go down

function moveDown(){
  undrawPiece();
  currentPosition += WIDTH;
  drawPiece();
  freeze();
}
//REVISAR AMBAS FUNCIONES
function moveLeft(){
  undrawPiece();
  const LEFT_LIMIT = currentPiece.some(item => (currentPosition + item) % WIDTH === 0); //Determine the left limit of the grid by dividing the current array position and analizing the reminder
  if(!LEFT_LIMIT) {currentPosition -= 1;} //If the piece is not already in the left limit, it can moves to the left
  if(currentPiece.some(item => SQUARES[currentPosition + item].classList.contains('taken'))) {currentPosition -= 1;} //If the piece is on the left limit, it goes back to the right
  drawPiece();
}

function moveRight(){
  undrawPiece();
  const RIGHT_LIMIT = currentPiece.some(item => (currentPosition + item) % WIDTH === WIDTH - 1); //Determine the right limit of the grid by dividing the current array position and analizing the reminder
  if(!RIGHT_LIMIT) {currentPosition += 1;} //If the piece is not already in the right limit, it can moves to the right
  if(currentPiece.some(item => SQUARES[currentPosition + item].classList.contains('taken'))) {currentPosition -= 1;} //If the piece is on the left limit, it goes back to the right
  drawPiece();
}

function rotate(){
  undrawPiece();
  pieceRotation++;
  if(pieceRotation === currentPiece.length){pieceRotation = 0;} //If the rotation is the last one of the piece (position 4), then it goes back to position 0.
  currentPiece = PIECES[randomPiece][pieceRotation];
  drawPiece();
}