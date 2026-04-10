// js/Entities.js (Partial Update - replace the update method)

update(world, allEntities) {
    const currentTile = world.getTileAt(this.x, this.y);
    const terrainMultiplier = currentTile ? currentTile.biome.speedMult : 1;

    // --- ANIMAL AI: HUNTING ---
    if (this.type === 'animal') {
        const nearestHuman = allEntities.find(e => e.type === 'human' && Math.hypot(e.x - this.x, e.y - this.y) < 150);
        
        if (nearestHuman) {
            this.currentAction = "Hunting";
            const angle = Math.atan2(nearestHuman.y - this.y, nearestHuman.x - this.x);
            this.velocity.x = Math.cos(angle) * this.speed * 1.2;
            this.velocity.y = Math.sin(angle) * this.speed * 1.2;
        } else {
            this.wander(terrainMultiplier);
        }
    } else {
        // --- HUMAN AI: SURVIVAL ---
        const nearestPredator = allEntities.find(e => e.type === 'animal' && Math.hypot(e.x - this.x, e.y - this.y) < 80);
        
        if (nearestPredator) {
            this.currentAction = "Escaping";
            const angle = Math.atan2(this.y - nearestPredator.y, this.x - nearestPredator.x);
            this.velocity.x = Math.cos(angle) * this.speed * 1.5;
            this.velocity.y = Math.sin(angle) * this.speed * 1.5;
        } else {
            this.wander(terrainMultiplier);
        }
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.stats.hunger += 0.005;
}

wander(mult) {
    if (Math.random() < 0.02) {
        this.velocity.x = (Math.random() - 0.5) * this.speed * mult;
        this.velocity.y = (Math.random() - 0.5) * this.speed * mult;
        this.currentAction = "Wandering";
    }
                }
