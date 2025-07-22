const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

let score = 0;
let snake = [{ x: 200, y: 200 }];
let food = { x: 0, y: 0 };
let direction = 'RIGHT';
let gameInterval;

// Initialize game
function init() {
  spawnFood();
  document.addEventListener('keydown', changeDirection);
  gameInterval = setInterval(gameLoop, 100);
}

// Main game loop
function gameLoop() {
  moveSnake();
  if (checkCollision()) {
    clearInterval(gameInterval);
    alert('Game Over! Score: ' + score);
    return;
  }
  drawGame();
}

// Draw everything
function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw snake
  ctx.fillStyle = 'lime';
  snake.forEach(segment => {
    ctx.fillRect(segment.x, segment.y, 20, 20);
  });

  // Draw food
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x, food.y, 20, 20);
}

// Move the snake
function moveSnake() {
  const head = { ...snake[0] };

  switch (direction) {
    case 'UP': head.y -= 20; break;
    case 'DOWN': head.y += 20; break;
    case 'LEFT': head.x -= 20; break;
    case 'RIGHT': head.x += 20; break;
  }

  snake.unshift(head);
  
  // Check if snake ate food
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreElement.textContent = `Score: ${score}`;
    spawnFood();
  } else {
    snake.pop(); // Remove tail if no food eaten
  }
}

// Spawn random food
function spawnFood() {
  food = {
    x: Math.floor(Math.random() * 20) * 20,
    y: Math.floor(Math.random() * 20) * 20
  };
}

// Change direction with arrow keys
function changeDirection(e) {
  const key = e.key;
  if (key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
  if (key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
  if (key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
  if (key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
}

// Check for collisions
function checkCollision() {
  const head = snake[0];
  return (
    head.x < 0 || head.x >= canvas.width ||
    head.y < 0 || head.y >= canvas.height ||
    snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
  );
}

init(); // Start the game