// World.js
export const BIOMES = {
    WATER: { id: 0, color: '#1a73e8', speedMult: 0.4 },
    SAND:  { id: 1, color: '#f1dca7', speedMult: 0.8 },
    GRASS: { id: 2, color: '#34a853', speedMult: 1.0 },
    FOREST:{ id: 3, color: '#0d5a2b', speedMult: 0.7 },
    ROCK:  { id: 4, color: '#5f6368', speedMult: 0.6 },
    ROAD:  { id: 5, color: '#333333', speedMult: 1.6 }
};

export class World {
    constructor(width, height, tileSize) {
        this.width = width;
        this.height = height;
        this.tileSize = tileSize;
        this.grid = [];
        this.kingdoms = []; // Store Kingdom Data (Color, KingID, etc.)
        this.generate();
    }

    generate() {
        for (let x = 0; x < this.width; x++) {
            this.grid[x] = [];
            for (let y = 0; y < this.height; y++) {
                let val = Math.sin(x * 0.1) + Math.cos(y * 0.1);
                let biome = val < -0.5 ? BIOMES.WATER : BIOMES.GRASS;
                this.grid[x][y] = { biome, structure: null, territory: null };
            }
        }
    }

    render(ctx) {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                const cell = this.grid[x][y];
                ctx.fillStyle = cell.biome.color;
                ctx.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);

                // Draw Borders
                if (cell.territory) {
                    ctx.globalAlpha = 0.3;
                    ctx.fillStyle = cell.territory.color;
                    ctx.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
                    ctx.globalAlpha = 1.0;
                }

                if (cell.structure) this.drawPixelBuilding(ctx, x * this.tileSize, y * this.tileSize, cell.structure);
            }
        }
    }

    drawPixelBuilding(ctx, x, y, struct) {
        ctx.fillStyle = struct.type === 'castle' ? "#999" : "#5d4037";
        ctx.fillRect(x + 2, y + 4, 28, 24);
        ctx.fillStyle = "#222"; // Door
        ctx.fillRect(x + 12, y + 18, 8, 10);
    }
}
