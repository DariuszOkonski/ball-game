let canvas, canvasContext;

let ballX = 75;
let ballY = 75;
let ballSpeedX = 5;
let ballSpeedY = 7;

const PADDLE_WIDTH = 100;
const PADDLE_THICKNESS = 10;
let paddleX = 400;

function updateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;

    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    // var mouseY = evt.clientY - rect.top - root.scrollTop;
    paddleX = mouseX - PADDLE_WIDTH/2;
    console.log(paddleX);
}

window.onload = function() {
    canvas = document.getElementById("gameCanvas");
    canvasContext = canvas.getContext('2d');

    let framesPerSecond = 30;
    setInterval(updateAll, 1000/framesPerSecond);

    canvas.addEventListener('mousemove', updateMousePos);
}

function updateAll() {
    moveAll();
    drawAll();
}

function moveAll() {
    ballX += ballSpeedX;
    ballY += ballSpeedY
    
    if(ballX < 0) {
        ballSpeedX *= -1;
    }
    
    if(ballX > canvas.width) {
        ballSpeedX *= -1;
    }
    
    if(ballY < 0) {
        ballSpeedY *= -1;
    }
    
    if(ballY > canvas.height) {
        ballSpeedY *= -1;
    }
}

function drawAll() {
    //clear screen
    colorRect(0,0,canvas.width, canvas.height, 'black');

    //draw ball
    colorCircle(ballX, ballY, 10, 'white');

    //draw paddle
    colorRect(paddleX, canvas.height - PADDLE_THICKNESS, PADDLE_WIDTH, PADDLE_THICKNESS, 'white');
    
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