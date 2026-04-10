// Main.js
import { World } from './World.js';
import { Entity } from './Entities.js';
import { UIController } from './UI.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const world = new World(Math.ceil(canvas.width / 32), Math.ceil(canvas.height / 32), 32);
const entities = [];

// Define Kingdoms
const kingdomA = { name: "Empire of Clinton", color: "#ff3333", id: "A" };
const kingdomB = { name: "United McKennedy", color: "#3333ff", id: "B" };

// Spawn Kingdom A (Left Side)
for (let i = 0; i < 10; i++) {
    const e = new Entity(100 + Math.random() * 200, canvas.height / 2, 'human', kingdomA);
    if (i === 0) e.role = "King";
    else if (i < 4) e.role = "Soldier";
    entities.push(e);
}

// Spawn Kingdom B (Right Side)
for (let i = 0; i < 10; i++) {
    const e = new Entity(canvas.width - 300 + Math.random() * 200, canvas.height / 2, 'human', kingdomB);
    if (i === 0) e.role = "King";
    else if (i < 4) e.role = "Soldier";
    entities.push(e);
}

const ui = new UIController(entities);

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    world.render(ctx);
    
    // Filter out dead
    for (let i = entities.length - 1; i >= 0; i--) {
        if (entities[i].stats.health <= 0) entities.splice(i, 1);
    }

    entities.forEach(ent => {
        ent.update(world, entities);
        ent.draw(ctx);
    });

    if (ui.selectedEntity) ui.updateCard();
    requestAnimationFrame(gameLoop);
}

gameLoop();
