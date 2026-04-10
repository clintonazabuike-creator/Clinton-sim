// js/Main.js
import { World } from './World.js';
import { Entity } from './Entities.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const world = new World(Math.ceil(canvas.width / 32), Math.ceil(canvas.height / 32), 32);
const entities = [];

// Spawn initial population
for (let i = 0; i < 10; i++) {
    entities.push(new Entity(Math.random() * canvas.width, Math.random() * canvas.height, 'human'));
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Render World
    world.render(ctx);

    // 2. Update and Render Entities
    entities.forEach(ent => {
        ent.update(world);
        ent.draw(ctx);
    });

    requestAnimationFrame(gameLoop);
}

gameLoop();
