// From Sameer & Liz ... we present ...
// Flappy Chud! 
// Our take on Flappy Bird. Instead of a bird, you use art drawn by Liz!
// Characters are meant to represent each of us. You can guess who is who.
// All artwork done in game was courtesy of Liz. Programming by Sameer. 
// Main reference used: Flappy Bird tutorial by The Coding Train. Link Below 
// https://www.youtube.com/watch?v=cXgA1d_E-jY
// AI (ChatGPT) assisted the programming by checking for syntax errors & debugging errors in logic! 
// AI helped a ton when it came to cleaning up a lot of the code used in the tutorial as a lot of it was outdated and not in line with what we have been learning so far, which made it a pain trying to debug errors and program in new features. 
// The Coding Train is still dope though.
// Whenever an AI suggestion was used in coding, a comment will be placed next to it with an explanation!
// For future work on the game, we'd definitely love to have a soundtrack! 

let characterImgs = [];
let chosenCharacter = null;
let gameState = "start";
let bird;
let pipes = [];
let score = 0;
let highScore = 0;

function preload() {
  startImg = loadImage("FCSS.png");
  gameOverImg = loadImage("GameOver.png");
  
  characterImgs[0]= loadImage("ArtistChud.png");
  characterImgs[1] = loadImage("ProgrammerChud.png");
  
  selectSound = loadSound("PowerSound.wav")
  jumpSound = loadSound("PenStroke.wav")
  pointSound = loadSound("BubblePop.mp3")
  deathSound = loadSound("MenuClick.wav")
}

function setup() {
  createCanvas(640, 480);
  resetGame();
}

function draw() {
  if (gameState === "start") {
    background(0);
    
    image(startImg, 0, 0, width, height);
    
    fill(128, 0, 128); 
    textAlign(CENTER);
    textSize(24);
    
    for (let i = 0; i < characterImgs.length; i++) {
      let x = width / 2 - 100 + i * 120;
      let y = height / 2 + 160;
      
      image(characterImgs[i], x, y, 80, 80);
      
      if (chosenCharacter === i) {
        noFill();
        stroke(0);
        strokeWeight(5);
        rect(x, y, 80, 80);
      }
    }
    
    textSize(18);
    fill(0);
    strokeWeight(1);
    text("Click a Chud, then SPACE", width / 2 , height - 100);
    
    return; // AI Suggestion. 
    // ^ Used to stop the function from repeating by stopping it immediately. 
    // This fixed an issue during development where gameplay was not displaying correctly after the start screen. 
  }
  
  background(255);   
  
  if (gameState === "playing") {
  for (let i = pipes.length-1; i >= 0; i--) {
    pipes[i].update();
    
    if (pipes[i].hits(bird) && gameState === "playing") {
      deathSound.play();
      if (score > highScore) {
        highScore = score;
    }
      gameState = "gameOver";
      break; // AI Suggestion
      // ^ Same idea as the return command used above. Used to stop the loop immediately. 
      // Used in this function to stop the pipes from being draw as well as weird flickering that happened during playtesting. 
      // Stops the death sound from constantly repeating and the gameState being reset constantly as well. 
    }
    
    if (!pipes[i].passed && pipes[i].x < bird.x) {
      score++;
      pipes[i].passed = true;
      pointSound.play();
    }
    
    if (pipes[i].offscreen()) {
      pipes.splice(i, 1);
    }
 } 
  
  bird.update();  
  
  let lastPipe = pipes[pipes.length - 1];
  let pipeSpacing = 350; 
  if (lastPipe && lastPipe.x < width - pipeSpacing) {
    pipes.push(new Pipe()); 
  }
} // End of gameState playing loop
  
     for (let i = 0; i < pipes.length; i++){
    pipes[i].show();
  }
  
 bird.show();

    fill(255, 105, 180);
    strokeWeight(2);
    textSize(50);
    textAlign(CENTER);
    text(score, width / 2, 50);
    
    textAlign(RIGHT);
    textSize(20);
    text("High Score: " + highScore, width - 20, 30);
  
  if (gameState === "gameOver") {
    fill(0, 150);
    rect(0, 0, width, height);
    
    let imgWidth = 400;
    let imgHeight = 350;
    
    let x = width / 2 - imgWidth / 2;
    let y = height / 2 - imgHeight / 2;
    
    image(gameOverImg, x, y, imgWidth, imgHeight);
    
    textAlign(CENTER);
    textSize(48);
    fill(255);
    text("GAME OVER", width / 2, height /2);
    
    textSize(24);
    text("Score: " + score, width / 2, height / 2 + 80);
    text("High Score: " + highScore, width / 2, height / 2 + 110);
    
    textSize(20);
    text("SPACE to restart!", width / 2, y + imgHeight + 40);
    text("R for character select!", width / 2, y + imgHeight + 60);
  }
} // End of Draw()

function resetGame() {
  pipes = [];
  
  let img = characterImgs[chosenCharacter] || characterImgs[0];
  bird = new Bird(img);
  
  pipes.push(new Pipe());
  score = 0;
}

function startGame() {
  resetGame();
  gameState = "playing";
}

function restartGame() {
  resetGame();
  gameState = "playing"
}

function keyPressed () {
  if (keyCode === 32) {
    
    if (gameState === "start") {
      
      if (chosenCharacter != null) {
        startGame();
        // AI suggestion. 
        // Used to prevent players from accidentally starting game withouht having pressed a character. 
        // Was an issue during initial playtests.  
      }
    } else if (gameState === "playing") {
        bird.up();
        jumpSound.play(); 
    } else if (gameState === "gameOver") {
        restartGame();
    }
  }
  
  if (key === 'r' || key === 'R') {
    if (gameState === "gameOver") {
      returnToMenu();
    }
  }
}

function mousePressed () {
  if (gameState === "start") {
    for (let i = 0; i < characterImgs.length; i++) {
      let x = width / 2 - 100 + i * 120;
      let y = height / 2 + 160;
      
      if (mouseX > x && mouseX < x + 80 && mouseY > y && mouseY < y + 80) {
        chosenCharacter = i;
        selectSound.play();
      }
  }
 }
}

function returnToMenu () {
  pipes = [];
  bird = new Bird();
  
  chosenCharacter = null;
  gameState = "start";
}