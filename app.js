import {rand, randArr} from './utils/utils.js';

const grid = document.querySelector('.grid'),
  scoreDisplay = document.querySelector('#score'),
  levelDisplay = document.querySelector('#level'),
  start = document.querySelector('#start'),
  time = document.querySelector('.time');

const width = 28;
// console.log(document.styleSheets[1].cssRules.push({cssText: `a {border: 2px solid}`}));
let pacStepCSS = document.styleSheets[0].cssRules[2].cssRules[0].style;
let pacStep;

let initialInd;
let initialValue;
let pacManIndex;
let squares;

let score = 0;
let fullScore;
let level = JSON.parse(localStorage.getItem('pacLevel')) || 1;
let ghostSpeeds = {
  blinky: (level > 1 && JSON.parse(localStorage.getItem('blinkySpeed'))) || 255,
  pinky: (level > 1 && JSON.parse(localStorage.getItem('pinkySpeed'))) || 405,
  inky: (level > 1 && JSON.parse(localStorage.getItem('inkySpeed'))) || 305,
  clyde: (level > 1 && JSON.parse(localStorage.getItem('clydeSpeed'))) || 505,
};
console.log(ghostSpeeds);

let speedInc = 4;
let timer = (level > 1 && JSON.parse(localStorage.getItem('pacTimer'))) || 0;
let timeTracker;

let ghosts;

let pressed;
let moveTimer;

const styles = {
  0: 'pac-dot',
  1: 'wall',
  2: 'ghost',
  3: 'power-pellet',
  4: '',
  5: 'pacman',
};

let layout = [
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0,
  1, 1, 1, 1, 0, 1, 1, 3, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1,
  1, 0, 1, 1, 1, 1, 3, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1,
  1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1,
  1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  0, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 0, 1, 1, 4, 1, 1, 1, 2, 2, 1, 1, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 0, 1, 1, 4, 1, 2, 2, 2, 2, 2, 2, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1,
  4, 4, 4, 4, 4, 4, 0, 0, 0, 4, 1, 2, 2, 2, 2, 2, 2, 1, 4, 0, 0, 0, 4, 4, 4, 4,
  4, 4, 1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 2, 2, 2, 2, 2, 2, 1, 4, 1, 1, 0, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 0,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1,
  1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4,
  4, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0,
  1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1,
  1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 3, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 3, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0,
  1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1,
  1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0,
  0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1,
];

const createPacman = () => {
  // Assigning pacman's position randomly
  for (
    let i = rand(layout.length - 1, 0);
    i >= 0;
    i = rand(layout.length - 1, 0)
  ) {
    if (/[04]/.test(layout[i])) {
      initialInd = i;
      initialValue = layout[i];
      pacManIndex = i;
      layout[i] = 5;
      break;
    }
  }
};

const createBoard = () => {
  createPacman();

  grid.innerHTML = layout
    .map(sq => `<div class='${styles[sq]}'></div>`)
    .join('');

  squares = document.querySelectorAll('.grid div');

  squares[pacManIndex].innerHTML = `
      <img src='img/Pacman_Player.svg'>
   `;

  fullScore = document.querySelectorAll('.pac-dot').length;
};

const directions = {
  ArrowRight: () => {
    if (!squares[pacManIndex + 1].className.match(/\b(wall|ghost)\b/g)) {
      pacManIndex++;
      squares[pacManIndex].style.transform = 'scale(1, 1)';
      pacStep = `left: -15px;
            top: 0;
         `;
    } else if (pacManIndex === 391) {
      pacManIndex = 364;
    }
  },
  ArrowLeft: () => {
    if (!squares[pacManIndex - 1].className.match(/\b(wall|ghost)\b/g)) {
      pacManIndex--;
      squares[pacManIndex].style.transform = 'scale(-1, 1)';
      pacStep = `left: 15px;
            top: 0;
         `;
    } else if (pacManIndex === 364) {
      pacManIndex = 391;
    }
  },
  ArrowUp: () => {
    if (!squares[pacManIndex - width].className.match(/\b(wall|ghost)\b/g)) {
      pacManIndex -= width;
      squares[pacManIndex].style.transform = 'rotate(-90deg)';
      pacStep = `left: 0;
            top: 15px;
         `;
    }
  },
  ArrowDown: () => {
    if (!squares[pacManIndex + width].className.match(/\b(wall|ghost)\b/g)) {
      pacManIndex += width;
      squares[pacManIndex].style.transform = 'rotate(90deg)';
      pacStep = `left: 0;
            top: -15px;
         `;
    }
  },
  Control: () => console.log('Ctrl'),
  '': () => {
    return;
  },
};

