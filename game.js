// ===== ASSETS CONFIGURATION =====
const Assets = {
    characters: {
        gangster: 'assets/characters/gangster.png',
        detective: 'assets/characters/detective.png',
        civilian: 'assets/characters/civilian.png'
    },
    buildings: {
        hotel: 'assets/buildings/hotel.png',
        shop: 'assets/buildings/shop.png',
        hospital: 'assets/buildings/hospital.png',
        arena: 'assets/buildings/arena.png',
        transit: null // Will fallback to emoji if not available
    },
    tiles: {
        grass: 'assets/tiles/grass-tile.png',
        road: 'assets/tiles/road-tile.png',
        sidewalk: 'assets/tiles/sidewalk.png'
    }
};

// Helper function to create image elements
function createImage(src, alt = '', className = '') {
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    if (className) img.className = className;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'contain';
    img.style.imageRendering = 'pixelated';
    img.style.imageRendering = 'crisp-edges';
    return img;
}

// Helper function to create sprite (image or emoji fallback)
function createSprite(type, assetPath, fallbackEmoji) {
    if (assetPath) {
        return createImage(assetPath, type);
    } else {
        const span = document.createElement('span');
        span.textContent = fallbackEmoji;
        span.style.fontSize = '1.8em';
        return span;
    }
}

// ===== GAME STATE =====
const gameState = {
    player: {
        role: null,
        crown: 1000,
        health: 100,
        maxHealth: 100,
        energy: 100,
        maxEnergy: 50,
        xp: 0,
        maxXp: 100,
        influence: 0,
        position: { x: 8, y: 6 },
        inventory: [
            { id: 'pistol', icon: '🔫', name: 'Pistol' },
            { id: 'medkit', icon: '💊', name: 'Med Kit' }
        ]
    },
    district: {
        name: 'Downtown',
        crime: 45,
        prosperity: 60
    },
    map: {
        width: 16,
        height: 12,
        tiles: []
    },
    buildings: [
        { type: 'hotel', icon: '🏨', x: 2, y: 2, name: 'Grand Hotel' },
        { type: 'shop', icon: '🏪', x: 13, y: 2, name: 'Black Market' },
        { type: 'hospital', icon: '🏥', x: 2, y: 9, name: 'City Hospital' },
        { type: 'arena', icon: '🏟️', x: 13, y: 9, name: 'Combat Arena' },
        { type: 'transit', icon: '🚉', x: 8, y: 11, name: 'Transit Station' }
    ],
    leaderboard: [
        { name: 'Boss_King', score: 2500, rank: 1 },
        { name: 'Shadow_82', score: 2200, rank: 2 },
        { name: 'Night_Fox', score: 1900, rank: 3 },
        { name: 'Street_Cat', score: 1650, rank: 4 }
    ]
};

// Role configurations
const roleConfig = {
    gangster: {
        icon: '🔫',
        badge: '🔫 Gangster',
        actions: [
            { id: 'extort', name: 'Extort', energyCost: 10 },
            { id: 'smuggle', name: 'Smuggle', energyCost: 15 },
            { id: 'bribe', name: 'Bribe', energyCost: 8 }
        ]
    },
    detective: {
        icon: '👮',
        badge: '👮 Detective',
        actions: [
            { id: 'patrol', name: 'Patrol', energyCost: 8 },
            { id: 'confiscate', name: 'Confiscate', energyCost: 12 },
            { id: 'report', name: 'Report', energyCost: 10 }
        ]
    },
    civilian: {
        icon: '👔',
        badge: '👔 Civilian',
        actions: [
            { id: 'trade', name: 'Trade', energyCost: 5 },
            { id: 'invest', name: 'Invest', energyCost: 20 },
            { id: 'adapt', name: 'Adapt', energyCost: 7 }
        ]
    }
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initRoleSelection();
    initMap();
    initControls();
    startGameLoop();
});

