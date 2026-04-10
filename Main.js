import { World } from './World.js';
import { Entity } from './Entities.js';
import { UIController } from './UI.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const world = new World(Math.ceil(canvas.width / 32), Math.ceil(canvas.height / 32), 32);
let entities = [];

for (let i = 0; i < 15; i++) entities.push(new Entity(Math.random() * canvas.width, Math.random() * canvas.height, 'human'));
for (let i = 0; i < 3; i++) entities.push(new Entity(Math.random() * canvas.width, Math.random() * canvas.height, 'animal'));

const ui = new UIController(entities);

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    world.render(ctx);

    entities = entities.filter(e => !e.dead);
    entities.forEach(ent => {
        ent.update(world, entities);
        ent.draw(ctx);
    });

    if (ui.selectedEntity) ui.updateCard();
    requestAnimationFrame(gameLoop);
}

gameLoop();
