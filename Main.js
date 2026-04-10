// js/Main.js Update

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    world.render(ctx);

    entities.forEach(ent => {
        // Pass 'entities' list so they can hunt or run
        ent.update(world, entities);
        ent.draw(ctx);
    });
    
    if (ui.selectedEntity) ui.updateCard();
    requestAnimationFrame(gameLoop);
}
