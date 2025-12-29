const scene = document.getElementById('scene');
const sceneContext = scene.getContext('2d');

const state = {};

class StarsRenderer {
  stars = [];

  constructor(context, sceneWidth, sceneHeight) {
    this.context = context;
    this.sceneWidth = sceneWidth;
    this.sceneHeight = sceneHeight;
    this.generateStars();
  }

  generateStars = () => {
    for(let y = 0; y < this.sceneHeight; y++) {
      for(let x = 0; x < this.sceneWidth; x++) {
        const random = getRandomInt(1000);
        if(random === 100) {
          this.stars.push({ x, y })
        }
      }
    }
  }

  renderStar = (x, y) => {
    this.context.fillStyle = 'red';
    this.context.fillRect(x, y, 1, 1);
  }

  moveStars = () => {
    this.stars.forEach((star) => {
      if (star.x === 0) {
        star.x = this.sceneWidth;
      }
      else {
        star.x -= 1;
      }
            
      this.renderStar(star.x, star.y);
    });
  }
}

const STARSHIP_TEMPLATE_COLORS = {
  1: 'white',
  2: 'blue',
  3: 'red',
  4: 'orange',
};

const STARSHIP_TEMPLATE_DEFAULT = [
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
  [0, 4, 4, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [4, 4, 4, 1, 1, 1, 2, 2, 2, 1, 1, 3],
  [0, 4, 4, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
];

class StarshipRenderer {
  constructor(ctx, template, colorsMap) {
    this.ctx = ctx;
    this.template = template;
    this.colorsMap = colorsMap;
  }

  renderStarship = (x, y, coef = 2) => {
    for (let j = 0; j < this.template.length; j++) {
      const row = this.template[j];

      for (let i = 0; i < row.length; i++) {
        const cell = row[i];

        if (cell === 0) continue;

        this.ctx.fillStyle = this.colorsMap[cell];
        this.ctx.fillRect(x + (i * coef), y + (j * coef), coef, coef);
      }
    }
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function clearScene(context) {
  context.fillStyle = '#000';
  context.fillRect(0, 0, 1000, 600);
}

function getSceneTimer(functions, context, state, int = 100) {
  let start = 0;

  function sceneTimer(timeStamp) {
    const deltaTime = timeStamp - start;

    if (deltaTime >= int) {
      start = timeStamp;
      functions.forEach((fn) => fn(context, state));
    }
    requestAnimationFrame(sceneTimer);
  }

  return sceneTimer;
}






function initGame() {
  const starsRenderer = new StarsRenderer(
    sceneContext,
    1000,
    600,
  );

  const starshipRenderer = new StarshipRenderer(
    sceneContext,
    STARSHIP_TEMPLATE_DEFAULT,
    STARSHIP_TEMPLATE_COLORS
  );
  const renderFns = [
    clearScene,
    starsRenderer.moveStars,
    (_, currentState) => starshipRenderer.renderStarship(100, 100, 3),  
  ];
  const sceneTimer = getSceneTimer(renderFns, sceneContext, state, 10);

  sceneTimer();
}

initGame();

