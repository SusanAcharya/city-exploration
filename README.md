# Emerald City: District Hustle

A fully interactive browser-based game where players explore a living city as Gangsters, Detectives, or Civilians, earning CROWN tokens and influencing district dynamics.

## 🎮 How to Play

1. Open `index.html` in your browser
2. Select your role (Gangster, Detective, or Civilian)
3. Use **Arrow Keys** or **WASD** to move around the map
4. Click on buildings to interact with them
5. Use quick action buttons based on your role to earn CROWN
6. Manage your energy and health by visiting hotels and hospitals
7. Battle in the arena to climb the leaderboard
8. Travel to different districts via transit stations

## 🎯 Game Features

### Core Mechanics
- **Role-Based Gameplay**: Three distinct roles with unique abilities
  - 🔫 Gangster: Extort, Smuggle, Bribe (increases crime)
  - 👮 Detective: Patrol, Confiscate, Report (decreases crime)
  - 👔 Civilian: Trade, Invest, Adapt (increases prosperity)

- **Dynamic Districts**: Each district has Crime and Prosperity metrics that change based on player actions
- **Energy System**: Movement and actions cost energy; rest at hotels to recover
- **Economy**: Earn and spend CROWN tokens throughout the game
- **Progression**: Gain XP and level up to increase stats

### Buildings & Interactions
- 🏨 **Hotel**: Rest to regain energy (Quick Rest, Full Rest, Luxury Suite)
- 🏪 **Shop**: Buy weapons, armor, med kits, and gadgets
- 🏥 **Hospital**: Heal HP and boost max energy
- 🏟️ **Arena**: Battle for CROWN rewards and climb the leaderboard
- 🚉 **Transit**: Travel to different districts (Uptown, Industrial, Waterfront, Suburbs)

### UI Panels
- **Top Bar**: Role badge and CROWN balance
- **Left Panel**: District stats, player stats, quick actions
- **Center**: Interactive 2D game map
- **Right Panel**: Inventory, leaderboard, event log

## 🎨 Optional Assets for Enhancement

If you want to add visual assets to enhance the game, here are recommended images to add to an `/assets` folder:

### Character Sprites (32x32 or 64x64 pixels)
- `gangster.png` - Gangster character sprite
- `detective.png` - Detective character sprite
- `civilian.png` - Civilian character sprite

### Building Images (64x64 or 128x128 pixels)
- `hotel.png` - Hotel/residential building
- `shop.png` - Shop/market building
- `hospital.png` - Hospital building
- `arena.png` - Arena/combat building
- `transit.png` - Transit station

### UI Elements
- `crown-icon.png` - CROWN token icon (32x32)
- `health-icon.png` - Health icon
- `energy-icon.png` - Energy icon
- `xp-icon.png` - Experience icon

### Background/Tile Assets
- `grass-tile.png` - Grass tile for map (32x32)
- `road-tile.png` - Road tile for map (32x32)
- `building-tile.png` - Building tile background (32x32)

### District Backgrounds (Optional)
- `downtown-bg.png` - Downtown background
- `uptown-bg.png` - Uptown background
- `industrial-bg.png` - Industrial zone background
- `waterfront-bg.png` - Waterfront background
- `suburbs-bg.png` - Suburbs background

### UI/Menu Elements
- `panel-border.png` - Decorative border for UI panels
- `button-normal.png` - Button background (normal state)
- `button-hover.png` - Button background (hover state)
- `modal-bg.png` - Modal dialog background

## 📁 Recommended Folder Structure

```
emerald-city/
├── index.html
├── styles.css
├── game.js
├── README.md
└── assets/
    ├── characters/
    │   ├── gangster.png
    │   ├── detective.png
    │   └── civilian.png
    ├── buildings/
    │   ├── hotel.png
    │   ├── shop.png
    │   ├── hospital.png
    │   ├── arena.png
    │   └── transit.png
    ├── ui/
    │   ├── crown-icon.png
    │   ├── health-icon.png
    │   └── energy-icon.png
    └── tiles/
        ├── grass.png
        ├── road.png
        └── building.png
```

## 🎨 Art Style Guidelines

Based on the reference image provided:
- **Pixel art style** with vibrant colors
- **Top-down or isometric perspective**
- **Bright color palette**: Greens, blues, purples, yellows
- **Fantasy/adventure aesthetic** with urban elements
- **Clear, readable sprites** with strong outlines

## 🔧 Technical Details

- **No dependencies**: Pure HTML, CSS, and JavaScript
- **Responsive**: Fits in one screen, no scrolling
- **Browser compatible**: Works in all modern browsers
- **Local storage ready**: Can be extended to save game state

## 🚀 Future Enhancement Ideas

- Add sound effects and background music
- Implement save/load game functionality
- Add more districts with unique characteristics
- Create special events and random encounters
- Add multiplayer features using blockchain
- Integrate actual NFTs for character roles
- Add mini-games for each building type

## 💡 Development Notes

The game currently uses emoji icons for all visual elements. Adding custom pixel art assets would significantly enhance the visual appeal while maintaining the retro aesthetic. All game logic is functional without assets, so the game is fully playable as-is.

## 🎮 Controls

- **Movement**: Arrow Keys or WASD
- **Interaction**: Click on buildings
- **Quick Actions**: Click action buttons in left panel
- **Close Modals**: Click X button or ESC key (can be added)

---

Enjoy your journey through Emerald City! 🏙️👑

# city-exploration
