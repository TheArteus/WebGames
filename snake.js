const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const restartButton = document.getElementById("restartButton");

const gridSize = 40;
const tileSize = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = getRandomPosition();
let blueFood = null;
let score = 0;
let gameOver = false;
let redWall = null;
let redWallTimeout = null;

// Funkcja do resetowania gry
function resetGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    food = getRandomPosition();
    blueFood = null;
    score = 0;
    gameOver = false;
    redWall = null;
    if (redWallTimeout) clearTimeout(redWallTimeout);
    restartButton.style.display = "none"; // Ukryj przycisk po restarcie
    scoreElement.textContent = `Wynik: ${score}`;
    gameLoop(); // Uruchom grę ponownie
}

// Funkcja do losowania pozycji
function getRandomPosition() {
    return {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize)
    };
}

// Funkcja do rysowania węża
function drawSnake() {
    ctx.fillStyle = "yellow";
    snake.forEach(segment => {
        ctx.fillRect(segment.x * tileSize, segment.y * tileSize, tileSize, tileSize);
    });
}

// Funkcja do rysowania jedzenia
function drawFood() {
    ctx.fillStyle = "green";
    ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);

    if (blueFood) {
        ctx.fillStyle = "blue";
        ctx.fillRect(blueFood.x * tileSize, blueFood.y * tileSize, tileSize, tileSize);
    }
}

// Funkcja do rysowania czerwonych ścian
function drawRedWall() {
    if (redWall) {
        ctx.fillStyle = "red";
        if (redWall.side === "top") {
            ctx.fillRect(0, 0, canvas.width, tileSize);
        } else if (redWall.side === "bottom") {
            ctx.fillRect(0, canvas.height - tileSize, canvas.width, tileSize);
        } else if (redWall.side === "left") {
            ctx.fillRect(0, 0, tileSize, canvas.height);
        } else if (redWall.side === "right") {
            ctx.fillRect(canvas.width - tileSize, 0, tileSize, canvas.height);
        }
    }
}

// Funkcja do aktualizacji gry
function update() {
    if (gameOver) return;

    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    if (redWall) {
        if (
            (redWall.side === "top" && head.y < 0) ||
            (redWall.side === "bottom" && head.y >= gridSize) ||
            (redWall.side === "left" && head.x < 0) ||
            (redWall.side === "right" && head.x >= gridSize)
        ) {
            gameOver = true;
            restartButton.style.display = "block"; // Pokaż przycisk "Restart"
            return;
        }
    }

    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
        direction.x *= -1;
        direction.y *= -1;
        head.x = snake[0].x + direction.x;
        head.y = snake[0].y + direction.y;
    }

    if (head.x === food.x && head.y === food.y) {
        score++;
        snake.unshift({ x: head.x, y: head.y });
        food = getRandomPosition();
    } else if (blueFood && head.x === blueFood.x && head.y === blueFood.y) {
        score = Math.max(0, score - 1);
        if (snake.length > 1) snake.pop();
        blueFood = null;
    } else {
        snake.pop();
        snake.unshift(head);
    }

    if (!blueFood && Math.random() < 0.01) {
        blueFood = getRandomPosition();
        setTimeout(() => {
            blueFood = null;
        }, 10000);
    }

    if (!redWall && Math.random() < 0.01) {
        const sides = ["top", "bottom", "left", "right"];
        redWall = { side: sides[Math.floor(Math.random() * sides.length)] };
        redWallTimeout = setTimeout(() => {
            redWall = null;
        }, 10000);
    }

    scoreElement.textContent = `Wynik: ${score}`;
}

// Funkcja do rysowania gry
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
    drawRedWall();
}

// Główna pętla gry
function gameLoop() {
    if (gameOver) return; // Zatrzymaj grę, jeśli jest koniec
    update();
    draw();
    setTimeout(gameLoop, 200);
}

// Obsługa przycisku "Restart"
restartButton.addEventListener("click", resetGame);

// Sterowanie
document.addEventListener("keydown", (e) => {
    if (e.key.startsWith("Arrow")) {
        const newDirection = { x: 0, y: 0 };
        if (e.key === "ArrowUp" && direction.y === 0) newDirection.y = -1;
        if (e.key === "ArrowDown" && direction.y === 0) newDirection.y = 1;
        if (e.key === "ArrowLeft" && direction.x === 0) newDirection.x = -1;
        if (e.key === "ArrowRight" && direction.x === 0) newDirection.x = 1;
        direction = newDirection;
    }
});

// Start gry
gameLoop();