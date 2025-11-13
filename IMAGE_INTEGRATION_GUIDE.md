# Image Integration Guide

Once you've added your pixel art assets to the `assets/` folder, here's how to integrate them into the game:

## 🔧 Quick Integration Steps

### 1. Character Sprites

In `game.js`, find the `initMap()` function and update the player sprite creation:

```javascript
// Replace this line:
playerEl.innerHTML = roleConfig[gameState.player.role]?.icon || '👤';

// With this:
const roleIcons = {
    gangster: 'assets/characters/gangster.png',
    detective: 'assets/characters/detective.png',
    civilian: 'assets/characters/civilian.png'
};
const img = document.createElement('img');
img.src = roleIcons[gameState.player.role] || 'assets/characters/gangster.png';
img.style.width = '100%';
img.style.height = '100%';
playerEl.appendChild(img);
```

### 2. Building Sprites

In `game.js`, find the building creation in `initMap()` and update:

```javascript
// Replace this line:
tile.innerHTML = building.icon;

// With this:
const buildingIcons = {
    hotel: 'assets/buildings/hotel.png',
    shop: 'assets/buildings/shop.png',
    hospital: 'assets/buildings/hospital.png',
    arena: 'assets/buildings/arena.png',
    transit: 'assets/buildings/transit.png'
};
const img = document.createElement('img');
img.src = buildingIcons[building.type];
img.style.width = '100%';
img.style.height = '100%';
tile.appendChild(img);
```

### 3. Map Tiles Background

In `styles.css`, update the `.tile` class:

```css
.tile {
    background: url('assets/tiles/grass.png');
    background-size: cover;
    border: 1px solid #1a472a;
    position: relative;
    transition: all 0.1s ease;
}

.tile.road {
    background: url('assets/tiles/road.png');
    background-size: cover;
}
```

### 4. UI Icons

In `index.html`, replace emoji icons with images:

```html
<!-- Crown Icon -->
<div class="crown-balance">
    <img src="assets/ui/crown-icon.png" alt="Crown" style="width: 24px; height: 24px;">
    <span id="crownAmount">1000</span>
    <span class="crown-label">CROWN</span>
</div>

<!-- Stats Icons -->
<div class="stat-item">
    <span><img src="assets/ui/health-icon.png" style="width: 16px; height: 16px;"> Health:</span>
    <span id="health">100/100</span>
</div>
```

### 5. District Background

In `styles.css`, add background image to the map:

```css
.game-map {
    flex: 1;
    background: url('assets/backgrounds/downtown-bg.png');
    background-size: cover;
    background-position: center;
    border: 4px solid #4ecca3;
    /* ... rest of styles ... */
}
```

## 📦 Full Assets Integration Example

Create a new file `assets.js` to manage all assets:

```javascript
// assets.js
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
        transit: 'assets/buildings/transit.png'
    },
    tiles: {
        grass: 'assets/tiles/grass.png',
        road: 'assets/tiles/road.png'
    },
    ui: {
        crown: 'assets/ui/crown-icon.png',
        health: 'assets/ui/health-icon.png',
        energy: 'assets/ui/energy-icon.png',
        xp: 'assets/ui/xp-icon.png'
    },
    items: {
        pistol: 'assets/items/pistol.png',
        knife: 'assets/items/knife.png',
        armor: 'assets/items/armor.png',
        medkit: 'assets/items/medkit.png',
        gadget: 'assets/items/gadget.png'
    }
};
```

Then include it in `index.html`:

```html
<script src="assets.js"></script>
<script src="game.js"></script>
```

## 🎨 Image Loading Helper Function

Add this to `game.js`:

```javascript
// Helper function to create image elements
function createImage(src, alt = '') {
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'contain';
    return img;
}

// Usage:
tile.appendChild(createImage(Assets.buildings[building.type], building.name));
```

## ⚡ Preloading Images

To avoid loading delays, add this to `game.js`:

```javascript
// Add at the start of game.js
function preloadImages() {
    const images = [];
    
    // Preload all assets
    Object.values(Assets.characters).forEach(src => {
        const img = new Image();
        img.src = src;
        images.push(img);
    });
    
    Object.values(Assets.buildings).forEach(src => {
        const img = new Image();
        img.src = src;
        images.push(img);
    });
    
    // Add more as needed
    
    return Promise.all(images.map(img => 
        new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve; // Continue even if image fails
        })
    ));
}

// Update initialization
document.addEventListener('DOMContentLoaded', async () => {
    await preloadImages();
    initRoleSelection();
    initMap();
    initControls();
    startGameLoop();
});
```

## 🔄 Fallback to Emojis

If you want to support both images and emojis:

```javascript
function getCharacterSprite(role) {
    if (Assets.characters[role]) {
        return createImage(Assets.characters[role], role);
    } else {
        // Fallback to emoji
        const span = document.createElement('span');
        span.textContent = roleConfig[role].icon;
        return span;
    }
}
```

## 📝 Testing Checklist

After adding images:

- [ ] All character sprites load correctly
- [ ] Buildings appear on the map
- [ ] UI icons are visible
- [ ] Map tiles have proper background
- [ ] Inventory items display images
- [ ] No broken image icons (check browser console)
- [ ] Game performance is still smooth

## 🐛 Troubleshooting

**Images not showing?**
1. Check file paths are correct (case-sensitive)
2. Verify images are in the right folders
3. Check browser console for 404 errors
4. Ensure image formats are PNG or WebP

**Images look blurry?**
1. Add this CSS for crisp pixel art:
```css
img {
    image-rendering: pixelated;
    image-rendering: crisp-edges;
}
```

**Slow loading?**
1. Optimize image file sizes
2. Use sprite sheets for multiple images
3. Implement lazy loading for backgrounds

---

Remember: The game works perfectly with emojis! Images are purely for visual enhancement.

