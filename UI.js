// UI.js

import { SUPERNATURAL_TRAITS } from './Entities.js';

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
        // ... Click Listeners ...

        const godBtn = document.querySelector('.god-btn');
        if (godBtn) {
            godBtn.addEventListener('click', () => this.showDivinePalette());
        }
    }

    // New Method: Shows the options to Bestow Supernatural Traits
    showDivinePalette() {
        if (!this.selectedEntity) return;
        
        let message = "BESTOW DIVINE TRAIT:\n";
        // Convert the Registry to a readable list
        Object.entries(SUPERNATURAL_TRAITS).forEach(([key, trait], index) => {
            message += `${index + 1}. ${trait.icon} ${key}: ${trait.desc}\n`;
        });
        message += "\nEnter the NUMBER of the trait (or 'None' to cancel):";

        const choice = prompt(message);
        const index = parseInt(choice) - 1;
        const traitKeys = Object.keys(SUPERNATURAL_TRAITS);

        if (!isNaN(index) && traitKeys[index]) {
            const selectedKey = traitKeys[index];
            this.selectedEntity.bestowTrait(selectedKey);
            this.updateCard();
        }
    }

    // ... Select and Deselect Methods ...

    updateCard() {
        if (!this.selectedEntity) return;
        const ent = this.selectedEntity;
        
        this.nameEl.innerText = ent.identity.name;
        
        // Generate the Pilling UI for the Traits (Supernatural or Normal)
        this.traitsEl.innerHTML = ent.identity.traits.map(t => 
            `<span class="trait-pill" style="background:${t.color || '#d4af37'}">${t.icon || ''} ${t.id}</span>`
        ).join('');
        
        this.historyEl.innerHTML = `
            <li><strong>Action:</strong> ${ent.currentAction}</li>
            <li><strong>Lineage:</strong> ${ent.identity.lineage}</li>
            <li><strong>Health:</strong> ${ent.isChosen ? 'IMMORTAL' : Math.floor(ent.stats.health) + '%'}</li>
            <li><strong>Traits:</strong> ${ent.identity.traits.length}</li>
        `;
    }
}
