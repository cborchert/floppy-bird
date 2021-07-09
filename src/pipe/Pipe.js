import { PIPE_WIDTH } from "../constants.js";

export default class Pipe {
  constructor({ x, y, height, width = PIPE_WIDTH }) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
  }

  get top() {
    return this.y;
  }

  get bottom() {
    return this.y + this.height;
  }

  get left() {
    return this.x;
  }

  get right() {
    return this.x + this.width;
  }

  get onScreen() {
    return this.x > -1 * this.width;
  }

  draw(p) {
    p.fill(200, 255, 200);
    p.rect(this.x, this.y, this.width, this.height);
  }

  update(speed) {
    this.x -= speed;
  }
}
