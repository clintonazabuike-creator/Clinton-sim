// js/World.js (Add to the World class)

export class World {
    // ... existing constructor and generate methods ...

    placeStructure(x, y, type) {
        const gridX = Math.floor(x / this.tileSize);
        const gridY = Math.floor(y / this.tileSize);

        if (this.grid[gridX] && this.grid[gridX][gridY]) {
            const tile = this.grid[gridX][gridY];
            // Only build on Grass or Forest
            if (tile.biome.id === 2 || tile.biome.id === 3) {
                tile.structure = {
                    type: type, // 'hut', 'farm', 'tower'
                    health: 100,
                    owner: null
                };
                return true;
            }
        }
        return false;
    }

    render(ctx) {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                const cell = this.grid[x][y];
                ctx.fillStyle = cell.biome.color;
                ctx.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);

                // DRAW STRUCTURES IF THEY EXIST
                if (cell.structure) {
                    ctx.fillStyle = "#5d4037"; // Wood color
                    const pad = 4;
                    ctx.fillRect(
                        x * this.tileSize + pad, 
                        y * this.tileSize + pad, 
                        this.tileSize - (pad*2), 
                        this.tileSize - (pad*2)
                    );
                    ctx.font = "12px Arial";
                    ctx.fillText("🏠", x * this.tileSize + 8, y * this.tileSize + 20);
                }
            }
        }
    }
}
