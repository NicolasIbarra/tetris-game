//MINI GRID
const MINI_WIDTH = 5;
const MINI_DISPLAY = document.querySelectorAll('.mini-grid div');
const DISPLAY_INDEX = 1;

const MINI_PIECES = [
  [1, MINI_WIDTH+1, MINI_WIDTH*2+1, 2],
  [MINI_WIDTH*2, MINI_WIDTH*2+1, MINI_WIDTH+1, MINI_WIDTH+2],
  [MINI_WIDTH, 1, MINI_WIDTH+1, MINI_WIDTH+2],
  [0, 1, MINI_WIDTH, MINI_WIDTH+1],
  [1, MINI_WIDTH+1, MINI_WIDTH*2+1, MINI_WIDTH*3+1]
]

//GRID
const WIDTH = 10; //The current quantity of cells in a row of the grid.
const COLORS = ['purple', 'red', 'orange', 'lightblue', 'green'];
const GRID = document.querySelector(".grid"); 
const SCORE_DISPLAY = document.getElementById("score");
const BTN_START = document.getElementById("start-button");

//Tetris pieces -> Each field of the pieces arrays is a different position of the piece. It's based on: 

/*
[0,0]  [0,1]  [0,2]
[1,0]  [1,1]  [1,2]
[2,0]  [2,1]  [2,2]  
[3,0]  [3,1]  [3,2]
*/

const PIECE_L = [
  [1, WIDTH+1, WIDTH*2+1, 2],
  [WIDTH, WIDTH+1, WIDTH+2, WIDTH*2+2],
  [1, WIDTH+1, WIDTH*2+1, WIDTH*2],
  [WIDTH, WIDTH*2, WIDTH*2+1, WIDTH*2+2]
]

