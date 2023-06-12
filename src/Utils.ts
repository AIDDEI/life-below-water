import * as PIXI from "pixi.js";

/**
 * fade a container into view, by adjusting it's alpha value.
 *
 *
 * @param container - PIXI.Container, container to fade into view.
 * @param ms? - Optional parameter to set duration in miliseconds
 *
 */
export function fadeIn(container: PIXI.Container, ms?: number) {
  container.visible = true;
  container.alpha = 0;
  const ticker = PIXI.Ticker.shared;
  const change = ms ? (1 / ms) * ticker.elapsedMS : 0.02;

  const onTick = () => {
    container.alpha += change;

    if (container.alpha > 1) {
      ticker.remove(onTick);
    }
  };

  ticker.add(onTick);
}

/**
 * fade a container out of view, by adjusting it's alpha value.
 *
 *
 * @param container - PIXI.Container, container to fade out of view.
 * @param ms? - Optional parameter to set duration in miliseconds
 *
 */
export function fadeOut(container: PIXI.Container, ms?: number) {
  const ticker = PIXI.Ticker.shared;
  const change = ms ? (1 / ms) * ticker.elapsedMS * -1 : -0.03;

  const onTick = () => {
    container.alpha += change;

    if (container.alpha < 0) {
      ticker.remove(onTick);
      container.visible = false;
    }
  };

  ticker.add(onTick);
}

/**
 * Check if two sprite objects touch each other
 *
 *
 * @param object1: Sprite | Graphics
 * @param object2: Sprite | Graphics
 *
 */
export function collision(object1: PIXI.Sprite | PIXI.Graphics, object2: PIXI.Sprite | PIXI.Graphics) {
    const bounds1 = object1.getBounds()
    const bounds2 = object2.getBounds()

    return bounds1.x < bounds2.x + bounds2.width
        && bounds1.x + bounds1.width > bounds2.x
        && bounds1.y < bounds2.y + bounds2.height
        && bounds1.y + bounds1.height > bounds2.y;
}

