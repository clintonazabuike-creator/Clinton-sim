// Entities.js
export class Entity {
    constructor(x, y, type, kingdom = null) {
        this.id = Math.random().toString(36).substr(2, 5);
        this.x = x; this.y = y;
        this.type = type; // 'human' or 'giant'
        this.kingdom = kingdom; 
        this.role = "Peasant"; // Roles: Peasant, Soldier, King
        this.dead = false;
        
        this.stats = { health: 100, hunger: 0, energy: 100, strength: 10 };
        this.identity = { name: this.genName(), acquired: [], traits: [] };
        this.velocity = { x: 0, y: 0 };
    }

    genName() {
        const names = ["Butler", "McKennedy", "Clinton", "Azubuike", "Obi"];
        return names[Math.floor(Math.random()*names.length)] + "_" + this.id;
    }

    update(world, allEntities) {
        if (this.dead) return;
        const tile = world.getTileAt(this.x, this.y);
        
        // --- 1. TERRITORY EXPANSION ---
        if (this.kingdom && tile && !tile.territory) {
            tile.territory = this.kingdom;
        }

        // --- 2. MILITARY LOGIC ---
        if (this.role === "Soldier") {
            const enemy = allEntities.find(e => e.kingdom && e.kingdom !== this.kingdom && Math.hypot(e.x - this.x, e.y - this.y) < 100);
            if (enemy) {
                this.attack(enemy);
                return;
            }
        }

        // --- 3. BUILDING LOGIC ---
        if (this.role === "Peasant" && Math.random() < 0.001 && tile && tile.territory === this.kingdom) {
            world.grid[Math.floor(this.x/32)][Math.floor(this.y/32)].structure = { type: 'house' };
        }

        this.move(tile ? tile.biome.speedMult : 1);
    }

    attack(target) {
        const angle = Math.atan2(target.y - this.y, target.x - this.x);
        this.velocity = { x: Math.cos(angle) * 1.5, y: Math.sin(angle) * 1.5 };
        if (Math.hypot(target.x - this.x, target.y - this.y) < 10) {
            target.stats.health -= 2;
        }
    }

    move(mult) {
        if (Math.random() < 0.02) {
            this.velocity = { x: (Math.random() - 0.5) * 2 * mult, y: (Math.random() - 0.5) * 2 * mult };
        }
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        // Color by Kingdom
        ctx.fillStyle = this.kingdom ? this.kingdom.color : "#fff";
        
        // Draw Pixel Man (different for roles)
        if (this.role === "King") {
            ctx.fillStyle = "gold";
            ctx.fillRect(-4, -15, 8, 4); // Crown
        }
        
        ctx.fillStyle = this.kingdom ? this.kingdom.color : "#fff";
        ctx.fillRect(-3, -10, 6, 10); // Body
        
        if (this.role === "Soldier") {
            ctx.fillStyle = "#ccc"; // Sword
            ctx.fillRect(4, -6, 2, 8);
        }

        ctx.restore();
    }
}