const eat = () => {
  if (squares[pacManIndex].classList.contains('scared')) {
    let ghName = squares[pacManIndex].className.match(
      /\b(blinky|pinky|inky|clyde)\b/
    )[0];
    ghosts.forEach(ghost => {
      if (ghost.className === ghName) {
        squares[ghost.pos].classList.remove(ghost.className, 'scared', 'gh');
        ghost.pos = ghost.startIndex;
        squares[ghost.pos].classList.add(ghost.className, 'gh');
      }
    });
    score += 50;
  } else if (squares[pacManIndex].classList.contains('gh')) {
    let ghName = squares[pacManIndex].className.match(
      /\b(blinky|pinky|inky|clyde)\b/
    )[0];
    ghosts.forEach(ghost => {
      if (ghost.className === ghName) {
        ghost.gameOver();
      }
    });
    scoreDisplay.textContent = score;
  } else if (squares[pacManIndex].classList.contains('power-pellet')) {
    const unScare = () => ghosts.forEach(ghost => (ghost.isScared = false));
    // clearTimeout(unScare)
    ghosts.forEach(ghost => (ghost.isScared = true));
    setTimeout(unScare, 10000);
    score += 10;
    squares[pacManIndex].classList.remove('power-pellet');
  } else if (squares[pacManIndex].classList.contains('pac-dot')) {
    score++;
    squares[pacManIndex].classList.add('pac-dot-eaten');
    squares[pacManIndex].classList.remove('pac-dot');
  }

  scoreDisplay.textContent = score;
};

const oneMove = key => {
  squares[pacManIndex].classList.remove('pacman');
  squares[pacManIndex].innerHTML = '';
  directions[key]();
  pacStepCSS.cssText = pacStep;
  squares[pacManIndex].classList.add('pacman');
  squares[pacManIndex].innerHTML = `<img src='img/Pacman_Player.svg'>`;

  eat();
  levelUp();
};
const move = evt => {
  if (evt.repeat) {
    return;
  }
  if (evt.ctrlKey) {
    console.log(evt);
    moveTimer = setInterval(oneMove(evt.key), 200);
  }
  oneMove(evt.key);
};

const levelUp = () => {
  if (score >= fullScore) {
    start.textContent = 'Start';
    squares[pacManIndex].classList.remove('pacman');
    document.body.removeEventListener('keydown', move);
    layout[initialInd] = initialValue;
    createBoard();

    ghosts.forEach(ghost => {
      clearInterval(ghost.timerID);
      squares[ghost.pos].classList.remove(ghost.className, 'scared', 'gh');
      ghost.pos = ghost.startIndex;
      squares[ghost.startIndex].classList.add(ghost.className);
      ghost.speed -= speedInc + Math.floor(level / 3);
      localStorage.setItem(
        `${ghost.className}Speed`,
        JSON.stringify(ghost.speed)
      );
      ghost.isScared = false;
    });
    level++;
    localStorage.setItem('pacLevel', JSON.stringify(level));
    levelDisplay.textContent = level;
    score = 0;
    scoreDisplay.textContent = score;
    clearInterval(timeTracker);
  }
};

createBoard();
levelDisplay.textContent = level;

class Ghost {
  constructor(className, startIndex, speed) {
    this.className = className;
    this.startIndex = startIndex;
    this.speed = speed;
    this.pos = this.startIndex;
    this.isScared = false;
    this.timerID = NaN;

    squares[this.pos].classList.add(this.className);
  }

