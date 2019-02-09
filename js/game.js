const KEY_CODE_LEFT = 37;
const KEY_CODE_RIGHT = 39;
const KEY_CODE_SPACE = 32;
const KEY_CODE_UP = 38;
const KEY_CODE_DOWN = 40;

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

const PLAYER_WIDTH = 20;
const PLAYER_HEIGHT = 90;
const PLAYER_HEALTH = 10;
const PLAYER_MAX_SPEED = 600.0;
const LASER_MAX_SPEED = 300.0;
const LASER_COOLDOWN = 0.5;
const START_BossX = GAME_WIDTH;
const START_BossY = GAME_HEIGHT /2 ;

const ENEMIES_PER_ROW = 4;
const Boss_Enemy_HEALTH = 1;
const Boss_Enemy_HORIZONTAL_PADDING = 80;
const Boss_Enemy_VERTICAL_PADDING = 70;
const Boss_Enemy_VERTICAL_SPACING = 80;
const Boss_Enemy_COOLDOWN = 1.0;

const GAME_STATE = {
    Boss_Enemyhealth: 1,
  lastTime: Date.now(),
  leftPressed: false,
  rightPressed: false,
  upPressed: false,
  downPressed: false,
  spacePressed: false,
  playerX: 0,
  playerY: 0,
  player_health: PLAYER_HEALTH,
  playerCooldown: 0,
  lasers: [],
  enemies: [],
  Boss_EnemyLasers: [],
  Boss_Enemyup: false,
  Boss_Enemydown: false,
  gameOver: false,
  Boss_EnemyX: 0,
  Boss_EnemyY: 0,
  score: 0
};

function rectsIntersect(r1, r2) {
  return !(
    r2.left > r1.right ||
    r2.right < r1.left ||
    r2.top > r1.bottom ||
    r2.bottom < r1.top
  );
}

function setPosition(el, x, y) {
  el.style.transform = `translate(${x}px, ${y}px)`;
}

function clamp(v, min, max) {
  if (v < min) {
    return min;
  } else if (v > max) {
    return max;
  } else {
    return v;
  }
}

function rand(min, max) {
  if (min === undefined) min = 0;
  if (max === undefined) max = 1;
  return min + Math.random() * (max - min);
}

function createPlayer($container) {
  GAME_STATE.playerX = 0;
  GAME_STATE.playerY = GAME_HEIGHT / 2;
  const $player = document.createElement("img");
  $player.src = "img/player1.gif";
  $player.className = "player";
  $container.appendChild($player);
  setPosition($player, GAME_STATE.playerX, GAME_STATE.playerY);
}

function destroyPlayer($container, player) {
  $container.removeChild(player);
  GAME_STATE.gameOver = true;
  const audio = new Audio("sound/sfx-lose.ogg");
  audio.play();
}

function updatePlayer(dt, $container) {
  if (GAME_STATE.leftPressed) {
    GAME_STATE.playerX -= dt * PLAYER_MAX_SPEED;
  }
  if (GAME_STATE.rightPressed) {
    GAME_STATE.playerX += dt * PLAYER_MAX_SPEED;
  }
  if (GAME_STATE.upPressed) {
    GAME_STATE.playerY -= dt * PLAYER_MAX_SPEED;
  }
  if (GAME_STATE.downPressed) {
    GAME_STATE.playerY += dt * PLAYER_MAX_SPEED;
  }

  GAME_STATE.playerX = clamp(
    GAME_STATE.playerX,
    PLAYER_WIDTH,
    GAME_WIDTH - PLAYER_WIDTH - 200
  );
  GAME_STATE.playerY = clamp(
    GAME_STATE.playerY,
    PLAYER_HEIGHT - 60,
    GAME_HEIGHT - PLAYER_HEIGHT
  );

  if (GAME_STATE.spacePressed && GAME_STATE.playerCooldown <= 0) {
    createLaser($container, GAME_STATE.playerX, GAME_STATE.playerY);
    GAME_STATE.playerCooldown = LASER_COOLDOWN;
  }
  if (GAME_STATE.playerCooldown > 0) {
    GAME_STATE.playerCooldown -= dt;
  }

  const player = document.querySelector(".player");
  setPosition(player, GAME_STATE.playerX, GAME_STATE.playerY);
}