// ===== ROLE SELECTION =====
function initRoleSelection() {
    const roleCards = document.querySelectorAll('.role-card');
    roleCards.forEach(card => {
        card.addEventListener('click', () => {
            const role = card.dataset.role;
            selectRole(role);
        });
    });
}

function selectRole(role) {
    gameState.player.role = role;
    const config = roleConfig[role];
    
    // Update UI
    const roleBadge = document.getElementById('roleBadge');
    roleBadge.textContent = config.badge;
    roleBadge.className = `role-badge ${role}`;
    
    // Setup action buttons
    const actionButtons = document.querySelectorAll('.action-btn');
    config.actions.forEach((action, i) => {
        if (actionButtons[i]) {
            actionButtons[i].textContent = action.name;
            actionButtons[i].onclick = () => performAction(action);
        }
    });
    
    // Hide role selection, show game
    document.getElementById('roleSelection').classList.remove('active');
    
    // Reinitialize map to show player with correct sprite
    initMap();
    
    addEventLog(`Welcome, ${config.badge}! Your journey begins in ${gameState.district.name}.`, 'success');
}

// ===== MAP INITIALIZATION =====
function initMap() {
    const mapElement = document.getElementById('gameMap');
    mapElement.innerHTML = '';
    
    // Create tiles
    for (let y = 0; y < gameState.map.height; y++) {
        for (let x = 0; x < gameState.map.width; x++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.dataset.x = x;
            tile.dataset.y = y;
            
            // Check if this is a building location
            const building = gameState.buildings.find(b => b.x === x && b.y === y);
            if (building) {
                tile.className += ' building';
                // Use image asset if available, otherwise fallback to emoji
                const buildingSprite = createSprite(building.type, Assets.buildings[building.type], building.icon);
                tile.appendChild(buildingSprite);
                tile.title = building.name;
                tile.onclick = () => interactWithBuilding(building);
            }
            
            // Check if this is player position
            if (x === gameState.player.position.x && y === gameState.player.position.y) {
                const playerEl = document.createElement('div');
                playerEl.className = 'player';
                playerEl.id = 'player';
                // Use character image if role is selected and asset exists
                if (gameState.player.role && Assets.characters[gameState.player.role]) {
                    const playerSprite = createImage(Assets.characters[gameState.player.role], gameState.player.role);
                    playerEl.appendChild(playerSprite);
                } else {
                    playerEl.innerHTML = roleConfig[gameState.player.role]?.icon || '👤';
                }
                tile.appendChild(playerEl);
            }
            
            mapElement.appendChild(tile);
        }
    }
}

// ===== CONTROLS =====
function initControls() {
    document.addEventListener('keydown', (e) => {
        if (document.getElementById('buildingModal').classList.contains('active')) {
            return; // Don't move if modal is open
        }
        
        let newX = gameState.player.position.x;
        let newY = gameState.player.position.y;
        
        switch(e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                newY = Math.max(0, newY - 1);
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                newY = Math.min(gameState.map.height - 1, newY + 1);
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                newX = Math.max(0, newX - 1);
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                newX = Math.min(gameState.map.width - 1, newX + 1);
                break;
            default:
                return;
        }
        
        e.preventDefault();
        movePlayer(newX, newY);
    });
}

