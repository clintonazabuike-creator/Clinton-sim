export class Entity {
    constructor(x, y, type, dna = {}) {
        this.id = Math.random().toString(36).substr(2, 9);
        this.x = x;
        this.y = y;
        this.type = type; // 'human', 'animal', 'hero'
        
        // High-End Identity System
        this.identity = {
            name: dna.name || this.generateName(),
            lineage: dna.lineage || "Primordial",
            traits: dna.traits || ["Resilient"],
            acquired: dna.acquired || ["Common Rags"]
        };

        // State Machine
        this.stats = { health: 100, hunger: 0, energy: 100 };
        this.action = "Wandering";
        this.target = null;
    }

    generateName() {
        const prefixes = ["Azu", "Clint", "Obi", "Mck"];
        const suffixes = ["on", "uike", "ney", "ler"];
        return prefixes[Math.floor(Math.random()*4)] + suffixes[Math.floor(Math.random()*4)];
    }

    update(world) {
        // Logic for "What they are doing"
        if (this.stats.hunger > 50) {
            this.action = "Searching for Food";
            this.seekFood(world);
        } else {
            this.action = "Exploring";
            this.moveRandomly();
        }
    }
}
