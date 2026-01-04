const scene = document.getElementById('scene');
const sceneContext = scene.getContext('2d');
const controller = document.getElementById('controller');

scene.addEventListener('click', () => controller.focus());

const controllerState = {
  prHor: '',
  prVert: '',
}

const state = {
  posX: 100,
  posY: 100,
};

function getState() {
  switch(controllerState.prHor) {
    case 'ArrowRight':
      state.posX += 3;
      break;
    case 'ArrowLeft':
      state.posX -= 3;
      break;
  }

  switch(controllerState.prVert) {
    case 'ArrowUp':
      state.posY -= 5;
      break;
    case 'ArrowDown':
      state.posY += 5;
      break;
  }

  return state;
}

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

const ASTEROID_TEMPLATE_COLORS = {
    1: 'grey',
    2: 'green',
    3: 'red'
}

const ASTEROID_TEMPLATE_DEFAULT = [
  [0, 0, 0, 1, 1, 1, 0, 0, 0],
  [0, 1, 1, 1, 1, 2, 1, 1, 0],
  [0, 1, 1, 1, 3, 2, 2, 1, 0],
  [1, 1, 1, 1, 3, 1, 2, 2, 1],
  [1, 1, 3, 3, 3, 3, 3, 2, 1],
  [1, 1, 1, 1, 3, 1, 2, 2, 1],
  [0, 1, 1, 1, 3, 2, 2, 2, 0],
  [0, 1, 1, 1, 1, 2, 1, 1, 0],
  [0, 0, 0, 1, 1, 1, 0, 0, 0],
];

class AsteroidsRenderer {
  asteroids = [];
  constructor(context, template, colorsMap, sceneWidth, sceneHeight) {
    this.context = context;
    this.template = template;
    this.colorsMap = colorsMap;
    this.sceneWidth = sceneWidth;
    this.sceneHeight = sceneHeight - 40;

    this.generateAsteroids();
  }

  generateAsteroids = () => {
    for(let y = 0; y < this.sceneHeight; y++) {
      for(let x = this.sceneWidth; x < this.sceneWidth * 5; x++) {
        const random = getRandomInt(10000);
        if(random === 100) {
          this.asteroids.push({ x, y })
        }
      }
    }
  }

  renderAsteroid = (x, y, coef) => {
    for (let j = 0; j < this.template.length; j++) {
      const row = this.template[j];

      for (let i = 0; i < row.length; i++) {
        const cell = row[i];

        if (cell === 0) continue;

        this.context.fillStyle = this.colorsMap[cell];
        this.context.fillRect(x + (i * coef), y + (j * coef), coef, coef);
      }
    }
  }


  moveAsteroids = () => {
    this.asteroids.forEach((asteroid) => {
      if (asteroid.x === -40)
        asteroid.x = asteroid.initX;
      else
        asteroid.x -= 2;
        this.renderAsteroid(asteroid.x, asteroid.y, 2);
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

class ShotsRenderer {
  shots = [];
  constructor(context, sceneWidth) {
    this.context = context;
    this.sceneWidth = sceneWidth + 10;
  }

  addShot = (x, y) => {
    this.shots.push({ x, y });
  }

  renderShot = (x, y) => {
    this.context.fillStyle = 'yellow';
    this.context.fillRect(x, y, 5, 3);
  }

  moveShots = (onShots) => {
    this.shots.forEach((shot) => {
      if (shot.x < this.sceneWidth) {
        shot.x += 10;
        this.renderShot(shot.x, shot.y);
      }
    });
    onShots();
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function clearScene(context) {
  context.fillStyle = '#000';
  context.fillRect(0, 0, 1000, 600);
}

function getSceneTimer(functions, context, getState, int = 100) {
  let start = 0;

  function sceneTimer(timeStamp) {
    const deltaTime = timeStamp - start;

    if (deltaTime >= int) {
      const currentState = getState();
      start = timeStamp;
      functions.forEach((fn) => fn(context, currentState));
    }
    requestAnimationFrame(sceneTimer);
  }

  return sceneTimer;
}






function initGame() {
  controller.focus();

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

  const asteroidsRenderer = new AsteroidsRenderer(
    sceneContext,
    ASTEROID_TEMPLATE_DEFAULT,
    ASTEROID_TEMPLATE_COLORS,
    1000,
    600,
  );

  const shotsRenderer = new ShotsRenderer(
    sceneContext,
    1000,
  )

  const keydownActionsMap = {
    ArrowUp: () => {
      controllerState.prVert = 'ArrowUp';
    },
    ArrowDown: () => {
      controllerState.prVert = 'ArrowDown';
    },
    ArrowRight: () => {
      controllerState.prHor = 'ArrowRight';
    },
    ArrowLeft: () => {
      controllerState.prHor = 'ArrowLeft';
    },
    Space: () => {
      shotsRenderer.addShot(state.posX + 20, state.posY + 15);
    }
  };

  const keyupActionsMap = {
    ArrowUp: () => {
      controllerState.prVert = '';
    },
    ArrowDown: () => {
      controllerState.prVert = '';
    },
    ArrowRight: () => {
      controllerState.prHor = '';
    },
    ArrowLeft: () => {
      controllerState.prHor = '';
    },
  };

  function handleKeyDown(event) {
    keydownActionsMap[event.code]?.();
  }

  function handleKeyUp(event) {
    keyupActionsMap[event.code]?.();
  }

  controller.addEventListener('keydown', handleKeyDown);
  controller.addEventListener('keyup', handleKeyUp);

  const renderFns = [
    clearScene,
    starsRenderer.moveStars,
    (_, currentState) => starshipRenderer.renderStarship(currentState.posX, currentState.posY, 3),
    asteroidsRenderer.moveAsteroids,
    () => {
      shotsRenderer.moveShots(() => {
        shotsRenderer.shots.forEach((shot) => {
          const foundAstIndex = asteroidsRenderer.asteroids.findIndex((asteroid) => {
            return (shot.x >= asteroid.x && shot.x <= asteroid.x + 10) && (shot.y >= asteroid.y && shot.y <= asteroid.y + 80);
          });

          if (foundAstIndex > -1) {
            const asteroid = asteroidsRenderer.asteroids[foundAstIndex];
            asteroid.x = asteroid.initX;
            shot.y = 610;
          }
        });
      });
    }
  ];
  const sceneTimer = getSceneTimer(
    renderFns,
    sceneContext,
    getState,
    10
  );

  sceneTimer();
}

initGame();