function movePlayer(newX, newY) {
    if (gameState.player.energy <= 0) {
        addEventLog('Not enough energy to move! Rest at a hotel.', 'danger');
        return;
    }
    
    // Update position
    const oldX = gameState.player.position.x;
    const oldY = gameState.player.position.y;
    
    gameState.player.position.x = newX;
    gameState.player.position.y = newY;
    gameState.player.energy = Math.max(0, gameState.player.energy - 1);
    
    // Update visual
    const player = document.getElementById('player');
    const oldTile = document.querySelector(`[data-x="${oldX}"][data-y="${oldY}"]`);
    const newTile = document.querySelector(`[data-x="${newX}"][data-y="${newY}"]`);
    
    if (oldTile && player) {
        oldTile.removeChild(player);
    }
    
    if (newTile && player) {
        // Ensure player sprite uses image if available
        if (gameState.player.role && Assets.characters[gameState.player.role] && !player.querySelector('img')) {
            player.innerHTML = '';
            const playerSprite = createImage(Assets.characters[gameState.player.role], gameState.player.role);
            player.appendChild(playerSprite);
        }
        newTile.appendChild(player);
    }
    
    // Check for building
    const building = gameState.buildings.find(b => b.x === newX && b.y === newY);
    if (building) {
        addEventLog(`You arrived at ${building.name}. Click to interact!`, 'warning');
    }
    
    updateUI();
}

// ===== BUILDING INTERACTIONS =====
function interactWithBuilding(building) {
    const modal = document.getElementById('buildingModal');
    const modalContent = document.getElementById('modalContent');
    
    let content = '';
    
    switch(building.type) {
        case 'hotel':
            content = getHotelContent(building);
            break;
        case 'shop':
            content = getShopContent(building);
            break;
        case 'hospital':
            content = getHospitalContent(building);
            break;
        case 'arena':
            content = getArenaContent(building);
            break;
        case 'transit':
            content = getTransitContent(building);
            break;
    }
    
    modalContent.innerHTML = content;
    modal.classList.add('active');
}

function getHotelContent(building) {
    return `
        <div class="modal-header">
            <div class="building-icon">${building.icon}</div>
            <h2>${building.name}</h2>
            <p>Rest and regain your energy</p>
        </div>
        <div class="modal-actions">
            <button class="modal-action-btn" onclick="restAtHotel('quick')">
                <span>🛏️ Quick Rest (Restore 20 Energy)</span>
                <span class="cost">👑 50 CROWN</span>
            </button>
            <button class="modal-action-btn" onclick="restAtHotel('full')">
                <span>😴 Full Rest (Restore All Energy)</span>
                <span class="cost">👑 150 CROWN</span>
            </button>
            <button class="modal-action-btn" onclick="restAtHotel('luxury')">
                <span>✨ Luxury Suite (Restore Energy + Health)</span>
                <span class="cost">👑 300 CROWN</span>
            </button>
        </div>
    `;
}

function getShopContent(building) {
    return `
        <div class="modal-header">
            <div class="building-icon">${building.icon}</div>
            <h2>${building.name}</h2>
            <p>Buy and sell items</p>
        </div>
        <div class="shop-items">
            <div class="shop-item" onclick="buyItem('weapon', 200)">
                <div class="item-icon">⚔️</div>
                <div class="item-name">Combat Knife</div>
                <div class="item-price">👑 200</div>
            </div>
            <div class="shop-item" onclick="buyItem('armor', 300)">
                <div class="item-icon">🛡️</div>
                <div class="item-name">Body Armor</div>
                <div class="item-price">👑 300</div>
            </div>
            <div class="shop-item" onclick="buyItem('medkit', 100)">
                <div class="item-icon">💊</div>
                <div class="item-name">Med Kit</div>
                <div class="item-price">👑 100</div>
            </div>
            <div class="shop-item" onclick="buyItem('gadget', 500)">
                <div class="item-icon">📱</div>
                <div class="item-name">Tech Gadget</div>
                <div class="item-price">👑 500</div>
            </div>
        </div>
    `;
}

