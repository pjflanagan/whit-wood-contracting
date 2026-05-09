import { Visual } from './util/Visual';
import { GUITAR_STRING, GuitarString } from './GuitarString';
import Theme from '../../styles/theme.module.scss';

const DRAW_SPEED = 4;

const GUITAR_STRING_COUNT = parseInt(Theme.guitarStringCount!);
const GUITAR_STRING_GAP = parseInt(Theme.guitarStringGap!);
const NECK_WIDTH = parseInt(Theme.guitarNeckWidth!);
const GUITAR_POSTION_X_PERCENT = parseInt(Theme.guitarPositionXPercent!) / 100;

const INITIAL_RANDOM_ANIMATION = {
  BAR_COUNT: 3,
  STRING_PLUCK_ODDS: 0.2,
  STRING_PLUCK_MAX_DELAY: 200,
  BAR_DELAY: 600
};

export class GuitarVisual extends Visual {
  static visualName = 'Guitar';
  static visualLink = 'guitar';
  strings: GuitarString[];

  constructor(context: CanvasRenderingContext2D) {
    super(context);

    this.strings = [];
  }

  setup() {
    for (let i = 0; i < GUITAR_STRING_COUNT; ++i) {
      const guitarPosition = this.W * GUITAR_POSTION_X_PERCENT;
      const halfNeck = NECK_WIDTH / 2;
      const stringPosition = i * GUITAR_STRING_GAP + i * GUITAR_STRING.WIDTH;
      const absolutePosition = guitarPosition - halfNeck + stringPosition;
      const isEndString = i === GUITAR_STRING_COUNT - 1;
      const guitarString = new GuitarString(this, absolutePosition, isEndString);
      this.strings.push(guitarString);
    }

    // CONSIDER:
    // this.initialRandomAnimation();
  }

  // CONSIDER: we play a specific riff when we start
  // initalRiff() {
  // }

  initialRandomAnimation() {
    for (let i = 0; i < INITIAL_RANDOM_ANIMATION.BAR_COUNT; ++i) {
      this.strings.forEach((string, stringIndex) => {
        if (Math.random() > INITIAL_RANDOM_ANIMATION.STRING_PLUCK_ODDS) {
          setTimeout(() => {
            string.setRandomInitialPullPoint();
          }, stringIndex * Math.random() * INITIAL_RANDOM_ANIMATION.STRING_PLUCK_MAX_DELAY + (i * INITIAL_RANDOM_ANIMATION.BAR_DELAY));
        }
      });
    }
  }

  drawFrame() {
    this.drawBackground();
    this.strings.forEach((s) => {
      for (let i = 0; i < DRAW_SPEED; ++i) {
        s.move();
      }
      s.draw();
    });
  }

  drawBackground() {
    this.ctx.clearRect(0, 0, this.W, this.H);
  }
}
