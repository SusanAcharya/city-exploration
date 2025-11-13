# Emerald City: District Hustle - React/TypeScript Version

A modern web-based game built with React, TypeScript, and Vite. Players explore a living city as Gangsters, Detectives, or Civilians, earning CROWN tokens and influencing district dynamics.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🎮 Game Features

### Core Mechanics
- **9 Districts**: Explore different districts with unique characteristics
- **Role-Based Gameplay**: Choose between Gangster, Detective, or Civilian
- **Season Pass System**: Purchase season passes to compete in seasonal leaderboards
- **World State System**: Dynamic world state that changes every 24 hours based on NFT dominance
- **District Leaderboards**: Compete for top 3 positions in each district
- **Seasonal Leaderboard**: Global competition with SUI rewards for top 10 players

### Building Types
- **Hotel (Residential)**: Rest and recover energy
- **Shop (Industrial)**: Buy weapons, armor, and items
- **Hospital (Health)**: Heal HP and boost stats
- **Arena (Recreation)**: Battle for CROWN and rankings
- **Education Center**: Train to increase capabilities
- **Government**: Pay taxes (RNG-based)
- **Commercial**: Access consumables and boosters
- **Airport**: Travel between districts

### NFT Perks
Each role has unique perks that affect gameplay:
- **Gangsters**: Raider bonus, black market access, but higher costs due to wanted status
- **Detectives**: Law bonus, crime tracker, efficient rest
- **Civilians**: Market sense, entrepreneur bonus, negotiator perks

### Badges & Achievements
- Defeat Badges: Earned by defeating specific NFT types
- Arena Badge: For holding top position in any District Arena
- District Domination Badge: For reaching #1 in a district

## 🏗️ Project Structure

```
emerald-city/
├── src/
│   ├── components/      # React components
│   │   ├── GameContainer.tsx
│   │   ├── GameMap.tsx
│   │   ├── TopBar.tsx
│   │   ├── LeftPanel.tsx
│   │   ├── RightPanel.tsx
│   │   ├── BuildingModal.tsx
│   │   ├── DistrictSelector.tsx
│   │   ├── SeasonPassModal.tsx
│   │   └── RoleSelection.tsx
│   ├── hooks/           # Custom React hooks
│   │   └── useGameState.ts
│   ├── types/           # TypeScript type definitions
│   │   └── game.ts
│   ├── data/            # Game data and configurations
│   │   ├── gameData.ts
│   │   └── assets.ts
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── public/
│   └── assets/          # Game assets (images, sprites)
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 🎨 Styling

The game uses CSS modules and global styles. The design maintains the retro pixel-art aesthetic with modern React components.

## 🔧 Development

### Key Technologies
- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **CSS3**: Styling with gradients and animations

### State Management
Game state is managed through a custom `useGameState` hook that provides:
- Player state management
- District management
- World state calculations
- Travel between districts
- Season pass purchases

## 📝 Notes

- The game preserves the original movement mechanics (arrow keys/WASD)
- All building interactions are preserved
- New features from req-doc.txt are fully implemented
- Assets are loaded from the `public/assets` directory
- The game runs entirely client-side (no backend required for MVP)

## 🚧 Future Enhancements

- Backend integration for persistent state
- Multiplayer support
- NFT integration
- Blockchain wallet connectivity
- Real-time leaderboard updates
- More districts and buildings
- Enhanced battle system

## 📄 License

See the main README.md for license information.