function getHospitalContent(building) {
    return `
        <div class="modal-header">
            <div class="building-icon">${building.icon}</div>
            <h2>${building.name}</h2>
            <p>Heal your wounds</p>
        </div>
        <div class="modal-actions">
            <button class="modal-action-btn" onclick="heal('basic')">
                <span>💊 Basic Heal (Restore 30 HP)</span>
                <span class="cost">👑 80 CROWN</span>
            </button>
            <button class="modal-action-btn" onclick="heal('advanced')">
                <span>💉 Advanced Heal (Restore 60 HP)</span>
                <span class="cost">👑 150 CROWN</span>
            </button>
            <button class="modal-action-btn" onclick="heal('full')">
                <span>🏥 Full Recovery (Restore All HP)</span>
                <span class="cost">👑 250 CROWN</span>
            </button>
            <button class="modal-action-btn" onclick="energyBoost()">
                <span>⚡ Energy Boost (+10 Max Energy)</span>
                <span class="cost">👑 400 CROWN</span>
            </button>
        </div>
    `;
}

function getArenaContent(building) {
    return `
        <div class="modal-header">
            <div class="building-icon">${building.icon}</div>
            <h2>${building.name}</h2>
            <p>Prove your strength in battle</p>
        </div>
        <div class="modal-actions">
            <button class="modal-action-btn" onclick="enterBattle('easy')">
                <span>🥊 Easy Battle</span>
                <span class="cost">⚡ 10 Energy</span>
            </button>
            <button class="modal-action-btn" onclick="enterBattle('medium')">
                <span>⚔️ Medium Battle</span>
                <span class="cost">⚡ 15 Energy</span>
            </button>
            <button class="modal-action-btn" onclick="enterBattle('hard')">
                <span>🔥 Hard Battle</span>
                <span class="cost">⚡ 20 Energy</span>
            </button>
            <button class="modal-action-btn" onclick="challengeLeader()">
                <span>👑 Challenge Leader</span>
                <span class="cost">⚡ 30 Energy</span>
            </button>
        </div>
        <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #4ecca3;">
            <h3 style="color: #4ecca3; margin-bottom: 10px;">🏆 Current Leaders</h3>
            <div id="modalLeaderboard"></div>
        </div>
    `;
}

function getTransitContent(building) {
    return `
        <div class="modal-header">
            <div class="building-icon">${building.icon}</div>
            <h2>${building.name}</h2>
            <p>Travel to another district</p>
        </div>
        <div class="modal-actions">
            <button class="modal-action-btn" onclick="travelTo('uptown')">
                <span>🏙️ Uptown District</span>
                <span class="cost">👑 100 CROWN</span>
            </button>
            <button class="modal-action-btn" onclick="travelTo('industrial')">
                <span>🏭 Industrial Zone</span>
                <span class="cost">👑 100 CROWN</span>
            </button>
            <button class="modal-action-btn" onclick="travelTo('waterfront')">
                <span>🌊 Waterfront District</span>
                <span class="cost">👑 100 CROWN</span>
            </button>
            <button class="modal-action-btn" onclick="travelTo('suburbs')">
                <span>🏘️ Suburbs</span>
                <span class="cost">👑 100 CROWN</span>
            </button>
        </div>
    `;
}

// ===== BUILDING ACTIONS =====
function restAtHotel(type) {
    let cost, energyRestore, healthRestore = 0;
    
    switch(type) {
        case 'quick':
            cost = 50;
            energyRestore = 20;
            break;
        case 'full':
            cost = 150;
            energyRestore = gameState.player.maxEnergy;
            break;
        case 'luxury':
            cost = 300;
            energyRestore = gameState.player.maxEnergy;
            healthRestore = gameState.player.maxHealth;
            break;
    }
    
    if (gameState.player.crown < cost) {
        addEventLog('Not enough CROWN!', 'danger');
        return;
    }
    
    gameState.player.crown -= cost;
    gameState.player.energy = Math.min(gameState.player.maxEnergy, gameState.player.energy + energyRestore);
    if (healthRestore > 0) {
        gameState.player.health = gameState.player.maxHealth;
    }
    
    addEventLog(`Rested at hotel. Energy restored!`, 'success');
    closeModal();
    updateUI();
}

