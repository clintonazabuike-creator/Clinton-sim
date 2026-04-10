// Entities.js

export const SUPERNATURAL_TRAITS = {
    FLYER: { id: "FLY", icon: "🕊️", color: "#81d4fa", desc: "Ignores all terrain (Water/Walls)" },
    WATER_WALKER: { id: "H2O", icon: "🌊", color: "#4fc3f7", desc: "Walks on Water at Full Speed" },
    VOID_BUILDER: { id: "VBD", icon: "🌀", color: "#ce93d8", desc: "Constructs Void Pylons instantly" },
    CHOSEN_ONE: { id: "CHOSEN", icon: "☀️", color: "#ffeb3b", desc: "Immortality & Divine Protection" },
    ETHEREAL: { id: "ETH", icon: "👻", color: "#e1bee7", desc: "Phases through solid objects/walls" }
};

export class Entity {
    constructor(x, y, type, kingdom = null) {
        this.id = Math.random().toString(36).substr(2, 5);
        this.x = x; this.y = y;
        this.type = type; // 'human' or 'giant'
        this.kingdom = kingdom; 
        this.role = "Peasant"; 
        this.dead = false;
        
        this.stats = { health: 100, hunger: 0, energy: 100, strength: 10 };
        this.identity = { name: this.genName(), acquired: [], traits: [] };
        this.velocity = { x: 0, y: 0 };
        this.speed = 1.2;

        // --- DIVINE FLAGS (The "Chosen" Superpowers) ---
        this.isChosen = false;
        this.isFlying = false;
        this.isWaterWalker = false;
        this.isVoidBuilder = false;
        this.isEthereal = false;
    }

    genName() {
        const pre = ["Butler", "McKennedy", "Clinton", "Azubuike", "Obi"];
        return pre[Math.floor(Math.random()*pre.length)] + "_" + this.id;
    }

    // --- Add Supernatural Traits ---
    bestowTrait(traitID) {
        const trait = SUPERNATURAL_TRAITS[traitID];
        if (!trait) return;
        
        // Don't add if they already have it
        if (this.identity.traits.some(t => t.id === trait.id)) return;

        this.identity.traits.push(trait);

        // ACTIVATE PHYSICS OVERRIDES
        if (traitID === 'FLYER') this.isFlying = true;
        if (traitID === 'WATER_WALKER') this.isWaterWalker = true;
        if (traitID === 'VOID_BUILDER') this.isVoidBuilder = true;
        if (traitID === 'ETHEREAL') this.isEthereal = true;
        
        if (traitID === 'CHOSEN_ONE') {
            this.isChosen = true;
            this.stats.health = 9999;
            this.stats.strength = 1000;
        }
    }

    update(world, allEntities) {
        if (this.dead) return;
        
        // 1. Check current tile
        const tile = world.getTileAt(this.x, this.y);
        
        // --- 2. DIVINE PHYSICS & TERRAIN IGNORE ---
        let finalSpeedMult = tile ? tile.biome.speedMult : 1;
        
        if (this.isFlying) {
            finalSpeedMult = 2.0; // Fly at high speed, ignore terrain
            this.currentAction = "Flying";
        } else if (this.isWaterWalker && tile && tile.biome.id === 0) {
            finalSpeedMult = 1.2; // Walk on water at full speed
            this.currentAction = "Water Walking";
        } else if (tile && tile.biome.id === 0) {
            finalSpeedMult = 0.3; // Default (Slower in water)
            this.currentAction = "Swimming";
        } else {
            this.currentAction = "Walking";
        }

        // --- 3. SUPERNATURAL BUILD ---
        if (this.isVoidBuilder && Math.random() < 0.01 && tile && tile.biome.id !== 0) {
            const placed = world.placeStructure(this.x, this.y, 'void_pylon');
            if (placed) this.identity.acquired.push("Void Shaper");
        } else if (this.role === "Peasant" && Math.random() < 0.001 && tile && tile.territory === this.kingdom) {
             world.placeStructure(this.x, this.y, 'house');
        }

        this.move(finalSpeedMult);
    }

    move(mult) {
        if (Math.random() < 0.02) {
            this.velocity = { x: (Math.random() - 0.5) * 2 * mult * this.speed, y: (Math.random() - 0.5) * 2 * mult * this.speed };
        }
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        // --- HIGH-END DRAW OVERRIDES ---
        ctx.fillStyle = this.kingdom ? this.kingdom.color : "#fff";
        if (this.isChosen) ctx.fillStyle = "gold"; // Anointed by God

        // Hover effect for FLYERS
        let yOffset = 0;
        if (this.isFlying) yOffset = -10 + Math.sin(Date.now() / 200) * 3;

        // Base Body (Scaled by Giant/Human)
        ctx.fillRect(-3, yOffset - 10, 6, 10);
        
        // Trail effect for ETHEREAL
        if (this.isEthereal) {
            ctx.globalAlpha = 0.4;
            ctx.fillStyle = "#e1bee7";
            ctx.fillRect(-6, yOffset - 12, 12, 14);
            ctx.globalAlpha = 1.0;
        }

        ctx.restore();
    }
    }
