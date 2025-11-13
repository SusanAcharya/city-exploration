import { useEffect } from 'react';
import { Building } from '../types/game';
import { useGameState } from '../hooks/useGameState';
import './BuildingModal.css';

interface BuildingModalProps {
  building: Building;
  gameState: ReturnType<typeof useGameState>;
  onClose: () => void;
  addEventLog: (message: string, type?: string) => void;
}

export default function BuildingModal({
  building,
  gameState,
  onClose,
  addEventLog,
}: BuildingModalProps) {
  const { player, currentDistrict } = gameState.gameState;

  const handleHotelAction = (type: 'quick' | 'full' | 'luxury') => {
    let cost = 0;
    let energyRestore = 0;
    let healthRestore = 0;

    // Apply role-specific modifiers
    if (player.role === 'gangster') {
      cost = type === 'quick' ? 65 : type === 'full' ? 195 : 390; // +30% for wanted status
    } else if (player.role === 'detective') {
      cost = type === 'quick' ? 40 : type === 'full' ? 120 : 240; // Discount
    } else {
      cost = type === 'quick' ? 50 : type === 'full' ? 150 : 300;
    }

    energyRestore = type === 'quick' ? 20 : player.maxEnergy;
    healthRestore = type === 'luxury' ? player.maxHealth : 0;

    if (player.crown < cost) {
      addEventLog('Not enough CROWN!', 'danger');
      return;
    }

    gameState.updatePlayer({
      crown: player.crown - cost,
      energy: Math.min(player.maxEnergy, player.energy + energyRestore),
      health: healthRestore > 0 ? player.maxHealth : player.health,
    });

    addEventLog(`Rested at ${building.name}. Energy restored!`, 'success');
    onClose();
  };

  const handleShopAction = (itemType: string, cost: number) => {
    // Apply role-specific discounts
    let finalCost = cost;
    if (player.role === 'gangster' && currentDistrict.worldState === 'Crime Hub') {
      finalCost = Math.floor(cost * 0.8); // 20% discount
    } else if (player.role === 'civilian' && currentDistrict.worldState === 'Neutral') {
      finalCost = Math.floor(cost * 0.85); // 15% discount
    }

    if (player.crown < finalCost) {
      addEventLog('Not enough CROWN!', 'danger');
      return;
    }

    const items: Record<string, { icon: string; name: string }> = {
      weapon: { icon: '⚔️', name: 'Combat Knife' },
      armor: { icon: '🛡️', name: 'Body Armor' },
      medkit: { icon: '💊', name: 'Med Kit' },
      gadget: { icon: '📱', name: 'Tech Gadget' },
    };

    gameState.updatePlayer({
      crown: player.crown - finalCost,
      inventory: [...player.inventory, { id: itemType, ...items[itemType], type: 'item' }],
    });

    addEventLog(`Purchased ${items[itemType].name}!`, 'success');
    gameState.updateDistrict(currentDistrict.id, {
      prosperity: Math.min(100, currentDistrict.prosperity + 2),
    });
    onClose();
  };

  const handleHospitalAction = (type: 'basic' | 'advanced' | 'full') => {
    let cost = 0;
    let healAmount = 0;

    if (player.role === 'detective') {
      cost = type === 'basic' ? 70 : type === 'advanced' ? 130 : 220; // Discount
    } else {
      cost = type === 'basic' ? 80 : type === 'advanced' ? 150 : 250;
    }

    healAmount = type === 'basic' ? 30 : type === 'advanced' ? 60 : player.maxHealth;

    if (player.crown < cost) {
      addEventLog('Not enough CROWN!', 'danger');
      return;
    }

    gameState.updatePlayer({
      crown: player.crown - cost,
      health: Math.min(player.maxHealth, player.health + healAmount),
    });

    addEventLog(`Healed ${healAmount} HP!`, 'success');
    onClose();
  };

  const handleArenaAction = (difficulty: 'easy' | 'medium' | 'hard') => {
    const battles = {
      easy: { energy: 10, reward: 150, xp: 20, damage: 10 },
      medium: { energy: 15, reward: 300, xp: 40, damage: 20 },
      hard: { energy: 20, reward: 500, xp: 70, damage: 30 },
    };

    const battle = battles[difficulty];

    if (player.energy < battle.energy) {
      addEventLog('Not enough energy!', 'danger');
      return;
    }

    gameState.updatePlayer({
      energy: player.energy - battle.energy,
    });

    const success = Math.random() > 0.3;

    if (success) {
      let reward = battle.reward;
      if (player.role === 'gangster') {
        reward = Math.floor(reward * 1.25); // Raider bonus
      }

      gameState.updatePlayer({
        crown: player.crown + reward,
        xp: player.xp + battle.xp,
      });

      addEventLog(`Victory! Earned ${reward} CROWN and ${battle.xp} XP!`, 'success');
    } else {
      gameState.updatePlayer({
        health: Math.max(0, player.health - battle.damage),
      });
      addEventLog(`Defeated! Lost ${battle.damage} HP.`, 'danger');
    }

    onClose();
  };

  const handleEducationAction = () => {
    const cost = 200;
    if (player.crown < cost) {
      addEventLog('Not enough CROWN!', 'danger');
      return;
    }

    gameState.updatePlayer({
      crown: player.crown - cost,
      maxXp: player.maxXp + 50,
    });

    addEventLog('Training complete! Max XP increased!', 'success');
    onClose();
  };

  const handleGovernmentAction = () => {
    const tax = Math.floor(Math.random() * 100) + 50;
    if (player.crown < tax) {
      addEventLog('Not enough CROWN to pay tax!', 'danger');
      return;
    }

    gameState.updatePlayer({
      crown: player.crown - tax,
    });

    addEventLog(`Paid ${tax} CROWN in taxes.`, 'warning');
    onClose();
  };

  const handleAirportAction = (districtId: number) => {
    const cost = 100;
    if (player.crown < cost) {
      addEventLog('Not enough CROWN!', 'danger');
      return;
    }

    gameState.travelToDistrict(districtId);
    gameState.updatePlayer({
      crown: player.crown - cost,
    });

    addEventLog(`Traveled to district ${districtId}!`, 'success');
    onClose();
  };

  const renderContent = () => {
    switch (building.type) {
      case 'hotel':
        return (
          <>
            <div className="modal-header">
              <div className="building-icon">{building.icon}</div>
              <h2>{building.name}</h2>
              <p>Rest and regain your energy</p>
            </div>
            <div className="modal-actions">
              <button className="modal-action-btn" onClick={() => handleHotelAction('quick')}>
                <span>🛏️ Quick Rest (Restore 20 Energy)</span>
                <span className="cost">👑 {player.role === 'gangster' ? 65 : player.role === 'detective' ? 40 : 50} CROWN</span>
              </button>
              <button className="modal-action-btn" onClick={() => handleHotelAction('full')}>
                <span>😴 Full Rest (Restore All Energy)</span>
                <span className="cost">👑 {player.role === 'gangster' ? 195 : player.role === 'detective' ? 120 : 150} CROWN</span>
              </button>
              <button className="modal-action-btn" onClick={() => handleHotelAction('luxury')}>
                <span>✨ Luxury Suite (Restore Energy + Health)</span>
                <span className="cost">👑 {player.role === 'gangster' ? 390 : player.role === 'detective' ? 240 : 300} CROWN</span>
              </button>
            </div>
          </>
        );

      case 'shop':
        return (
          <>
            <div className="modal-header">
              <div className="building-icon">{building.icon}</div>
              <h2>{building.name}</h2>
              <p>Buy and sell items</p>
            </div>
            <div className="shop-items">
              <div className="shop-item" onClick={() => handleShopAction('weapon', 200)}>
                <div className="item-icon">⚔️</div>
                <div className="item-name">Combat Knife</div>
                <div className="item-price">👑 200</div>
              </div>
              <div className="shop-item" onClick={() => handleShopAction('armor', 300)}>
                <div className="item-icon">🛡️</div>
                <div className="item-name">Body Armor</div>
                <div className="item-price">👑 300</div>
              </div>
              <div className="shop-item" onClick={() => handleShopAction('medkit', 100)}>
                <div className="item-icon">💊</div>
                <div className="item-name">Med Kit</div>
                <div className="item-price">👑 100</div>
              </div>
              <div className="shop-item" onClick={() => handleShopAction('gadget', 500)}>
                <div className="item-icon">📱</div>
                <div className="item-name">Tech Gadget</div>
                <div className="item-price">👑 500</div>
              </div>
            </div>
          </>
        );

      case 'hospital':
        return (
          <>
            <div className="modal-header">
              <div className="building-icon">{building.icon}</div>
              <h2>{building.name}</h2>
              <p>Heal your wounds</p>
            </div>
            <div className="modal-actions">
              <button className="modal-action-btn" onClick={() => handleHospitalAction('basic')}>
                <span>💊 Basic Heal (Restore 30 HP)</span>
                <span className="cost">👑 {player.role === 'detective' ? 70 : 80} CROWN</span>
              </button>
              <button className="modal-action-btn" onClick={() => handleHospitalAction('advanced')}>
                <span>💉 Advanced Heal (Restore 60 HP)</span>
                <span className="cost">👑 {player.role === 'detective' ? 130 : 150} CROWN</span>
              </button>
              <button className="modal-action-btn" onClick={() => handleHospitalAction('full')}>
                <span>🏥 Full Recovery (Restore All HP)</span>
                <span className="cost">👑 {player.role === 'detective' ? 220 : 250} CROWN</span>
              </button>
            </div>
          </>
        );

      case 'arena':
        // Top 3 players (placeholders)
        const topPlayers = currentDistrict.leaderboard.length > 0
          ? currentDistrict.leaderboard.slice(0, 3)
          : [
              { rank: 1, name: 'Shadow Master', score: 12500, role: 'gangster' as const },
              { rank: 2, name: 'Detective Prime', score: 9800, role: 'detective' as const },
              { rank: 3, name: 'Civic Hero', score: 7500, role: 'civilian' as const },
            ];

        // Challengeable characters (placeholders)
        const challengeableCharacters = [
          { id: '1', name: 'Street Fighter', icon: '🥊', level: 5, role: 'gangster' as const },
          { id: '2', name: 'Rookie Cop', icon: '👮', level: 3, role: 'detective' as const },
          { id: '3', name: 'Business Tycoon', icon: '👔', level: 4, role: 'civilian' as const },
          { id: '4', name: 'Veteran Gangster', icon: '🔫', level: 7, role: 'gangster' as const },
          { id: '5', name: 'Detective Chief', icon: '🕵️', level: 6, role: 'detective' as const },
          { id: '6', name: 'Elite Civilian', icon: '💼', level: 5, role: 'civilian' as const },
        ];

        const handleChallengeCharacter = (characterName: string) => {
          addEventLog(`Challenging ${characterName}...`, 'warning');
          // Use medium difficulty as default for character challenges
          handleArenaAction('medium');
        };

        return (
          <>
            <div className="modal-header">
              <div className="building-icon">{building.icon}</div>
              <h2>{building.name}</h2>
              <p>Prove your strength in battle</p>
            </div>

            {/* Top 3 Players Section */}
            <div className="arena-top-players">
              <h3>🏆 Top 3 Players</h3>
              <div className="top-players-grid">
                {topPlayers.map((player, index) => {
                  const rankClass = index === 0 ? 'first' : index === 1 ? 'second' : 'third';
                  const rankIcon = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
                  const roleIcon = player.role === 'gangster' ? '🔫' : player.role === 'detective' ? '👮' : '👔';
                  
                  return (
                    <div key={player.rank} className={`top-player-card ${rankClass}`}>
                      <div className="top-player-rank">{rankIcon} #{player.rank}</div>
                      <div className="top-player-name">{player.name}</div>
                      <div className="top-player-score">Score: {player.score.toLocaleString()}</div>
                      <div className="top-player-role">{roleIcon}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Challengeable Characters Section */}
            <div className="challengeable-characters">
              <h3>⚔️ Challenge Opponents</h3>
              <div className="characters-grid">
                {challengeableCharacters.map((character) => (
                  <div key={character.id} className="character-card">
                    <div className="character-icon">{character.icon}</div>
                    <div className="character-name">{character.name}</div>
                    <div className="character-level">Level {character.level}</div>
                    <button
                      className="challenge-btn"
                      onClick={() => handleChallengeCharacter(character.name)}
                    >
                      Challenge
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        );

      case 'education':
        return (
          <>
            <div className="modal-header">
              <div className="building-icon">{building.icon}</div>
              <h2>{building.name}</h2>
              <p>Train to increase your capabilities</p>
            </div>
            <div className="modal-actions">
              <button className="modal-action-btn" onClick={handleEducationAction}>
                <span>🎓 Train (Increase Max XP)</span>
                <span className="cost">👑 200 CROWN</span>
              </button>
            </div>
          </>
        );

      case 'government':
        return (
          <>
            <div className="modal-header">
              <div className="building-icon">{building.icon}</div>
              <h2>{building.name}</h2>
              <p>Pay your taxes</p>
            </div>
            <div className="modal-actions">
              <button className="modal-action-btn" onClick={handleGovernmentAction}>
                <span>💰 Pay Random Tax</span>
                <span className="cost">👑 50-150 CROWN</span>
              </button>
            </div>
          </>
        );

      case 'airport':
        return (
          <>
            <div className="modal-header">
              <div className="building-icon">{building.icon}</div>
              <h2>{building.name}</h2>
              <p>Travel to another district</p>
            </div>
            <div className="modal-actions">
              {gameState.gameState.districts
                .filter(d => d.id !== currentDistrict.id)
                .map(district => (
                  <button
                    key={district.id}
                    className="modal-action-btn"
                    onClick={() => handleAirportAction(district.id)}
                  >
                    <span>✈️ {district.name}</span>
                    <span className="cost">👑 100 CROWN</span>
                  </button>
                ))}
            </div>
          </>
        );

      default:
        return <div>Unknown building type</div>;
    }
  };

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="modal active" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content building-modal">
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
        {renderContent()}
      </div>
    </div>
  );
}

