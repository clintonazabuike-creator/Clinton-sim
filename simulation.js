import { SmileBridge } from 'https://clintonazabuike-creator.github.io/Smile-bridge/smile-bridge.js';

const canvas = document.getElementById('world');
const ctx = canvas.getContext('2d');
const myIdDisplay = document.getElementById('my-id');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 1. Initialize the Bridge
const bridge = new SmileBridge('god-sim');

bridge.on('ready', (id) => {
    myIdDisplay.innerText = id;
});

// 2. Unit Logic (The "Life" of the game)
class Unit {
    constructor(dna = null) {
        this.dna = dna || {
            id: Math.random().toString(36).substr(2, 9),
            color: `hsl(${Math.random() * 360}, 80%, 60%)`,
            intelligence: Math.random(),
            history: [`Born: ${new Date().toLocaleTimeString()}`]
        };
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Migration Check: If they exit the screen, they go to the bridge
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.migrate();
        }
    }

    draw() {
        ctx.fillStyle = this.dna.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.dna.color;
        ctx.fillRect(this.x, this.y, 6, 6);
        ctx.shadowBlur = 0;
    }

    migrate() {
        if (bridge.connections.size > 0) {
            console.log("Unit entering the Bridge...");
            this.dna.history.push(`Left world at ${new Date().toLocaleTimeString()}`);
            bridge.emit('MIGRATION', this.dna);
            world.removeUnit(this);
        } else {
            // Bounce if no bridge is open
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
    }
}

// 3. World Management
const world = {
    units: [],
    init() {
        for(let i=0; i<15; i++) this.units.push(new Unit());
        this.loop();
    },
    removeUnit(unit) {
        this.units = this.units.filter(u => u.dna.id !== unit.dna.id);
    },
    loop() {
        ctx.fillStyle = 'rgba(5, 5, 5, 0.2)'; // Tail effect
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        this.units.forEach(u => {
            u.update();
            u.draw();
        });
        requestAnimationFrame(() => this.loop());
    }
};

// 4. Handle Incoming P2P Life
bridge.on('MIGRATION', (dna) => {
    console.log("Life detected from another bridge!", dna);
    const visitor = new Unit(dna);
    world.units.push(visitor);
});

// 5. Connect UI to Bridge
document.getElementById('connect-btn').onclick = () => {
    const id = document.getElementById('target-id').value;
    if (id) bridge.cross(id);
};

world.init();

