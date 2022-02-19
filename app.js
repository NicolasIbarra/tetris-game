/* function createCells() {
  for (let i = 1; i <= 200; i++) {
    const DIV = document.createElement("div");
    DIV.id = i;
    document.body.appendChild(div);
    console.log(i);
  }
} */

let timerId;
let score = 0;
let squares = Array.from(document.querySelectorAll(".grid div")); //We pick all the divs inside the grid and make an array of divs.
let currentPosition = 3; //Current position cell of the pieces in the grid. It starts in cell 3.
let pieceRotation = 0; //The pieces will always start with their first rotation.

const WIDTH = 10; //The current quantity of cells in a row of the grid.
const GRID = document.querySelector(".grid"); 
const SCORE_DISPLAY = document.getElementById("score");
const COLORS = ['purple', 'red', 'orange', 'lightblue', 'green'];
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

const PIECES = [PIECE_L, PIECE_Z, PIECE_T, PIECE_O, PIECE_I]; //Array of pieces.

let randomPiece = Math.floor(Math.random() * PIECES.length); //Randomly select a piece.
let currentPiece = PIECES[randomPiece][pieceRotation]; //The current piece shown in the grid.
let nextRandomPiece = randomPiece; //This variable is used for generating the next tetrominoe in the grid.

document.addEventListener('keyup', movesControl);
BTN_START.addEventListener('click', manageMovement);

//PAINTING THE PIECES
function drawPiece(){
  currentPiece.forEach(item => { //Each div that makes up a piece is painted, according to the selected piece.
    squares[currentPosition + item].classList.add('piece'); //The class 'piece' is added to each div to gain color.
    squares[currentPosition + item].style.backgroundColor = COLORS[randomPiece];
  })
}

//UNPAINTING THE PIECES
function undrawPiece(){
  currentPiece.forEach(item => {
    squares[currentPosition + item].classList.remove('piece'); //The class 'piece' is removed from each div.
    squares[currentPosition + item].style.backgroundColor = '';
  })
}

//FREEZING A PIECE WHEN IT REACHES THE BOTTOM OF THE GRID OR TOUCHES ANOTHER PIECE.
function freeze(){
  if(currentPiece.some(item => squares[currentPosition + item + WIDTH].classList.contains('taken'))){ //Evaluate if the piece has reached the end of the grid.
    currentPiece.forEach(item => squares[currentPosition + item].classList.add('taken')); //The piece stops moving.

    //Initialize a new piece in the grid
    pieceRotation = 0;
    randomPiece = nextRandomPiece;
    nextRandomPiece = Math.floor(Math.random() * PIECES.length);
    currentPiece = PIECES[randomPiece][pieceRotation];
    currentPosition = 3;
    addScore(); //This function must be called in here. Otherwise, before the complete rows are cut, the next piece appears in the grid and its dragged down. 
    drawPiece();
    displayPiece();
  }
}

//MANAGING THE MOVEMENTS -------> REVISAR
function movesControl(e){
  if(e.keyCode === 37) {moveLeft();}
  if(e.keyCode === 39) {moveRight();}
  if(e.keyCode === 32) {rotate();}
  if(e.keyCode === 40) {moveDown();}
}

//MANAGING THE TIME/PAUSE FUNCTIONALITY
function manageMovement(){ 
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
  displayPiece();
  undrawPiece();
  currentPosition += WIDTH;
  drawPiece();
  freeze();
  gameOver();
}

//REVISAR AMBAS FUNCIONES
function moveLeft(){
  undrawPiece();
  const LEFT_LIMIT = currentPiece.some(item => (currentPosition + item) % WIDTH === 0); //Determine the left limit of the grid by dividing the current array position and analizing the reminder
  if(!LEFT_LIMIT) {currentPosition -= 1;} //If the piece is not already in the left limit, it can moves to the left
  if(currentPiece.some(item => squares[currentPosition + item].classList.contains('taken'))) {currentPosition -= 1;} //If the piece is on the left limit, it goes back to the right
  drawPiece();
}

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

//DISPLAY THE SHAPE OF THE NEXT TETROMINOE
function displayPiece(){
  MINI_DISPLAY.forEach(item => {
    item.classList.remove('piece'); //Remove any trace of the previous tetrominoe
    item.style.backgroundColor = ''; //Remove the color
  })

  MINI_PIECES[nextRandomPiece].forEach(item => {
    MINI_DISPLAY[DISPLAY_INDEX + item].classList.add('piece');
    MINI_DISPLAY[DISPLAY_INDEX + item].style.backgroundColor = COLORS[nextRandomPiece];
  })
}

//SCORE FUNCTIONALITY
function addScore(){
  for(let i=0; i<199; i+=WIDTH){
    const ROW = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]; //Creating an array with the length of WIDTH for analizing a single row. Its necessary to add the constants in each cell so the array will represent the rows of the grid.

    if(ROW.every( i => squares[i].classList.contains('taken'))){ //We ask if the row has all its cells with the classList 'taken'. 
      score += 10;
      SCORE_DISPLAY.innerHTML = score;

      //Check this. Should be in other function. Removing pieces functionality.      
      ROW.forEach(i => {
        squares[i].classList.remove('taken');
        squares[i].classList.remove('piece');
        squares[i].style.backgroundColor = '';
      })

      const REMOVED_SQUARES = squares.splice(i, WIDTH);
      squares = REMOVED_SQUARES.concat(squares);
      squares.forEach(cell => GRID.appendChild(cell));
    }
  }
}

//GAME OVER FUNCTIONALITY
function gameOver(){
  if (currentPiece.some(item => squares[item + currentPosition].classList.contains('taken'))){ //If the tetrominoe has riched the top of the grid then the interval is cleared and stops the pieces movement.
    SCORE_DISPLAY.innerHTML = "YOU LOST!" + " Your final score is " + score;
    clearInterval(timerId);
  }
}

/* 

CONSIDERACIONES
* Acomodar la posicion de variables al inicio del archivo .js, incluyendo las constantes del MINI GRID.
* Eliminar la clase 'piece' del archivo .css. Ya no es necesaria. Los colores se generan aleatoriamente.
* Hacer una nueva función con líneas repetidas de inicialización de nuevas piezas, de posición, etc.
* Revisar la función movesControl. Cambiar estructura sin tantos ifs.
* Revisar si la asignación en la función moveDown se puede poner dentro de otra función.
* Revisar funciones moveRight y moveLeft. Cambiar lógica.
* Separar la función addScore en distintas funciones.

*/