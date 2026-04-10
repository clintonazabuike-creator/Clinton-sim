export class UIController {
    constructor(entities) {
        this.entities = entities;
        this.selectedEntity = null;
        this.card = document.getElementById('bio-card');
        
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

            const found = this.entities.find(ent => 
                Math.hypot(ent.x - x, ent.y - y) < 30
            );

            if (found) {
                this.select(found);
            } else {
                this.deselect();
            }
        });

        const godBtn = document.querySelector('.god-btn');
        if (godBtn) {
            godBtn.addEventListener('click', () => this.rewriteDNA());
        }
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
        if (!this.selectedEntity) return;
        const newName = prompt("Divine Intervention: Rename this soul:", this.selectedEntity.identity.name);
        if (newName) {
            this.selectedEntity.identity.name = newName;
            this.selectedEntity.stats.health = 100; // God's touch heals
            this.updateCard();
        }
    }

    updateCard() {
        if (!this.selectedEntity) return;
        const ent = this.selectedEntity;
        this.nameEl.innerText = ent.identity.name;
        this.traitsEl.innerHTML = ent.identity.traits.map(t => `<span class="trait-pill">${t}</span>`).join('');
        this.historyEl.innerHTML = `
            <li><strong>Action:</strong> ${ent.currentAction}</li>
            <li><strong>Lineage:</strong> ${ent.identity.lineage}</li>
            <li><strong>Health:</strong> ${Math.floor(ent.stats.health)}%</li>
            <li><strong>Inventory:</strong> ${ent.identity.acquired.join(', ') || 'None'}</li>
        `;
    }
}
