// js/Entities.js

export class Entity {
    constructor(x, y, type, dna = {}) {
        this.id = Math.random().toString(36).substr(2, 9);
        this.x = x;
        this.y = y;
        this.type = type; // 'human' or 'animal'
        
        // --- IDENTITY DATA (The "Bio-Card" Content) ---
        this.identity = {
            name: dna.name || this.generateName(),
            title: dna.title || "Wanderer",
            lineage: dna.lineage || "First Generation",
            acquired: dna.acquired || ["Basic Rags"],
            traits: dna.traits || this.generateTraits()
        };

        // --- DYNAMIC STATS ---
        this.stats = {
            health: 100,
            hunger: 0,
            energy: 100,
            age: 0
        };

        this.currentAction = "Observing";
        this.velocity = { x: 0, y: 0 };
        this.speed = 2;
    }

    generateName() {
        const names = ["Azu", "Clinton", "Mckennedy", "Obi", "Tunde", "Zara"];
        return names[Math.floor(Math.random() * names.length)] + "_" + this.id;
    }

    generateTraits() {
        const possible = ["Fast Learner", "Strong", "Skilled Hunter", "Resilient"];
        return [possible[Math.floor(Math.random() * possible.length)]];
    }

    update(world) {
        // 1. Get tile info from World Engine
        const currentTile = world.getTileAt(this.x, this.y);
        const terrainMultiplier = currentTile ? currentTile.biome.speedMult : 1;

        // 2. Simple AI: Wander with purpose
        if (Math.random() < 0.05) {
            this.velocity.x = (Math.random() - 0.5) * this.speed * terrainMultiplier;
            this.velocity.y = (Math.random() - 0.5) * this.speed * terrainMultiplier;
        }

        // 3. Apply physics
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        // 4. Update Actions based on Terrain
        if (currentTile?.biome.id === 0) this.currentAction = "Swimming";
        else if (this.velocity.x !== 0) this.currentAction = "Traveling";
        else this.currentAction = "Idling";

        // 5. Natural aging/hunger
        this.stats.hunger += 0.005;
        this.stats.age += 0.0001;
    }

    draw(ctx) {
        // High-End Rendering: Use a circle for body, different color for types
        const color = this.type === 'human' ? "#ffffff" : "#ff4444";
        
        ctx.save();
        ctx.translate(this.x, this.y);
        
        // Shadow
        ctx.fillStyle = "rgba(0,0,0,0.3)";
        ctx.beginPath();
        ctx.ellipse(0, 5, 6, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Entity Body (This will be replaced by your Pixel Art later)
        ctx.fillStyle = color;
        ctx.font = "16px serif";
        ctx.textAlign = "center";
        const sprite = this.type === 'human' ? "👤" : "🐺";
        ctx.fillText(sprite, 0, 0);

        ctx.restore();
    }
}
