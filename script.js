let canvas, canvasContext;

let ballX = 75;
let ballY = 75;
let ballSpeedX = 5;
let ballSpeedY = 7;

const BRICK_W = 80;
const BRICK_H = 20;
const BRICK_COLS = 10;
const BRICK_GAP = 2;
const BRICKS_ROWS = 14;

let brickGrid = new Array(BRICK_COLS * BRICKS_ROWS);

const PADDLE_WIDTH = 100;
const PADDLE_THICKNESS = 10;
const PADDLE_DIST_FROM_EDGE = 60;
let paddleX = 400;

let mouseY;
let mouseX;

function updateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;

    mouseX = evt.clientX - rect.left - root.scrollLeft;
    mouseY = evt.clientY - rect.top - root.scrollTop;
    paddleX = mouseX - PADDLE_WIDTH/2;
}
    
function brickReset() {
    for(let i = 0; i < BRICK_COLS * BRICKS_ROWS; i++) {
        brickGrid[i] = Math.random() < 0.5 ? true : false;
        // brickGrid[i] = true        
    }
}

window.onload = function() {
    canvas = document.getElementById("gameCanvas");
    canvasContext = canvas.getContext('2d');

    let framesPerSecond = 30;
    setInterval(updateAll, 1000/framesPerSecond);

    canvas.addEventListener('mousemove', updateMousePos);

    brickReset();
}

function updateAll() {
    moveAll();
    drawAll();
}

function ballReset() {
    ballX = canvas.width/2;
    ballY = canvas.height/2;
}

function moveAll() {
    ballX += ballSpeedX;
    ballY += ballSpeedY
    
    if(ballX < 0) { //left side
        ballSpeedX *= -1;
    }
    
    if(ballX > canvas.width) { //right sight
        ballSpeedX *= -1;
    }
    
    if(ballY < 0) {  //top edge
        ballSpeedY *= -1;
    }
    
    if(ballY > canvas.height) { //bottom edge
        ballReset();
    }

    var paddleTopEdgeY = canvas.height - PADDLE_DIST_FROM_EDGE;
    var paddleBottomEdgeY = paddleTopEdgeY + PADDLE_THICKNESS;
    var paddleLeftEdgeX = paddleX;
    var paddleRightEdgeX = paddleX + PADDLE_WIDTH;

    if( ballY > paddleTopEdgeY && // below the top of paddle
        ballY < paddleBottomEdgeY && // above bottom of paddle
        ballX > paddleLeftEdgeX && // right of the left side of paddle
        ballX < paddleRightEdgeX) { // left of the left side of paddle

        ballSpeedY *= -1;

        var centerOfPaddleX = paddleX + PADDLE_WIDTH / 2;
        var ballDistFromPaddleCenterX = ballX - centerOfPaddleX;
        ballSpeedX = ballDistFromPaddleCenterX * 0.35;
    }
}

function rowColToArrayIndex(col, row) {
    return BRICK_COLS * row + col;
}

function drawBricks() {
    for(let eachRow = 0; eachRow < BRICKS_ROWS; eachRow++) {
        for(let eachCol = 0; eachCol < BRICK_COLS; eachCol++) {

            let arrayIndex = rowColToArrayIndex(eachCol, eachRow);
            if(brickGrid[arrayIndex]) {
                colorRect(BRICK_W*eachCol, BRICK_H*eachRow, BRICK_W-BRICK_GAP, BRICK_H-BRICK_GAP, 'blue');                
            }
        }
    } 
}

function drawAll() {
    //clear screen
    colorRect(0,0,canvas.width, canvas.height, 'black');

    //draw ball
    colorCircle(ballX, ballY, 10, 'white');

    //draw paddle
    colorRect(paddleX, canvas.height - PADDLE_DIST_FROM_EDGE, PADDLE_WIDTH, PADDLE_THICKNESS, 'white');
    
    // draw single brick
    drawBricks();
    
    //draw square by pointer
    let mouseBrickCol = Math.floor(mouseX / BRICK_W);
    let mouseBrickRow = Math.floor(mouseY / BRICK_H);
    let brickIndexUnderMouse =rowColToArrayIndex(mouseBrickCol, mouseBrickRow);
    colorText(mouseBrickCol+" - "+mouseBrickRow+" | brick nr: "+brickIndexUnderMouse , mouseX, mouseY, 'yellow');    
}

function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}

function colorCircle(centerX, centerY, radius, fillColor, ) {
    // create circle
    canvasContext.fillStyle = fillColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    canvasContext.fill();
}

function colorText(showWords, textX, textY, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.fillText(showWords, textX, textY);
}