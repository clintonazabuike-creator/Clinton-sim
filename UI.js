// js/UI.js

export class UIController {
    constructor(entities) {
        this.entities = entities;
        this.selectedEntity = null;
        this.card = document.getElementById('bio-card');
        
        // UI Elements
        this.nameEl = document.getElementById('ent-name');
        this.traitsEl = document.getElementById('ent-traits');
        this.historyEl = document.getElementById('history-list');
        
        this.initListeners();
    }

    initListeners() {
        const canvas = document.getElementById('gameCanvas');
        
        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Raycasting: Scan for entities
            const found = this.entities.find(ent => 
                Math.hypot(ent.x - x, ent.y - y) < 25
            );

            if (found) {
                this.select(found);
            } else {
                this.deselect();
            }
        });

        // Divine Rewrite Logic
        document.querySelector('.god-btn').addEventListener('click', () => {
            if (this.selectedEntity) {
                this.rewriteDNA();
            }
        });
    }

    select(entity) {
        this.selectedEntity = entity;
        this.card.classList.remove('hidden');
        this.updateCard();
    }

    deselect() {
        this.selectedEntity = null;
        this.card.classList.add('hidden');
    }

    rewriteDNA() {
        const newName = prompt("Enter New Name:", this.selectedEntity.identity.name);
        const newTitle = prompt("Enter New Title:", this.selectedEntity.identity.title);
        
        if (newName) this.selectedEntity.identity.name = newName;
        if (newTitle) this.selectedEntity.identity.title = newTitle;
        
        // Instant stat restoration
        this.selectedEntity.stats.health = 100;
        this.selectedEntity.stats.hunger = 0;
        
        this.updateCard();
    }

    updateCard() {
        if (!this.selectedEntity) return;
        const ent = this.selectedEntity;
        
        this.nameEl.innerText = ent.identity.name;
        this.traitsEl.innerHTML = ent.identity.traits.map(t => 
            `<span class="trait-pill">${t}</span>`
        ).join('');
        
        this.historyEl.innerHTML = `
            <li><strong>Current Status:</strong> ${ent.currentAction}</li>
            <li><strong>Lineage:</strong> ${ent.identity.lineage}</li>
            <li><strong>Title:</strong> ${ent.identity.title}</li>
            <li><strong>Acquired:</strong> ${ent.identity.acquired.join(', ')}</li>
            <li><strong>Health:</strong> ${Math.floor(ent.stats.health)}%</li>
        `;
    }
}
