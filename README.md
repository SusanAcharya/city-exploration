# Emerald City: District Hustle

A retro pixel‑art city sim where you play as a Gangster, Detective, or Civilian. Explore districts, interact with buildings, battle in arenas, and earn 👑 CROWN as you climb leaderboards and shape the city.

## ▶️ Play
- Move: Arrow Keys or WASD
- Interact: Click buildings (or press Enter/E when on a tile)
- Close modals: ESC or ✕

## 🚀 Run Locally (React + Vite)
```bash
npm install
npm run dev
```
Open the URL shown by Vite (default `http://localhost:5173`).

## 🎭 Roles
- 🔫 Gangster: High risk/reward, weapon discounts in crime hubs
- 👮 Detective: Cheaper healing, defensive EMZ gains
- 👔 Civilian: Better economy perks, travel/prosperity bonuses

## 🏙️ Buildings & Interactions
- 🏨 Hotel: Rest (Quick / Full / Luxury)
- 🏪 Shop: Buy weapons, armor, medkits, gadgets
- 🏥 Hospital: Heal (Basic / Advanced / Full)
- 🏟️ Arena: Fight for rank and rewards; view Top 3 and challenge opponents
- 🎓 Education: Train to increase caps
- 🏛️ Government: RNG tax events
- ✈️ Airport: Travel to other districts

## 📊 District & World
- Each district tracks Crime and Prosperity; your actions shift both.
- World State changes daily based on faction dominance across arenas.

## 🖼️ Visuals
- Pixel-art theme with Jersey 10 font and CRT‑style HUD.
- Characters use sprites from `assets/characters/` (gangster.png, detective.png, civilian.png).
- Map tiles and UI use assets in `public/assets/`.

## 📦 Project Structure
```
src/
  components/  # UI (Map, Panels, Modals, Role Selection)
  data/        # Assets map, role/game configs
  hooks/       # useGameState (movement, actions, travel, updates)
  types/       # TypeScript models
public/assets/ # Images (characters, buildings, tiles, ui)
```

## 🏆 Leaderboards
- District arenas show Top 3; win battles to take their spots.
- Seasonal leaderboard ranks all players; top players earn rewards.

## 🧪 Tips
- Every move costs energy; rest at hotels often.
- Shops, hospitals, and education have role‑based pricing/perks.
- Arena battles consume energy and risk HP but yield CROWN/XP.

## 📜 License
Copyright © The Emerald City team. All rights reserved.
