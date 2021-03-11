//Pong Source Code
const cvs = document.getElementById("pong");
const ctx = cvs.getContext("2d");

// draw rect function


function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);



}




//create user paddle object
const user = {
    x : 0,
    y : (cvs.height - 100)/2,
    width : 10,
    height : 100,
    color : "BLUE",
    score : 0

}

//create AI Paddle object
const AI = {
    x : cvs.width - 10,
    y : (cvs.height - 100)/2,
    width : 10,
    height : 100,
    color : "RED",
    score : 0

}

//create the ball object
const ball = {
    x : cvs.width/2,
    y : cvs.height / 2,
    radius : 10,
    speed : 7,
    velocityX : 5,
    velocityY : 5,
    color : "ORANGE"

}

//draw Circle

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2,true);
    ctx.closePath();
    ctx.fill();



}


//draw text

function drawText(text,x,y,color) {
    ctx.fillStyle = color;
    ctx.font = "45px fantasy";
    ctx.fillText(text, x, y);


}

//create net object
const net = {
    x : (cvs.width-2)/2,
    y : 0,
    width : 2,
    height : 10,
    color : "WHITE"

}
//draw net
function drawNet() {
    for (let i = 0; i <= cvs.height; i += 15) {
         drawRect(net.x, net.y + i, net.width, net.height, net.color)

    }

}

//render the game

function render() {
//clear canvas first before new frame
    drawRect(0, 0, cvs.width, cvs.height, "BLACK");

    //draw the net
    drawNet();

    //draw score 
    drawText(user.score, cvs.width/4, cvs.height/5, "WHITE");
    drawText(AI.score, 3*cvs.width/4, cvs.height/5, "WHITE");

    // draw the user and computer paddles in new position
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(AI.x, AI.y, AI.width, AI.height, AI.color);

    //draw the ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color);

    //game function will call the render and update it
    

}
//control the user paddle

cvs.addEventListener("mousemove", movePaddle);
function movePaddle(evt) {
    let rect = cvs.getBoundingClientRect();

    user.y = evt.clientY - rect.top - user.height/2;
}

//collision function
function collision(b, p) {
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;


}

//reset ball function
function resetBall() {
    ball.x = cvs.width/2;
    ball.y = cvs.height/2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 7;
    


}
//update function
function update() {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    //Simple AI to control the computer's paddle
    let computerLevel = 0.1;
    AI.y += (ball.y - (AI.y + AI.height/2)) * computerLevel;


    if (ball.y + ball.radius > cvs.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
    }

    let player = (ball.x < cvs.width / 2) ? user : AI;

    if (collision(ball, player)) {
        //where the ball hits the player

        let collidePoint = ball.y - (player.y + player.height/2);

        //normalization
        collidepoint = collidePoint / (player.height/2);

        // calculate angle in radian
        let angleRad = collidePoint * Math.PI/ 4;

        // x direction should change when hit
        let direction = (ball.x + ball.radius < cvs.width/2) ? 1 : -1;


        // change velocity x and y
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = direction * ball.speed * Math.sin(angleRad);

        //everytime ball is hit by a paddle the speed is increased

        ball.speed += 0.5;



    }
    //update the score
    if (ball.x - ball.radius < 0) {
        // the AI wins match
        AI.score++;
        resetBall();
    } else if (ball.x + ball.radius > cvs.width) {
        // the user scores
        user.score++;
        resetBall();

    }
}

function game() {
    update();
    render();

}

//update loop
const framePerSecond = 70;
setInterval(game, 1000 / framePerSecond);