function createLaser($container, x, y) {
  const $element = document.createElement("img");
  $element.src = "img/bullet.gif";
  $element.className = "laser";
  $container.appendChild($element);
  const laser = { x, y, $element };
  GAME_STATE.lasers.push(laser);
  const audio = new Audio("sound/sfx-laser1.ogg");
  audio.play();
  setPosition($element, x, y);
  GAME_STATE.Boss_Enemyup = Math.random() < 0.5 ? true : false;
}

function updateLasers(dt, $container) {
  const lasers = GAME_STATE.lasers;
  for (let i = 0; i < lasers.length; i++) {
    const laser = lasers[i];
    laser.x += dt * LASER_MAX_SPEED;
    if (laser.x > GAME_WIDTH) {
      destroyLaser($container, laser);
    }
    setPosition(laser.$element, laser.x, laser.y);
    const r1 = laser.$element.getBoundingClientRect();
    const enemies = GAME_STATE.enemies;
    for (let j = 0; j < enemies.length; j++) {
      const Boss_Enemy = enemies[j];
      if (Boss_Enemy.isDead) continue;
      const r2 = Boss_Enemy.$element.getBoundingClientRect();
      if (rectsIntersect(r1, r2)) {
        // Boss_Enemy was hit
        Boss_Enemy.health -= 1;
        document.querySelector("#E_health").style.width = `${Boss_Enemy.health/ GAME_STATE.Boss_Enemyhealth * 100}%`;
        if (Boss_Enemy.health <= 0){
        destroyBoss_Enemy($container, Boss_Enemy);
        GAME_STATE.score += 10 * GAME_STATE.Boss_Enemyhealth;
        document.getElementById("score_f").innerHTML = `Score : ${GAME_STATE.score}`;
        }
        destroyLaser($container, laser);
        break;
      }
    }
  }
  GAME_STATE.lasers = GAME_STATE.lasers.filter(e => !e.isDead);
}

function destroyLaser($container, laser) {
  $container.removeChild(laser.$element);
  laser.isDead = true;
}

function createBoss_Enemy($container) {
    const x = START_BossX;
    const y = START_BossY;
    document.querySelector("#E_health").style.width = `100%`;
  const $element = document.createElement("img");
  $element.src = "img/Enemy-blue-1.png";
  $element.className = "Boss_Enemy";
  $container.appendChild($element);
  const Boss_Enemy = {
    health: GAME_STATE.Boss_Enemyhealth,
    x,
    y,
    cooldown: rand(0.5, Boss_Enemy_COOLDOWN),
    $element
  };
  GAME_STATE.enemies.push(Boss_Enemy);
  setPosition($element, x, y);
}

setInterval(function(){
    GAME_STATE.Boss_Enemyup = Math.random() < 0.5 ? true : false;
}, 500)
function updateEnemies(dt, $container) {
//   const dx = Math.sin(GAME_STATE.lastTime / 1000.0) * 50;
//   const dy = Math.cos(GAME_STATE.lastTime / 1000.0) * 10;
        const dx = Math.sin(GAME_STATE.lastTime / 1000.0) * 50;
        GAME_STATE.Boss_EnemyY += (GAME_STATE.Boss_Enemyup == true? 1: -1) * 1;

  const enemies = GAME_STATE.enemies;
  for (let i = 0; i < enemies.length; i++) {
    const Boss_Enemy = enemies[i];
    var x = Boss_Enemy.x + GAME_STATE.Boss_EnemyX + dx;
    var y = Boss_Enemy.y + GAME_STATE.Boss_EnemyY;
    x = clamp(x, 0, GAME_WIDTH-40);
    y = clamp(y, 70, GAME_HEIGHT-65);
    setPosition(Boss_Enemy.$element, x, y);
    Boss_Enemy.cooldown -= dt;
    if (Boss_Enemy.cooldown <= 0) {
      createBoss_EnemyLaser($container, x, y);
      Boss_Enemy.cooldown = Boss_Enemy_COOLDOWN;
    }
  }
  GAME_STATE.enemies = GAME_STATE.enemies.filter(e => !e.isDead);
}

function destroyBoss_Enemy($container, Boss_Enemy) {
  $container.removeChild(Boss_Enemy.$element);
  GAME_STATE.Boss_EnemyX = 0;
  GAME_STATE.Boss_EnemyY = 0;
  Boss_Enemy.isDead = true;
  console.log(GAME_STATE.Boss_Enemyhealth);
  GAME_STATE.Boss_Enemyhealth *= 2;
  createBoss_Enemy($container);
}