const PIECE_Z = [
  [WIDTH, WIDTH+1, 1, 2],
  [0, WIDTH, WIDTH+1, WIDTH*2+1],
  [WIDTH, WIDTH+1, 1, 2],
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

const PIECES = [PIECE_L, PIECE_Z, PIECE_T, PIECE_O, PIECE_I]; //Array of pieces.

let pieceRotation = 0; //The pieces will always start with their first rotation.
let currentPosition = 3; //Current position cell of the pieces in the grid. It starts in cell 3.
let randomPiece = Math.floor(Math.random() * PIECES.length); //Randomly select a piece.
let currentPiece = PIECES[randomPiece][pieceRotation]; //The current piece shown in the grid.
let nextRandomPiece = Math.floor(Math.random() * PIECES.length);; //Next tetrominoe showed in the mini grid.
let timerId;
let score = 0;
let squares = Array.from(document.querySelectorAll(".grid div")); //We pick all the divs inside the grid and make an array of divs.
console.log(squares);

document.addEventListener('keyup', movementControl);
BTN_START.addEventListener('click', start);

//PAINTING THE PIECES
function drawPiece(){
  currentPiece.forEach(item => { //Each div that makes up a piece is painted, according to the selected piece.
    squares[currentPosition + item].style.backgroundColor = COLORS[randomPiece]; //Each div gains color.
  })
}

//UNPAINTING THE PIECES
function undrawPiece(){
  currentPiece.forEach(item => {
    squares[currentPosition + item].style.backgroundColor = ''; //The color is removed from each div.
  })
}

//PREPARING THE NEXT TETROMINOE
function prepareNextTetrominoe(){
  pieceRotation = 0;
  currentPosition = 3;
  randomPiece = nextRandomPiece;
  currentPiece = PIECES[randomPiece][pieceRotation];
  nextRandomPiece = Math.floor(Math.random() * PIECES.length);
}

//FREEZING A PIECE WHEN IT REACHES THE BOTTOM OF THE GRID OR TOUCHES ANOTHER PIECE
function freezeCurrentTetrominoe(){
  if(currentPiece.some(item => squares[currentPosition + item + WIDTH].classList.contains('taken'))){ //Evaluate if the piece has reached the end of the grid.
    currentPiece.forEach(item => squares[currentPosition + item].classList.add('taken')); //The piece stops moving.
    prepareNextTetrominoe();
    addScore(); //This function must be called in here. Otherwise, before the complete rows are cut, the next piece appears in the grid and its dragged down. 
    drawPiece();
    showNextTetrominoe();
  }
}

//MANAGING THE MOVEMENTS
function movementControl(e) {
  switch (e.keyCode){
    case 32: rotate(); break;
    case 37: moveLeft(); break;
    case 39: moveRight(); break;
    case 40: moveDown(); break;
  }
}

//MANAGING THE START/PAUSE FUNCTIONALITY
function start(){ 
  if(timerId){
    clearInterval(timerId);
    timerId = null;
  } else {
    drawPiece();
    timerId = setInterval(moveDown, 500); //Every 0.5 second, the piece will go down
  }
}

//MANAGING THE DIFFERENT FUNCTIONALITIES
function moveDown(){
  showNextTetrominoe();
  undrawPiece();
  currentPosition += WIDTH;
  drawPiece();
  freezeCurrentTetrominoe();
  gameOver();
}

//MOVING TETROMINOE TO THE LEFT
function moveLeft(){
  undrawPiece();
  const LEFT_LIMIT = currentPiece.some(item => (currentPosition + item) % WIDTH === 0); //Determine the left limit of the grid by dividing the current array position and analizing the reminder
  if(!LEFT_LIMIT) {currentPosition -= 1;} //If the piece is not already in the left limit, it can moves to the left
  if(currentPiece.some(item => squares[currentPosition + item].classList.contains('taken'))) {currentPosition += 1} //If the piece is on the left limit, it goes back to the right
  drawPiece();
}

//MOVING TETROMINOE TO THE RIGHT
function moveRight(){
  undrawPiece();
  const RIGHT_LIMIT = currentPiece.some(item => (currentPosition + item) % WIDTH === WIDTH - 1); //Determine the right limit of the grid by dividing the current array position and analizing the reminder
  if(!RIGHT_LIMIT) {currentPosition += 1;} //If the piece is not already in the right limit, it can moves to the right
  if(currentPiece.some(item => squares[currentPosition + item].classList.contains('taken'))) {currentPosition -= 1;} //If the piece is on the left limit, it goes back to the right
  drawPiece();
}

//MANAGING THE DIFFERENT ROTATIONS OF A PIECE
function rotate(){
  undrawPiece();
  pieceRotation++;
  if(pieceRotation === currentPiece.length){ //If the rotation is the last one of the piece (position 4), then it goes back to position 0.
    pieceRotation = 0; 
  } 
  currentPiece = PIECES[randomPiece][pieceRotation];
  drawPiece();
}

//REMOVE THE COLOR OF THE PREVIOUS TETROMINOE
function removePreviousTetrominoe(){
  MINI_DISPLAY.forEach(item => {
    item.style.backgroundColor = '';
  })
}

//DISPLAY THE SHAPE OF THE NEXT TETROMINOE
function showNextTetrominoe(){
  removePreviousTetrominoe();
  MINI_PIECES[nextRandomPiece].forEach(item => {
    MINI_DISPLAY[DISPLAY_INDEX + item].style.backgroundColor = COLORS[nextRandomPiece];
  })
}

//ADDING DELETED ROW
function addRow(index){
  const REMOVED_SQUARES = squares.splice(index, WIDTH);
  squares = REMOVED_SQUARES.concat(squares);
  squares.forEach(cell => GRID.appendChild(cell));
}

//REMOVING ROW FUNCTIONALITY
function removeRow(row, index){
  row.forEach(index => {
    squares[index].classList.remove('taken');
    squares[index].style.backgroundColor = '';
  })
  addRow(index);
}

//ADDING SCORE FUNCTIONALITY
function addScore(){
  for(let i=0; i<199; i+=WIDTH){
    const ROW = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]; //Creating an array with the length of WIDTH for analizing a single row. Its necessary to add the constants in each cell so the array will represent the rows of the grid.
    
    if(ROW.every( i => squares[i].classList.contains('taken'))){ //We ask if the row has all its cells with the classList 'taken'. 
      score += 10;
      SCORE_DISPLAY.innerHTML = score;
      removeRow(ROW, i);   
    }
  }
}

//GAME OVER FUNCTIONALITY
function gameOver(){
  if (currentPiece.some(item => squares[item + currentPosition].classList.contains('taken'))){ //If the tetrominoe has riched the top of the grid then the interval is cleared and stops the pieces movement.
    SCORE_DISPLAY.innerHTML = "YOU LOST!" + " Your final score is " + score;
    clearInterval(timerId);
    document.removeEventListener('keyup', movementControl);
  }
}

/* 

CONSIDERACIONES
* Agregar botón de reseteo.

*/