function buyItem(itemType, cost) {
    if (gameState.player.crown < cost) {
        addEventLog('Not enough CROWN!', 'danger');
        return;
    }
    
    gameState.player.crown -= cost;
    
    const items = {
        'weapon': { icon: '⚔️', name: 'Combat Knife' },
        'armor': { icon: '🛡️', name: 'Body Armor' },
        'medkit': { icon: '💊', name: 'Med Kit' },
        'gadget': { icon: '📱', name: 'Tech Gadget' }
    };
    
    const item = items[itemType];
    gameState.player.inventory.push({ id: itemType, icon: item.icon, name: item.name });
    
    addEventLog(`Purchased ${item.name}!`, 'success');
    updateDistrictMetrics('prosperity', 2);
    closeModal();
    updateUI();
}

function heal(type) {
    let cost, healAmount;
    
    switch(type) {
        case 'basic':
            cost = 80;
            healAmount = 30;
            break;
        case 'advanced':
            cost = 150;
            healAmount = 60;
            break;
        case 'full':
            cost = 250;
            healAmount = gameState.player.maxHealth;
            break;
    }
    
    if (gameState.player.crown < cost) {
        addEventLog('Not enough CROWN!', 'danger');
        return;
    }
    
    gameState.player.crown -= cost;
    gameState.player.health = Math.min(gameState.player.maxHealth, gameState.player.health + healAmount);
    
    addEventLog(`Healed ${healAmount} HP!`, 'success');
    closeModal();
    updateUI();
}

function energyBoost() {
    const cost = 400;
    
    if (gameState.player.crown < cost) {
        addEventLog('Not enough CROWN!', 'danger');
        return;
    }
    
    gameState.player.crown -= cost;
    gameState.player.maxEnergy += 10;
    gameState.player.energy += 10;
    
    addEventLog('Max energy increased by 10!', 'success');
    closeModal();
    updateUI();
}

function enterBattle(difficulty) {
    const battles = {
        'easy': { energy: 10, reward: 150, xp: 20, damage: 10 },
        'medium': { energy: 15, reward: 300, xp: 40, damage: 20 },
        'hard': { energy: 20, reward: 500, xp: 70, damage: 30 }
    };
    
    const battle = battles[difficulty];
    
    if (gameState.player.energy < battle.energy) {
        addEventLog('Not enough energy!', 'danger');
        return;
    }
    
    gameState.player.energy -= battle.energy;
    
    // Simulate battle
    const success = Math.random() > 0.3; // 70% win rate
    
    if (success) {
        gameState.player.crown += battle.reward;
        gameState.player.xp += battle.xp;
        addEventLog(`Victory! Earned ${battle.reward} CROWN and ${battle.xp} XP!`, 'success');
        
        // Update district based on role
        if (gameState.player.role === 'gangster') {
            updateDistrictMetrics('crime', 3);
        } else if (gameState.player.role === 'detective') {
            updateDistrictMetrics('crime', -2);
        }
    } else {
        gameState.player.health = Math.max(0, gameState.player.health - battle.damage);
        addEventLog(`Defeated! Lost ${battle.damage} HP.`, 'danger');
    }
    
    closeModal();
    updateUI();
}

function challengeLeader() {
    const cost = 30;
    
    if (gameState.player.energy < cost) {
        addEventLog('Not enough energy!', 'danger');
        return;
    }
    
    gameState.player.energy -= cost;
    
    // Challenging the leader is harder
    const success = Math.random() > 0.6; // 40% win rate
    
    if (success) {
        const reward = 1000;
        const xp = 150;
        gameState.player.crown += reward;
        gameState.player.xp += xp;
        gameState.player.influence += 50;
        addEventLog(`🏆 Defeated the leader! Earned ${reward} CROWN and ${xp} XP!`, 'success');
    } else {
        gameState.player.health = Math.max(0, gameState.player.health - 40);
        addEventLog('The leader was too strong! Lost 40 HP.', 'danger');
    }
    
    closeModal();
    updateUI();
}

