# 🎮 Quick Start Guide

## Play the Game RIGHT NOW

1. Open `index.html` in your browser (double-click or drag to browser)
2. That's it! The game is fully playable with emoji graphics.

## 🎯 First Steps

1. **Choose Your Role** - Click Gangster, Detective, or Civilian
2. **Move Around** - Use Arrow Keys or WASD
3. **Visit Buildings** - Click on emoji buildings (🏨🏪🏥🏟️🚉)
4. **Use Actions** - Click the action buttons in the left panel
5. **Watch Your Energy** - Rest at hotels when low

## 📊 What Everything Means

### Top Bar
- **Role Badge** - Your chosen character class
- **👑 CROWN** - Your money (earn it through actions)

### Left Panel
- **District Stats** - Crime and Prosperity levels
- **Player Stats** - Health, Energy, XP, Influence
- **Quick Actions** - Your role-specific abilities

### Map (Center)
- **🏨 Hotel** - Rest and regain energy
- **🏪 Shop** - Buy items and equipment
- **🏥 Hospital** - Heal HP and boost stats
- **🏟️ Arena** - Battle and climb leaderboard
- **🚉 Transit** - Travel to other districts

### Right Panel
- **Inventory** - Your equipped items
- **Leaderboard** - Top arena fighters
- **Event Log** - Recent actions and results

## 💡 Pro Tips

1. **Manage Energy** - Every move costs 1 energy
2. **Role Strategy** 
   - Gangsters: High crime = better rewards
   - Detectives: Low crime = safer actions
   - Civilians: High prosperity = more profit
3. **Level Up** - Gain XP to increase max stats
4. **District Balance** - Your actions affect the whole city
5. **Arena Battles** - High risk, high reward!

## 🎨 Adding Visual Assets (Optional)

Your game works perfectly with emojis, but if you want custom pixel art:

1. Create/commission pixel art images (see `ASSETS_LIST.txt`)
2. Place them in the `assets/` folders
3. Follow `IMAGE_INTEGRATION_GUIDE.md` to integrate
4. Refresh your browser

## 🎪 Game Loop

```
Start → Choose Role → Explore Map → Do Actions → Earn CROWN 
  ↑                                                          ↓
  └──────────── Level Up ← Visit Buildings ← Spend CROWN ←──┘
```

## 🏆 Goals

- **Earn CROWN** - The main currency
- **Level Up** - Increase your stats
- **Influence the District** - Change crime/prosperity
- **Dominate Arena** - Climb the leaderboard
- **Explore Districts** - Travel to different areas

## ⚙️ Game Mechanics

### Energy System
- Start with 50 energy
- Each move costs 1 energy
- Actions cost 5-30 energy
- Rest at hotels to recover

### Economy
- Earn CROWN through actions
- Spend at buildings
- Prices vary by district
- High prosperity = better trade rates

### District Dynamics
- Crime Index: 0-100%
- Prosperity Index: 0-100%
- Your role affects both
- Changes event odds and rewards

### Progression
- Gain XP from actions
- Level up every 100 XP
- Increases max health/energy
- Unlock better rewards

## 🎮 Controls Reference

| Key | Action |
|-----|--------|
| ↑ or W | Move Up |
| ↓ or S | Move Down |
| ← or A | Move Left |
| → or D | Move Right |
| Click | Interact with buildings |
| Click | Use action buttons |

## 🐛 Troubleshooting

**Game won't load?**
- Make sure all three files are in the same folder (index.html, styles.css, game.js)
- Try a different browser (Chrome, Firefox, Safari)

**Can't move?**
- Click on the game area first
- Make sure modal dialogs are closed
- Check if you have energy

**Buildings not clickable?**
- Walk to the building first
- Or click directly on the emoji

## 📱 Browser Compatibility

✅ Chrome / Edge (recommended)
✅ Firefox
✅ Safari
✅ Opera
⚠️ Mobile browsers (may need tweaks)

---

## 🎉 You're Ready!

Open `index.html` and start your criminal empire, detective career, or business venture in Emerald City!

For detailed mechanics, see `README.md`
For asset creation, see `ASSETS_LIST.txt`
For image integration, see `IMAGE_INTEGRATION_GUIDE.md`

Have fun! 🏙️👑

