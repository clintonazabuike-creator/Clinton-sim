// World.js

export class World {
    // ... Constructor and Generate ...

    placeStructure(x, y, type) {
        const gx = Math.floor(x / this.tileSize);
        const gy = Math.floor(y / this.tileSize);
        if (this.grid[gx] && this.grid[gx][gy] && !this.grid[gx][gy].structure) {
            this.grid[gx][gy].structure = { type };
            return true;
        }
        return false;
    }

    render(ctx) {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                const cell = this.grid[x][y];
                ctx.fillStyle = cell.biome.color;
                ctx.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
                if (cell.structure) this.drawPixelBuilding(ctx, x * this.tileSize, y * this.tileSize, cell.structure);
            }
        }
    }

    drawPixelBuilding(ctx, x, y, struct) {
        if (struct.type === 'void_pylon') {
            // High-End Void Pylon Drawing
            const time = Date.now() / 1000;
            const hue = (time * 50) % 360;
            ctx.fillStyle = `hsl(${hue}, 100%, 50%)`; // Cycling Colors
            ctx.fillRect(x + 10, y + 2, 12, 28);
            ctx.fillStyle = `hsl(${hue + 180}, 100%, 70%)`;
            ctx.fillRect(x + 14, y + 8, 4, 16);
        } else {
             // Standard Building
            ctx.fillStyle = "#5d4037";
            ctx.fillRect(x + 2, y + 4, 28, 24);
        }
    }
}
