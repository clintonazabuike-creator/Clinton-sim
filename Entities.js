// Entities.js - Add this to the update method
update(world, allEntities) {
    if (this.dead) return;
    const tile = world.getTileAt(this.x, this.y);
    const mult = tile ? tile.biome.speedMult : 1;

    // 1. PATHFINDING/ROAD BUILDING
    // If a human is "Chosen" or healthy, they pave roads as they walk
    if (this.isChosen && Math.random() < 0.1) {
        world.setTile(this.x, this.y, 'ROAD');
    }

    // 2. URBAN PLANNING
    if (this.stats.energy > 90 && Math.random() < 0.005) {
        this.currentAction = "Constructing";
        const gx = Math.floor(this.x / world.tileSize);
        const gy = Math.floor(this.y / world.tileSize);
        
        // Place a pixel house
        if (world.grid[gx] && !world.grid[gx][gy].structure) {
            world.grid[gx][gy].structure = { type: 'house' };
            this.identity.acquired.push("Master Builder");
            this.stats.energy -= 50;
        }
    }

    this.wander(mult);
    this.x += this.velocity.x;
    this.y += this.velocity.y;
}
