// js/Main.js
import { World } from './World.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// High-End Config
const TILE_SIZE = 32;
const WORLD_WIDTH = Math.ceil(window.innerWidth / TILE_SIZE);
const WORLD_HEIGHT = Math.ceil(window.innerHeight / TILE_SIZE);

const world = new World(WORLD_WIDTH, WORLD_HEIGHT, TILE_SIZE);

function gameLoop() {
    // 1. Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 2. Draw World
    world.render(ctx);

    // 3. Draw UI/Entities (We will add these next)
    
    requestAnimationFrame(gameLoop);
}

// Handle Resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Optional: Regenerate or re-center world here
});

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
gameLoop();
