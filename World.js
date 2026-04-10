// js/World.js

export const BIOMES = {
    WATER: { id: 0, color: '#1a73e8', speedMult: 0.4, resource: null },
    SAND:  { id: 1, color: '#f1dca7', speedMult: 0.8, resource: 'Silica' },
    GRASS: { id: 2, color: '#34a853', speedMult: 1.0, resource: 'Fiber' },
    FOREST:{ id: 3, color: '#0d5a2b', speedMult: 0.7, resource: 'Wood' },
    ROCK:  { id: 4, color: '#5f6368', speedMult: 0.6, resource: 'Stone' }
};

export class World {
    constructor(width, height, tileSize) {
        this.width = width;
        this.height = height;
        this.tileSize = tileSize;
        this.grid = [];
        this.generate();
    }

    // High-End Generation using Simple Noise Logic
    generate() {
        for (let x = 0; x < this.width; x++) {
            this.grid[x] = [];
            for (let y = 0; y < this.height; y++) {
                // Determine Biome based on "pseudo-noise"
                let val = Math.sin(x * 0.1) + Math.cos(y * 0.1);
                let biome = BIOMES.GRASS;

                if (val < -0.8) biome = BIOMES.WATER;
                else if (val < -0.4) biome = BIOMES.SAND;
                else if (val > 0.8) biome = BIOMES.ROCK;
                else if (val > 0.4) biome = BIOMES.FOREST;

                this.grid[x][y] = {
                    biome: biome,
                    elevation: val,
                    claimedBy: null // For future city/tribe mechanics
                };
            }
        }
    }

    // Efficient Rendering
    render(ctx) {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                const cell = this.grid[x][y];
                ctx.fillStyle = cell.biome.color;
                // Add slight shading based on elevation for "High-End" look
                ctx.globalAlpha = 0.8 + (cell.elevation * 0.2);
                ctx.fillRect(
                    x * this.tileSize, 
                    y * this.tileSize, 
                    this.tileSize, 
                    this.tileSize
                );
            }
        }
        ctx.globalAlpha = 1.0;
    }

    // Helper to find what biome a human is currently standing on
    getTileAt(pixelX, pixelY) {
        const x = Math.floor(pixelX / this.tileSize);
        const y = Math.floor(pixelY / this.tileSize);
        if (this.grid[x] && this.grid[x][y]) {
            return this.grid[x][y];
        }
        return null;
    }
  }
      
