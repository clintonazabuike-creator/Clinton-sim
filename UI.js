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
        this.actionEl = document.getElementById('ent-action'); // Ensure this ID exists in HTML
        
        this.initListeners();
    }

    initListeners() {
        const canvas = document.getElementById('gameCanvas');
        
        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Raycasting: Find the entity at click coordinates
            const found = this.entities.find(ent => 
                Math.hypot(ent.x - x, ent.y - y) < 20
            );

            if (found) {
                this.select(found);
            } else {
                this.deselect();
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

    updateCard() {
        if (!this.selectedEntity) return;

        const ent = this.selectedEntity;
        
        // Populate High-End Identity Data
        this.nameEl.innerText = ent.identity.name;
        this.traitsEl.innerHTML = ent.identity.traits.map(t => 
            `<span class="trait-pill">${t}</span>`
        ).join('');
        
        this.historyEl.innerHTML = `
            <li><strong>Lineage:</strong> ${ent.identity.lineage}</li>
            <li><strong>Status:</strong> ${ent.currentAction}</li>
            <li><strong>Acquired:</strong> ${ent.identity.acquired.join(', ')}</li>
        `;

        // Update Stats Bars (If you have them in HTML)
        const healthBar = document.getElementById('health-fill');
        if (healthBar) healthBar.style.width = `${ent.stats.health}%`;
    }
}

