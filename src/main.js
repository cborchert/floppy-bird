const SCREEN_SIZE = 800;
const BIRD_RADIUS = 40;
let PIPE_GAP = 350;
const PIPE_WIDTH = 150;
const PIPE_MIN_HEIGHT = 50;
const scene = {
  canvas: undefined,
  player: undefined,
  pipes: undefined,
};
const GRAVITY = 0.7;
const UP = -12;
let SPEED = 5;
let FRAMEDRAW = 100;
let YOUHITMF = false;
let POINT = 0;
let COUNT = 0;
let birdSprite;

function initScene() {
  scene.player = {
    pos: createVector(100, scene.canvas.height / 4),
    v: createVector(0, 0),
    radius: BIRD_RADIUS,
    dead: false,
  };
  scene.pipes = createPipePair();
  POINT = 0;
  COUNT = 0;
}

function setup() {
  // here we have access to p5 custom methods, but not in the global scope
  scene.canvas = createCanvas(SCREEN_SIZE, SCREEN_SIZE);
  birdSprite = loadImage("/src/images/bird.png");
  initScene();
}

function createPipePair() {
  console.log("here", scene.player.dead);
  const gapStart = random(
    PIPE_MIN_HEIGHT,
    SCREEN_SIZE - PIPE_GAP - PIPE_MIN_HEIGHT
  );
  return [
    {
      x: SCREEN_SIZE,
      y: 0,
      height: gapStart,
    },
    {
      x: SCREEN_SIZE,
      y: gapStart + PIPE_GAP,
      height: SCREEN_SIZE - (gapStart + PIPE_GAP),
    },
  ];
}

function draw() {
  let { player, pipes } = scene;
  COUNT += 1;

  background(220, 240, 255);

  /* DRAW */
  fill(255, 255, 200);
  // image(birdSprite, birdSprite.width / 2, birdSprite.height / 2);
  ellipse(player.pos.x, player.pos.y, player.radius * 2, player.radius * 2);
  drawPipes();
  drawScrore();

  if (player.dead) {
    writeLoser();
    return;
  }

  /* UPDATE */
  player.v.y += GRAVITY;
  if (player.v.y > 20) {
    player.v.y = 20;
  }
  if (player.v.y < -20) {
    player.v.y = -20;
  }

  player.pos.y += player.v.y;
  if (player.pos.y > SCREEN_SIZE) {
    player.pos.y = SCREEN_SIZE;
    player.v.y = 0;
  }

  if (player.pos.y < 0) {
    player.pos.y = 0;
  }

  /* Pipes */
  if (COUNT % FRAMEDRAW === 0) {
    scene.pipes.push(...createPipePair());
    POINT += 1;
  }
  if (COUNT % 200 === 0) {
    PIPE_GAP -= 10;
    const min = player.radius * 2 + 20;
    if (PIPE_GAP < min) {
      PIPE_GAP = min;
    }
  }
  if (COUNT % 500 === 0) {
    SPEED += SPEED < 15 ? 1 : 0;
  }
  updatePipes();
  checkHit();
}

function drawScrore() {
  fill(0);
  textSize(50);
  text(Math.floor(POINT), 50, 50);
}

function updatePipes() {
  let { pipes } = scene;

  scene.pipes = pipes
    .map((pipe) => ({
      ...pipe,
      x: pipe.x - SPEED,
    }))
    .filter((pipe) => pipe.x > -PIPE_WIDTH);
}

function checkHit() {
  let { player, pipes } = scene;
  const pipesToCheck = pipes.slice(0, 2);
  const dead = pipesToCheck.reduce((isDead, pipe) => {
    const playerRight = player.pos.x + player.radius;
    const playerLeft = player.pos.x - player.radius;
    const pipeLeft = pipe.x;
    const pipeRight = pipe.x + PIPE_WIDTH;

    const hitX = playerRight > pipeLeft && playerLeft < pipeRight;

    const playerTop = player.pos.y - player.radius;
    const playerBottom = player.pos.y + player.radius;
    const pipeTop = pipe.y;
    const pipeBottom = pipe.y + pipe.height;

    const hitY = playerBottom > pipeTop && playerTop < pipeBottom;

    const offScreen = playerBottom > height || playerTop < 0;

    return (hitX && hitY) || offScreen || isDead;
  }, false);

  player.dead = dead;
}

function keyPressed(val) {
  const isJump = val.code === "Space";
  if (isJump) {
    handleUserInteraction();
  }
}

function touchStarted() {
  handleUserInteraction();
}

function handleUserInteraction() {
  const { player } = scene;
  player.v.y += UP;
  if (player.dead) {
    initScene();
  }
}

function drawPipes() {
  const { pipes } = scene;

  fill(200, 255, 200);
  if (pipes)
    pipes.forEach((pipe) => {
      rect(pipe.x, pipe.y, PIPE_WIDTH, pipe.height);
    });
}

function writeLoser() {
  const size = 50;
  fill(0);
  textAlign(CENTER);
  textSize(size);
  text("AHAHAH LOSER !", SCREEN_SIZE / 2, SCREEN_SIZE / 2 - size / 2);
  text(Math.floor(POINT) + " puntos", SCREEN_SIZE / 2, SCREEN_SIZE / 2 + size);
}