function createBoss_EnemyLaser($container, x, y) {
  const $element = document.createElement("img");
  $element.src = "img/e_bullet.gif";
  $element.className = "Boss_Enemy-laser";
  $container.appendChild($element);
  const laser = { x, y, $element };
  GAME_STATE.Boss_EnemyLasers.push(laser);
  setPosition($element, x, y);
}

function updateBoss_EnemyLasers(dt, $container) {
  const lasers = GAME_STATE.Boss_EnemyLasers;
  for (let i = 0; i < lasers.length; i++) {
    const laser = lasers[i];
    laser.x -= dt * LASER_MAX_SPEED;
    if (laser.x < 0) {
      destroyLaser($container, laser);
    }
    setPosition(laser.$element, laser.x, laser.y);
    const r1 = laser.$element.getBoundingClientRect();
    const player = document.querySelector(".player");
    const r2 = player.getBoundingClientRect();
    if (rectsIntersect(r1, r2)) {
      // Player was hit
    GAME_STATE.player_health -= 1;
    document.querySelector("#P_health").style.width = `${GAME_STATE.player_health*10}%`;
    destroyBoss_Enemylaser($container, laser);
      if (GAME_STATE.player_health <= 0){
        destroyPlayer($container, player);
      }
      break;
    }
  }
  GAME_STATE.Boss_EnemyLasers = GAME_STATE.Boss_EnemyLasers.filter(e => !e.isDead);
}
function destroyBoss_Enemylaser($container, laser) {
    $container.removeChild(laser.$element);
    laser.isDead = true;
  }



function init() {
  const $container = document.querySelector(".game");
  createPlayer($container);
  createBoss_Enemy($container);
//   const Boss_EnemySpacing =(GAME_WIDTH - Boss_Enemy_HORIZONTAL_PADDING * 2) / (ENEMIES_PER_ROW - 1);
//   for (let j = 0; j < 3; j++) {
//     const y = Boss_Enemy_VERTICAL_PADDING + j * Boss_Enemy_VERTICAL_SPACING;
//     for (let i = 0; i < ENEMIES_PER_ROW; i++) {
//       const x = i * Boss_EnemySpacing + Boss_Enemy_HORIZONTAL_PADDING;
//       createBoss_Enemy($container, x, y);
//     }
//   }
}

function playerHasWon() {
  return 0;
// return GAME_STATE.enemies.length === 0;
}

function update(e) {
  const currentTime = Date.now();
  const dt = (currentTime - GAME_STATE.lastTime) / 1000.0;

  if (GAME_STATE.gameOver) {
    document.querySelector(".game-over").style.display = "block";
    return;
  }

  if (playerHasWon()) {
    document.querySelector(".congratulations").style.display = "block";
    return;
  }

  const $container = document.querySelector(".game");
  updatePlayer(dt, $container);
  updateLasers(dt, $container);
  updateEnemies(dt, $container);
  updateBoss_EnemyLasers(dt, $container);

  GAME_STATE.lastTime = currentTime;
  window.requestAnimationFrame(update);
}

function onKeyDown(e) {
  if (e.keyCode === KEY_CODE_LEFT) {
    GAME_STATE.leftPressed = true;
  } else if (e.keyCode === KEY_CODE_RIGHT) {
    GAME_STATE.rightPressed = true;
  } else if (e.keyCode === KEY_CODE_SPACE) {
    GAME_STATE.spacePressed = true;
  } else if (e.keyCode === KEY_CODE_UP) {
    GAME_STATE.upPressed = true;
  } else if (e.keyCode === KEY_CODE_DOWN) {
    GAME_STATE.downPressed = true;
  }
}

function onKeyUp(e) {
  if (e.keyCode === KEY_CODE_LEFT) {
    GAME_STATE.leftPressed = false;
  } else if (e.keyCode === KEY_CODE_RIGHT) {
    GAME_STATE.rightPressed = false;
  } else if (e.keyCode === KEY_CODE_SPACE) {
    GAME_STATE.spacePressed = false;
  } else if (e.keyCode === KEY_CODE_UP) {
    GAME_STATE.upPressed = false;
  } else if (e.keyCode === KEY_CODE_DOWN) {
    GAME_STATE.downPressed = false;
  }
}

init();
window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);
window.requestAnimationFrame(update);