import p5 from "p5";

import { BIRD_RADIUS, SCREEN_SIZE, GRAVITY, UP } from "../constants.js";

export default class Bird {
  constructor({ x = 100, y, vx = 0, vy = 0, flapPower = UP }) {
    this.pos = new p5.Vector(x, y);
    this.velocity = new p5.Vector(vx, vy);
    this.radius = BIRD_RADIUS;
    this.dead = false;
    this.score = 0;
    this.flapPower = flapPower;
  }

  get top() {
    return this.pos.y - this.radius;
  }

  get bottom() {
    return this.pos.y + this.radius;
  }

  get left() {
    return this.pos.x - this.radius;
  }

  get right() {
    return this.pos.x + this.radius;
  }

  get onScreen() {
    return this.bottom < SCREEN_SIZE && this.top > 0;
  }

  draw(p) {
    if (this.dead) return;
    p.fill(255, 255, 200);
    p.ellipse(this.pos.x, this.pos.y, this.radius * 2, this.radius * 2);
  }

  update() {
    if (this.dead) return;
    this.velocity.y += GRAVITY;
    if (this.velocity.y > 20) {
      this.velocity.y = 20;
    }
    if (this.velocity.y < -20) {
      this.velocity.y = -20;
    }

    this.pos.y += this.velocity.y;
    if (this.pos.y > SCREEN_SIZE) {
      this.pos.y = SCREEN_SIZE;
      this.velocity.y = 0;
    }

    if (this.pos.y < 0) {
      this.pos.y = 0;
    }

    this.score++;
  }

  flap() {
    this.velocity.y += this.flapPower;
  }

  die() {
    this.dead = true;
  }

  collides(pipe) {
    const hitX = this.right > pipe.left && this.left < pipe.right;
    const hitY = this.bottom > pipe.top && this.top < pipe.bottom;
    return hitX && hitY;
  }

  think(pipes) {
    // TODO: Implement AI
  }
}