function travelTo(district) {
    const cost = 100;
    
    if (gameState.player.crown < cost) {
        addEventLog('Not enough CROWN!', 'danger');
        return;
    }
    
    gameState.player.crown -= cost;
    
    const districts = {
        'uptown': { name: 'Uptown', crime: 20, prosperity: 80 },
        'industrial': { name: 'Industrial Zone', crime: 70, prosperity: 35 },
        'waterfront': { name: 'Waterfront', crime: 55, prosperity: 50 },
        'suburbs': { name: 'Suburbs', crime: 15, prosperity: 85 }
    };
    
    const newDistrict = districts[district];
    gameState.district = newDistrict;
    
    addEventLog(`Traveled to ${newDistrict.name}!`, 'success');
    closeModal();
    updateUI();
}

function closeModal() {
    document.getElementById('buildingModal').classList.remove('active');
}

// ===== ROLE ACTIONS =====
function performAction(action) {
    if (gameState.player.energy < action.energyCost) {
        addEventLog('Not enough energy!', 'danger');
        return;
    }
    
    gameState.player.energy -= action.energyCost;
    
    const role = gameState.player.role;
    let reward = 0;
    let xp = 0;
    let message = '';
    
    // Role-specific outcomes
    if (role === 'gangster') {
        switch(action.id) {
            case 'extort':
                reward = Math.floor(Math.random() * 100) + 50;
                xp = 15;
                message = `Extorted ${reward} CROWN from a local business!`;
                updateDistrictMetrics('crime', 5);
                break;
            case 'smuggle':
                reward = Math.floor(Math.random() * 200) + 100;
                xp = 25;
                message = `Smuggled goods successfully! Earned ${reward} CROWN!`;
                updateDistrictMetrics('crime', 7);
                updateDistrictMetrics('prosperity', -3);
                break;
            case 'bribe':
                reward = Math.floor(Math.random() * 80) + 30;
                xp = 10;
                message = `Bribed an official for ${reward} CROWN in benefits!`;
                updateDistrictMetrics('crime', 3);
                break;
        }
    } else if (role === 'detective') {
        switch(action.id) {
            case 'patrol':
                reward = Math.floor(Math.random() * 70) + 40;
                xp = 12;
                message = `Patrol successful! Earned ${reward} CROWN!`;
                updateDistrictMetrics('crime', -4);
                updateDistrictMetrics('prosperity', 2);
                break;
            case 'confiscate':
                reward = Math.floor(Math.random() * 150) + 80;
                xp = 20;
                message = `Confiscated illegal goods! Earned ${reward} CROWN!`;
                updateDistrictMetrics('crime', -6);
                break;
            case 'report':
                reward = Math.floor(Math.random() * 100) + 50;
                xp = 15;
                message = `Filed crime report. Earned ${reward} CROWN!`;
                updateDistrictMetrics('crime', -3);
                updateDistrictMetrics('prosperity', 3);
                break;
        }
    } else if (role === 'civilian') {
        switch(action.id) {
            case 'trade':
                reward = Math.floor(Math.random() * 60) + 30;
                xp = 8;
                message = `Completed trade! Earned ${reward} CROWN!`;
                updateDistrictMetrics('prosperity', 4);
                break;
            case 'invest':
                reward = Math.floor(Math.random() * 300) + 150;
                xp = 30;
                message = `Investment paid off! Earned ${reward} CROWN!`;
                updateDistrictMetrics('prosperity', 8);
                break;
            case 'adapt':
                reward = Math.floor(Math.random() * 80) + 40;
                xp = 12;
                message = `Adapted to market conditions! Earned ${reward} CROWN!`;
                updateDistrictMetrics('prosperity', 3);
                break;
        }
    }
    
    gameState.player.crown += reward;
    gameState.player.xp += xp;
    gameState.player.influence += Math.floor(xp / 5);
    
    addEventLog(message, 'success');
    updateUI();
}