  move() {
    let steps = [
      +1,
      -1,
      +width,
      -width,
      -width + 1,
      -width - 1,
      +width + 1,
      +width - 1,
    ];
    let step = randArr(steps);
    this.timerID = setInterval(() => {
      squares[this.pos].classList.remove(this.className);
      squares[this.pos].classList.remove('gh', 'scared');
      let moved = false;

      for (let s = steps; !moved; s = steps.filter(s => s !== step)) {
        if (!squares[this.pos + step].className.match(/\b(wall|gh)\b/g)) {
          this.pos += step;
          moved = true;
        } else {
          step = randArr(steps);
        }
      }
      squares[this.pos].classList.add(this.className);
      squares[this.pos].classList.add('gh');

      if (this.isScared) {
        squares[this.pos].classList.add('scared');
      }
      if (this.isScared && squares[this.pos].classList.contains('pacman')) {
        squares[this.pos].classList.remove(this.className, 'scared', 'gh');
        this.pos = this.startIndex;
        score += 50;
        scoreDisplay.textContent = score;
        squares[this.pos].classList.add(this.className, 'gh');
      }

      if (
        squares[this.pos].classList.contains('pacman') &&
        !squares[this.pos].classList.contains('scared')
      ) {
        this.gameOver();
      }
    }, this.speed);
  }

  gameOver() {
    document.body.removeEventListener('keydown', move);
    ghosts.forEach(ghost => {
      clearInterval(ghost.timerID);
      ghost.speed = ghostSpeeds[ghost.className];
    });
    squares[this.pos].classList.remove('pacman');
    squares[this.pos].innerHTML = '';
    squares[pacManIndex].innerHTML = '';
    level = 1;
    score = 0;
    scoreDisplay.textContent = score;
    localStorage.setItem('pacLevel', JSON.stringify(level));
    layout[initialInd] = initialValue;
    createPacman();
    start.textContent = 'Restart';
    clearInterval(timeTracker);
    timer = 0;
  }
}

const createGhosts = () => {
  ghosts = [
    new Ghost('blinky', 348, ghostSpeeds.blinky - speedInc),
    new Ghost('pinky', 376, ghostSpeeds.pinky - speedInc),
    new Ghost('inky', 351, ghostSpeeds.inky - speedInc),
    new Ghost('clyde', 379, ghostSpeeds.clyde - speedInc),
  ];
};

createGhosts();

const trackTime = () => {
  timer += 1000;
  let sec = timer / 1000;
  let min = Math.floor(sec / 60);
  let hr = Math.floor(min / 60);

  time.innerHTML = `
      <div>
         <div class='${hr && 'hr'}'>${hr ? 'Hr' : ''}</div>
         <div class='${hr && 'hr'}'>${hr || ''}</div>
      </div>
      <div>
         <div class='${min && 'min'}'>${min ? 'Min' : ''}</div>
         <div class='${min && 'min'}'>${min % 60 || ''}</div>
      </div>
      <div>
         <div class='sec'>Sec</div>
         <div class='sec'>${sec % 60}</div>
      </div>
   `;
  localStorage.setItem('pacTimer', JSON.stringify(timer));
};

const startGame = () => {
  ghosts.forEach(ghost => {
    if (/Start|Restart/.test(start.textContent)) {
      for (let i = 0; i < layout.length; i++) {
        layout[i] === 0 && squares[i].classList.add('pac-dot');
        layout[i] === 3 && squares[i].classList.add('power-pellet');
      }
      squares[ghost.pos].classList.remove(ghost.className, 'scared', 'gh');
      ghost.pos = ghost.startIndex;
      squares[ghost.pos].classList.add(ghost.className);
    }
    ghost.move();
  });
  start.textContent = 'Pause';
  squares[pacManIndex].classList.add('pacman');
  squares[pacManIndex].innerHTML = `<img src='img/Pacman_Player.svg'>`;
  scoreDisplay.textContent = score;
  levelDisplay.textContent = level;
  document.body.addEventListener('keydown', move);
  timeTracker = setInterval(trackTime, 1000);
};

const pauseGame = () => {
  clearInterval(timeTracker);
  start.textContent = 'Resume';
  document.body.removeEventListener('keydown', move);
  ghosts.forEach(ghost => clearInterval(ghost.timerID));
};

start.addEventListener('click', () =>
  start.textContent === 'Pause' ? pauseGame() : startGame()
);
// document.body.addEventListener('keydown', evt => {
//    evt.key === 'Enter' &&
//       start.textContent === 'Pause' ? pauseGame(): startGame();
// });
