var canvas, canvasContext;
var ballX = 75;
var ballY = 75;
var ballSpeedX = 5;
var ballSpeedY = 7;

const BRICK_W = 100;
const BRICK_H = 50;
const BRICK_COUNT = 4;
var brick1 = true;
var brick2 = true;
var brick3 = true;
var brick4 = true;

const PADDLE_WIDTH = 100;
const PADDLE_THICKNESS = 10;
const PADDLE_DIST_FROM_EDGE = 60;
var paddleX = 400;
var paddleY = 100;
var mouseY;
var mouseX;

window.onload = function() {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    
    var framesPerSecond = 30;
    setInterval(updateAll, 1000/framesPerSecond);   
    
    canvas.addEventListener('mousemove', updateMousePos);
}

function updateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    
    mouseX = evt.clientX - rect.left - root.scrollLeft;
    mouseY = evt.clientY - rect.top - root.scrollTop;

    paddleX = mouseX - (PADDLE_WIDTH / 2);

}

function updateAll() {
    moveAll()
    drawAll(); 
}

function moveAll() {
    bounceBallOnEges();
}

function drawAll() {
    colorRectangle(0, 0, canvas.width, canvas.height, 'black');
    colorCircle(ballX, ballY, 10, 'white');
    colorRectangle(paddleX, canvas.height - PADDLE_DIST_FROM_EDGE, PADDLE_WIDTH, PADDLE_THICKNESS, 'white');
    drawBricks();

    colorText(`${mouseX}, ${mouseY}`, mouseX, mouseY, 'yellow');
}

function drawBricks() {
    if(brick1){
        colorRectangle(0, 0, BRICK_W, BRICK_H, 'blue');            
    }
    if(brick2){
        colorRectangle(BRICK_W + 2, 0, BRICK_W, BRICK_H, 'blue');        
    }
    if(brick3){
        colorRectangle((2 * BRICK_W + 4), 0, BRICK_W, BRICK_H, 'blue');        
    }
    if(brick4){
        colorRectangle((3 * BRICK_W + 6), 0, BRICK_W, BRICK_H, 'blue');        
    }

}

function bounceBallOnEges() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    
    bounceBallLeftRight();
    bounceBallTopBottom();

    checkIfBallHitPaddle();
}

function checkIfBallHitPaddle() {
    var paddleTopEdgeY = canvas.height - PADDLE_DIST_FROM_EDGE;
    var paddleBottomEdgeY = paddleTopEdgeY + PADDLE_THICKNESS;
    var paddleLeftX = paddleX
    var paddleRightX = paddleLeftX + PADDLE_WIDTH;
    if(ballY > paddleTopEdgeY && 
        ballY < paddleBottomEdgeY &&
        ballX > paddleLeftX && 
        ballX < paddleRightX) {
            
            ballSpeedY *= -1;
            
            var centerOfPaddleX = paddleX + PADDLE_WIDTH / 2;
            var ballDistFromPaddleCenterX = ballX - centerOfPaddleX;
            ballSpeedX = ballDistFromPaddleCenterX * 0.35;

        }
}

function colorText(showWords, textX, textY, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.fillText(showWords, textX, textY);
}

function ballReset() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}

function bounceBallTopBottom() {
    if(ballY <= 0)
        ballSpeedY *= -1

    if(ballY >= canvas.height)
        ballReset();
}

function bounceBallLeftRight() {
    if(ballX >= canvas.width || ballX <= 0)
        ballSpeedX *= -1;
}

function colorCircle(centerX, centerY, radius, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);      
    canvasContext.fill();
}

function colorRectangle(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}