// ===== DISTRICT METRICS =====
function updateDistrictMetrics(metric, change) {
    if (metric === 'crime') {
        gameState.district.crime = Math.max(0, Math.min(100, gameState.district.crime + change));
    } else if (metric === 'prosperity') {
        gameState.district.prosperity = Math.max(0, Math.min(100, gameState.district.prosperity + change));
    }
    
    updateUI();
}

// ===== UI UPDATES =====
function updateUI() {
    // Update CROWN
    document.getElementById('crownAmount').textContent = gameState.player.crown;
    
    // Update stats
    document.getElementById('health').textContent = `${gameState.player.health}/${gameState.player.maxHealth}`;
    document.getElementById('energy').textContent = `${gameState.player.energy}/${gameState.player.maxEnergy}`;
    document.getElementById('xp').textContent = `${gameState.player.xp}/${gameState.player.maxXp}`;
    document.getElementById('influence').textContent = gameState.player.influence;
    
    // Update district
    document.getElementById('districtName').textContent = gameState.district.name;
    document.getElementById('crimeBar').style.width = `${gameState.district.crime}%`;
    document.getElementById('crimeValue').textContent = `${gameState.district.crime}%`;
    document.getElementById('prosperityBar').style.width = `${gameState.district.prosperity}%`;
    document.getElementById('prosperityValue').textContent = `${gameState.district.prosperity}%`;
    
    // Update inventory
    updateInventory();
    
    // Check for level up
    if (gameState.player.xp >= gameState.player.maxXp) {
        levelUp();
    }
    
    // Disable action buttons if no energy
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(btn => {
        btn.disabled = gameState.player.energy <= 0;
    });
}

function updateInventory() {
    const inventoryGrid = document.getElementById('inventoryGrid');
    inventoryGrid.innerHTML = '';
    
    // Show up to 4 items
    for (let i = 0; i < 4; i++) {
        const slot = document.createElement('div');
        slot.className = 'inventory-slot';
        
        if (gameState.player.inventory[i]) {
            const item = gameState.player.inventory[i];
            slot.innerHTML = `
                <div class="item">${item.icon}</div>
                <span>${item.name}</span>
            `;
        } else {
            slot.classList.add('empty');
        }
        
        inventoryGrid.appendChild(slot);
    }
}

function levelUp() {
    gameState.player.xp -= gameState.player.maxXp;
    gameState.player.maxXp += 20;
    gameState.player.maxHealth += 10;
    gameState.player.health = gameState.player.maxHealth;
    gameState.player.maxEnergy += 5;
    gameState.player.energy = gameState.player.maxEnergy;
    
    addEventLog('🎉 LEVEL UP! Stats increased!', 'success');
}

// ===== EVENT LOG =====
function addEventLog(message, type = '') {
    const eventLog = document.getElementById('eventLog');
    const eventItem = document.createElement('div');
    eventItem.className = `event-item ${type}`;
    eventItem.textContent = message;
    
    eventLog.insertBefore(eventItem, eventLog.firstChild);
    
    // Keep only last 10 events
    while (eventLog.children.length > 10) {
        eventLog.removeChild(eventLog.lastChild);
    }
}

// ===== GAME LOOP =====
function startGameLoop() {
    setInterval(() => {
        // Passive effects based on district state
        if (gameState.player.role) {
            // Slow district changes over time
            if (Math.random() < 0.1) {
                // Random district events
                const crimeChange = Math.floor(Math.random() * 3) - 1;
                const prosperityChange = Math.floor(Math.random() * 3) - 1;
                
                updateDistrictMetrics('crime', crimeChange);
                updateDistrictMetrics('prosperity', prosperityChange);
            }
            
            // Regenerate small amount of energy if high prosperity
            if (gameState.district.prosperity > 70 && Math.random() < 0.05) {
                gameState.player.energy = Math.min(gameState.player.maxEnergy, gameState.player.energy + 1);
                updateUI();
            }
        }
    }, 5000); // Every 5 seconds
}

