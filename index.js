/*
If you are going to pubically use this code, you must properlly credit Terry Kim
Github ID: taekim97
*/
var onlineDir = "https://raw.githubusercontent.com/taekim97/Flappy-Bird/master/"
var bird1Img;
var bird2Img;
var bird3Img;
var curBirdImg;
var birdQueue;

var pipe_img;
var pipeTip_img;
var pipes;

var backgroundImg;
var groundImg;
var grounds;

var flappyFont;

var score;
var pause;
var newGame;
var hitPipe;

var bird;

// Sketch
function preload(){
    // Load Images
    bird1Img = loadImage(onlineDir + '/assets/bird1.png');
    bird2Img = loadImage(onlineDir + '/assets/bird2.png');
    bird3Img = loadImage(onlineDir + '/assets/bird3.png');
    curBirdImg = bird2Img;

    pipe_img = loadImage(onlineDir + '/assets/pipe_body.png');
    pipeTip_img = loadImage(onlineDir + '/assets/pipe_tip.png');

    backgroundImg = loadImage(onlineDir + '/assets/background.png');
    groundImg = loadImage(onlineDir + '/assets/ground.png');

    flappyFont = loadFont(onlineDir + '/assets/flappy_font.TTF');
}

function setup() {

    createCanvas(375, 600);
    bird = new Bird();

    birdQueue = [bird1Img, bird2Img, bird3Img];
    let initGround = new Ground();
    initGround.x = 0;
    grounds = [initGround];

    pipes = [];
    score = 0;
    pause = true;
    newGame = true;
    hitPipe = false;
}

function draw() {
    background(backgroundImg);
    image(backgroundImg, 0,0,375,525);

    if (grounds.length < 3){
        grounds.push(new Ground());
    }
    for (var i = grounds.length-1; i >= 0; i--){
        grounds[i].show();
        if (!hitPipe){
            grounds[i].update();
        }

        if (grounds[i].offscreen()){
            grounds.shift();
        }

    }

    for (var i = pipes.length-1; i >= 0; i--){
        pipes[i].show();
        if (!hitPipe){
            pipes[i].update();
        }

        if (pipes[i].hits(bird)){
            pause = true;
            hitPipe = true;
        }

        if (pipes[i].offscreen()){
            score++;
            pipes.shift();
        }
    }

    if (!hitPipe && !pause) {
        if (frameCount % 110 == 0) {
            pipes.push(new Pipe());
        }
    }

    if (newGame){
        bird.show();
    } else {
        bird.update();
        bird.show();
    }



    // Score
    fill('#ffffff');
    textFont(flappyFont);
    textSize(75);
    textAlign(CENTER);
    text(score, width/2, 100);

}

function keyPressed() {
    if (key == ' ' && !hitPipe) {
        if (newGame) {
            pause = false;
            newGame = false;
        } else {
            bird.up();
        }
    } else if (keyCode == ENTER && hitPipe){
        setup();
    }
}

// Bird
function Bird() {
    this.y = height / 2;
    this.x = 64;

    this.gravity = .6;
    this.lift = -15;
    this.velocity = 0;

    this.show = function() {
        imageMode(CENTER);

        if (!hitPipe){
            if (frameCount % 5 == 0) {
                curBirdImg = birdQueue.shift();
                birdQueue.push(curBirdImg);
            }
            image(curBirdImg, this.x, this.y, 40, 40 );
        } else {
            image(bird2Img, this.x, this.y, 40, 40 );
        }
    }

    this.up = function () {
        this.velocity += this.lift;

    }

    this.update = function() {
        if (this.y >= 525) {
            this.y = 525;
            this.velocity = 0;
            pause = true;
        } else {
            this.velocity += this.gravity;
            this.velocity *= .9;
            this.y += this.velocity;

            if (this.y < 0) {
                this.y = 0;
                this.velocity = 0;
            }
        }


    }
}

// Pipe
function Pipe() {
    this.skyHeight = height - 75;
    this.top = random(50,this.skyHeight/2);
    this.bottom = this.top + 110;
    this.x = width;
    this.w = 70;
    this.speed = 2;

    this.show = function () {
        fill(255);

        image(pipe_img, this.x, 0, this.w, this.top);
        image(pipeTip_img, this.x, this.top - 25, this.w, 25);

        image(pipe_img,this.x, this.bottom, this.w, this.skyHeight - this.bottom);
        image(pipeTip_img, this.x, this.bottom, this.w, 25);
    }

    this.update = function() {
        this.x -= this.speed;
    }

    this.offscreen = function() {
        if (this.x + this.w <= 0) {
            return true;
        } else {
            return false;
        }
    }

    this.hits = function (bird){
        if (bird.y - 20 <= this.top || bird.y + 20 >= this.bottom) {
            if (bird.x > this.x && bird.x < this.x + this.w) {
                return true;
            }
        }

        return false;
    }
}

// Ground
function Ground() {
    this.x = width;
    this.y = 375;
    this.speed = 2;

    this.show = function(){
        image(groundImg, this.x,525, 375, 75);
    }

    this.update = function(){
        this.x -= this.speed;
    }

    this.offscreen = function() {
        if (this.x + width <= 0) {
            return true;
        } else {
            return false;
        }
    }
}
