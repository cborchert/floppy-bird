import { SCREEN_SIZE, PIPE_MIN_HEIGHT } from "../constants.js";
import Pipe from "./Pipe";

export function createPipePair(gapSize, p) {
  const gapStart = p.random(
    PIPE_MIN_HEIGHT,
    SCREEN_SIZE - gapSize - PIPE_MIN_HEIGHT
  );

  return [
    new Pipe({
      x: SCREEN_SIZE,
      y: 0,
      height: gapStart,
    }),
    new Pipe({
      x: SCREEN_SIZE,
      y: gapStart + gapSize,
      height: SCREEN_SIZE - (gapStart + gapSize),
    }),
  ];
}
