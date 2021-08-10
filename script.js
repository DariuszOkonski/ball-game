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
let bricksLeft = 0;

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

    // cheat / hack to test ball in any position
    // ballX = mouseX;
    // ballY = mouseY;
    // ballSpeedX = 4;
    // ballSpeedY = -4;
}
    
function brickReset() {
    bricksLeft = 0;
    let i;
    for(i = 0; i < 3*BRICK_COLS; i++) { 
        brickGrid[i] = false;
    }

    for(; i < BRICK_COLS * BRICKS_ROWS; i++) {
        // brickGrid[i] = Math.random() < 0.5 ? true : false;
        brickGrid[i] = true  
        bricksLeft++;      
    }
}

window.onload = function() {
    canvas = document.getElementById("gameCanvas");
    canvasContext = canvas.getContext('2d');

    let framesPerSecond = 30;
    setInterval(updateAll, 1000/framesPerSecond);

    canvas.addEventListener('mousemove', updateMousePos);

    brickReset();
    ballReset();
}

function updateAll() {
    moveAll();
    drawAll();
}

function ballReset() {
    ballX = canvas.width/2;
    ballY = canvas.height/2;
}

function ballMove() {
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
        brickReset();
    }
}

function isBrickAtColRow(col, row) {
    if(col >= 0 && col < BRICK_COLS && row >=0 && row < BRICKS_ROWS) {
        let brickIndexUnderCord = rowColToArrayIndex(col, row);
        return brickGrid[brickIndexUnderCord];
    } else {
        return false;
    }
    
}

function ballBrickHandling() {
    //draw square by pointer
    let ballBrickCol = Math.floor(ballX / BRICK_W);
    let ballBrickRow = Math.floor(ballY / BRICK_H);
    let brickIndexUnderBall =rowColToArrayIndex(ballBrickCol, ballBrickRow);
        

    if(ballBrickCol >= 0 && ballBrickCol < BRICK_COLS && 
        ballBrickRow >=0 && ballBrickRow < BRICKS_ROWS) {

        if(isBrickAtColRow(ballBrickCol, ballBrickRow)) {
            brickGrid[brickIndexUnderBall] = false;
            bricksLeft--;
            console.log(bricksLeft)
            
            let prevBallX = ballX - ballSpeedX;
            let prevBallY = ballY - ballSpeedY;
            let prevBrickCol = Math.floor(prevBallX / BRICK_W);
            let prevBrickRow = Math.floor(prevBallY / BRICK_H);
            
            let bothTestsFailed = true;

            if(prevBrickCol != ballBrickCol) {
                if(isBrickAtColRow(prevBrickCol, ballBrickRow) == false) {
                    ballSpeedX *= -1;  
                    bothTestsFailed = false;                  
                }

            }

            if(prevBrickRow != ballBrickRow) {
                if(isBrickAtColRow(ballBrickCol, prevBrickRow) == false) {
                    ballSpeedY *= -1;
                    bothTestsFailed = false;
                }

            }

            // armpit case, prevent ball going through
            if(bothTestsFailed) {
                ballSpeedX *= -1;
                ballSpeedY *= -1;
            }

        }
    }
}

function ballPaddleHandling() {
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

        if(bricksLeft == 0) {
            brickReset();
        }
    }
}

function moveAll() {
    
    ballMove();

    ballBrickHandling();
   
    ballPaddleHandling();    
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