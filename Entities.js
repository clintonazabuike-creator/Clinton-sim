export class Entity {
    constructor(x, y, type, dna = {}) {
        this.id = Math.random().toString(36).substr(2, 5);
        this.x = x; this.y = y; this.type = type;
        this.dead = false;
        this.identity = {
            name: dna.name || (type === 'human' ? "Clinton_"+this.id : "Wolf_"+this.id),
            lineage: dna.lineage || "Primordial",
            traits: dna.traits || ["Resilient"],
            acquired: dna.acquired || []
        };
        this.stats = { health: 100, hunger: 0, energy: 100 };
        this.currentAction = "Wandering";
        this.velocity = { x: 0, y: 0 };
    }

    update(world, allEntities) {
        if (this.dead) return;
        const tile = world.getTileAt(this.x, this.y);
        const mult = tile ? tile.biome.speedMult : 1;

        if (this.type === 'animal') {
            const prey = allEntities.find(e => e.type === 'human' && Math.hypot(e.x - this.x, e.y - this.y) < 100);
            if (prey) {
                const angle = Math.atan2(prey.y - this.y, prey.x - this.x);
                this.velocity = { x: Math.cos(angle) * 1.5 * mult, y: Math.sin(angle) * 1.5 * mult };
                this.currentAction = "Hunting";
                if (Math.hypot(prey.x - this.x, prey.y - this.y) < 10) prey.stats.health -= 1;
            } else { this.wander(mult); }
        } else {
            if (this.stats.health < 100 && Math.random() < 0.001) {
                this.currentAction = "Building";
                if (world.placeStructure(this.x, this.y, 'hut')) this.identity.acquired.push("Home");
            } else { this.wander(mult); }
        }

        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.stats.hunger += 0.01;
        if (this.stats.hunger > 100) this.stats.health -= 0.2;
        if (this.stats.health <= 0) this.dead = true;
    }

    wander(mult) {
        if (Math.random() < 0.02) {
            this.velocity = { x: (Math.random() - 0.5) * 2 * mult, y: (Math.random() - 0.5) * 2 * mult };
            this.currentAction = "Wandering";
        }
    }

    draw(ctx) {
        ctx.font = "20px Arial";
        ctx.fillText(this.type === 'human' ? "👤" : "🐺", this.x, this.y);
    }
}
