import p5 from "p5";

import Pipe from "./pipe/Pipe";
import Bird from "./bird/Bird";
import { createPipePair } from "./pipe/pipeUtils";

import {
  SCREEN_SIZE,
  PIPE_GAP,
  SPEED,
  FRAMEDRAW,
  NUM_BIRDS,
  BIRD_RADIUS,
  USE_AI,
} from "./constants";

const sketch = (p) => {
  // here we have access to p5 custom methods using p, but not in the global scope

  let pipeGap = PIPE_GAP;
  let speed = SPEED;
  let framedraw = FRAMEDRAW;
  const scene = {
    canvas: undefined,
    pipes: undefined,
    birds: undefined,
  };
  let score = 0;
  let counter = 0;
  let gameOver = false;
  let updateSpeedSlider;

  function reset() {
    // TODO: Implement LEARNING cycle of AI

    scene.birds = Array.apply(null, Array(NUM_BIRDS)).map(
      () =>
        new Bird({
          y: p.random(0 + BIRD_RADIUS, SCREEN_SIZE - BIRD_RADIUS),
        })
    );

    scene.pipes = createPipePair(pipeGap, p);
    score = 0;
    counter = 0;
    gameOver = false;
  }

  function setup() {
    scene.canvas = p.createCanvas(SCREEN_SIZE, SCREEN_SIZE);

    // a slider to control the speed of updates (will be useful for AI)
    updateSpeedSlider = p.createSlider(1, 200, 1);
    reset();
  }

  function update() {
    let { birds = [], pipes = [] } = scene;
    counter += 1;
    /** Gameover ? QUIT */
    if (gameOver) {
      return;
    }

    /* update birds */
    birds.forEach((bird) => bird.update());

    /* update pipes */
    pipes.forEach((pipe) => pipe.update(speed));
    scene.pipes = pipes.filter((pipe) => pipe.onScreen);

    /* update scene */
    if (counter % framedraw === 0) {
      scene.pipes.push(...createPipePair(pipeGap, p));
      score += 1;
    }
    if (counter % 200 === 0) {
      pipeGap -= 10;
      const min = BIRD_RADIUS * 2 + 20;
      if (pipeGap < min) {
        pipeGap = min;
      }
    }
    if (counter % 500 === 0) {
      speed += speed < 15 ? 1 : 0;
    }

    /** check for collisions */
    const pipesToCheck = pipes.slice(0, 2);
    birds.forEach((bird) => {
      if (bird.dead) return;
      const dead = pipesToCheck.reduce((isDead, pipe) => {
        const collision = bird.collides(pipe);
        return collision || !bird.onScreen || isDead;
      }, bird.dead);

      if (dead) {
        bird.die();
      }
    });

    /** Check gameover */
    if (birds.every((bird) => bird.dead)) {
      gameOver = true;
    }

    if (USE_AI) {
      // TODO IMPLEMENT AI
      birds.forEach((bird) => bird.think(pipes));
    }
  }

  function draw() {
    let { birds = [], pipes = [] } = scene;

    /* DRAW BACKGROUND*/
    p.background(220, 240, 255);

    /* DRAW BIRD */
    birds.forEach((bird) => bird.draw(p));

    /* DRAW PIPES */
    pipes.forEach((pipe) => pipe.draw(p));

    /* DRAW SCORE */
    p.fill(0);
    p.textSize(50);
    p.text(Math.floor(score), 50, 50);

    if (gameOver) {
      writeLoser();
    }

    /* UPDATE */
    // allows for a fastforward effect
    for (let i = 0; i < updateSpeedSlider.value(); i++) {
      update();
    }
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
    if (gameOver) {
      reset();
      return;
    }

    if (USE_AI) {
      // if AI is enabled, then don't do anything
      return;
    }
    const { birds } = scene;
    birds.forEach((bird) => bird.flap());
  }

  function writeLoser() {
    const size = 50;
    p.fill(0);
    p.textAlign(p.CENTER);
    p.textSize(size);
    p.text("AHAHAH LOSER !", SCREEN_SIZE / 2, SCREEN_SIZE / 2 - size / 2);
    p.text(
      Math.floor(score) + " puntos",
      SCREEN_SIZE / 2,
      SCREEN_SIZE / 2 + size
    );
  }

  p.draw = draw;
  p.setup = setup;
  p.keyPressed = keyPressed;
  p.touchStarted = touchStarted;
};

const myP5Sketch = new p5(sketch);
