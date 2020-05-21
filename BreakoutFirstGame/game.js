var canvas = document.getElementById("game-canvas");
var context = canvas.getContext("2d");

var score = 0;
var lives = 3;

var ballX = canvas.width / 2;
var ballY = canvas.height - 30;
var deltaX = 5;
var deltaY = -5;
var ballRadius = 10;

var paddleWidth = 150;
var paddleHeight = 10;
var paddleX = (canvas.width - paddleWidth) / 2;

var left = false;
var right = false;

var brickRowCount = 8;
var brickColumnCount = 9;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 70;
var brickOffsetLeft = 90;
var brickWidth =
  (canvas.width - brickOffsetLeft * 2 - brickPadding * (brickColumnCount - 1)) /
  brickColumnCount;

var bricks = [];
for (var column = 0; column < brickColumnCount; column++) {
  bricks[column] = [];
  for (var row = 0; row < brickRowCount; row++) {
    bricks[column][row] = { x: 0, y: 0, break: false };
  }
}

var ballStyle = "red";
var brickStyle = "rgb(36, 189, 16)";
var paddleStyle = "black";

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  writeScore();
  writeLives();
  collisionDetection();
  moveBall();
  movePaddle();
  requestAnimationFrame(draw);
}

function drawBricks() {
  for (var column = 0; column < brickColumnCount; column++) {
    for (var row = 0; row < brickRowCount; row++) {
      if (!bricks[column][row].break) {
        var brickX = column * (brickWidth + brickPadding) + brickOffsetLeft;
        var brickY = row * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[column][row].x = brickX;
        bricks[column][row].y = brickY;
        context.beginPath();
        context.rect(brickX, brickY, brickWidth, brickHeight);
        context.fillStyle = brickStyle;
        context.fill();
        context.closePath();
      }
    }
  }
}

function collisionDetection() {
  for (var column = 0; column < brickColumnCount; column++) {
    for (var row = 0; row < brickRowCount; row++) {
      var brick = bricks[column][row];
      if (!brick.break) {
        if (
          ballX > brick.x &&
          ballX < brick.x + brickWidth &&
          ballY > brick.y &&
          ballY < brick.y + brickHeight
        ) {
          score = 100 + score;
          brick.break = true;
          deltaY *= -1;
          ballStyle =
            "#" +
            (Math.random().toString(16) + "000000")
              .substring(2, 8)
              .toUpperCase();
        }
      }
    }
  }
}

function ballToStart() {
  
  ballX = canvas.width / 2;
  ballY = canvas.height - paddleHeight - ballRadius;
  deltaX = 5;
  deltaY = -5;
}

function paddleToStart() {
  paddleX = (canvas.width - paddleWidth) / 2;
}

function looseBall() {
  lives--;
  if (lives == 0) {
    alert("GAME OVER");
    document.location.reload();
  } else {
    ballToStart();
    paddleToStart();
  }
}

function randomiseColor() {
  return (
    "#" + (Math.random().toString(16) + "000000").substring(2, 8).toUpperCase()
  );
}

function drawBall() {
  context.beginPath();
  context.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  context.fillStyle = ballStyle;
  context.fill();
  context.stroke();
  context.closePath();
}

function moveBall() {
  if (ballY + deltaY - ballRadius < 0) {
    ballStyle = randomiseColor();
    deltaY *= -1;
  } else if (ballY + deltaY + ballRadius > canvas.height) {
    if (ballX > paddleX && ballX < paddleX + paddleWidth) {
      deltaY *= -1;
    } else {
      looseBall()();
    }
  }
  if (
    ballX + deltaX + ballRadius > canvas.width ||
    ballX + deltaX - ballRadius < 0
  ) {
    deltaX *= -1;
    ballStyle = randomiseColor();
  }
  ballX += deltaX;
  ballY += deltaY;
}

function drawPaddle() {
  context.beginPath();
  context.rect(
    paddleX,
    canvas.height - paddleHeight,
    paddleWidth,
    paddleHeight
  );
  context.fillStyle = paddleStyle;
  context.fill();
  context.stroke();
  context.closePath();
}

function movePaddle() {
  if (left) {
    paddleX -= 7;
    if (paddleX < 0) {
      paddleX = 0;
    }
  }
  if (right) {
    paddleX += 7;
    if (paddleX + paddleWidth > canvas.width) {
      paddleX = canvas.width - paddleWidth;
    }
  }
}

function writeScore() {
  context.font = "16px Arial";
  context.fillStyle = "black";
  context.fillText("Score: " + score, 8, 20);
}

function writeLives() {
  context.font = "16px Arial";
  context.fillStyle = "black";
  context.fillText("Lives: " + lives, canvas.width - 70, 20);
}

function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    right = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    left = true;
  }
}

function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    right = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    left = false;
  }
}

function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width - paddleWidth) {
    paddleX = relativeX;
  } else if (relativeX < 0) {
    paddleX = 0;
  } else if (relativeX > canvas.width - paddleWidth) {
    paddleX = canvas.width - paddleWidth;
  }
}

//var inrerval = setInterval(draw, 10);
draw();
