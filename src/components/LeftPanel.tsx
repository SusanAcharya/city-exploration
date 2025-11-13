import { useGameState } from '../hooks/useGameState';
import { ROLE_CONFIGS } from '../data/gameData';
import './LeftPanel.css';

interface LeftPanelProps {
  gameState: ReturnType<typeof useGameState>;
  addEventLog: (message: string, type?: string) => void;
}

export default function LeftPanel({ gameState, addEventLog }: LeftPanelProps) {
  const { player, currentDistrict } = gameState.gameState;
  const roleConfig = player.role ? ROLE_CONFIGS[player.role] : null;

  const performAction = (actionId: string) => {
    if (!player.role || !roleConfig) return;

    const action = roleConfig.actions.find(a => a.id === actionId);
    if (!action) return;

    if (player.energy < action.energyCost) {
      addEventLog('Not enough energy!', 'danger');
      return;
    }

    gameState.updatePlayer({
      energy: player.energy - action.energyCost,
    });

    // Calculate rewards based on role and action
    let reward = 0;
    let xp = 0;
    let message = '';

    if (player.role === 'gangster') {
      switch (actionId) {
        case 'extort':
          reward = Math.floor(Math.random() * 100) + 50;
          xp = 15;
          message = `Extorted ${reward} CROWN from a local business!`;
          gameState.updateDistrict(currentDistrict.id, {
            crime: Math.min(100, currentDistrict.crime + 5),
          });
          break;
        case 'smuggle':
          reward = Math.floor(Math.random() * 200) + 100;
          xp = 25;
          message = `Smuggled goods successfully! Earned ${reward} CROWN!`;
          gameState.updateDistrict(currentDistrict.id, {
            crime: Math.min(100, currentDistrict.crime + 7),
            prosperity: Math.max(0, currentDistrict.prosperity - 3),
          });
          break;
        case 'bribe':
          reward = Math.floor(Math.random() * 80) + 30;
          xp = 10;
          message = `Bribed an official for ${reward} CROWN in benefits!`;
          gameState.updateDistrict(currentDistrict.id, {
            crime: Math.min(100, currentDistrict.crime + 3),
          });
          break;
      }
    } else if (player.role === 'detective') {
      switch (actionId) {
        case 'patrol':
          reward = Math.floor(Math.random() * 70) + 40;
          xp = 12;
          message = `Patrol successful! Earned ${reward} CROWN!`;
          gameState.updateDistrict(currentDistrict.id, {
            crime: Math.max(0, currentDistrict.crime - 4),
            prosperity: Math.min(100, currentDistrict.prosperity + 2),
          });
          break;
        case 'confiscate':
          reward = Math.floor(Math.random() * 150) + 80;
          xp = 20;
          message = `Confiscated illegal goods! Earned ${reward} CROWN!`;
          gameState.updateDistrict(currentDistrict.id, {
            crime: Math.max(0, currentDistrict.crime - 6),
          });
          break;
        case 'report':
          reward = Math.floor(Math.random() * 100) + 50;
          xp = 15;
          message = `Filed crime report. Earned ${reward} CROWN!`;
          gameState.updateDistrict(currentDistrict.id, {
            crime: Math.max(0, currentDistrict.crime - 3),
            prosperity: Math.min(100, currentDistrict.prosperity + 3),
          });
          break;
      }
    } else if (player.role === 'civilian') {
      switch (actionId) {
        case 'trade':
          reward = Math.floor(Math.random() * 60) + 30;
          xp = 8;
          message = `Completed trade! Earned ${reward} CROWN!`;
          gameState.updateDistrict(currentDistrict.id, {
            prosperity: Math.min(100, currentDistrict.prosperity + 4),
          });
          break;
        case 'invest':
          reward = Math.floor(Math.random() * 300) + 150;
          xp = 30;
          message = `Investment paid off! Earned ${reward} CROWN!`;
          gameState.updateDistrict(currentDistrict.id, {
            prosperity: Math.min(100, currentDistrict.prosperity + 8),
          });
          break;
        case 'adapt':
          reward = Math.floor(Math.random() * 80) + 40;
          xp = 12;
          message = `Adapted to market conditions! Earned ${reward} CROWN!`;
          gameState.updateDistrict(currentDistrict.id, {
            prosperity: Math.min(100, currentDistrict.prosperity + 3),
          });
          break;
      }
    }

    gameState.updatePlayer({
      crown: player.crown + reward,
      xp: player.xp + xp,
      influence: player.influence + Math.floor(xp / 5),
    });

    addEventLog(message, 'success');

    // Check for level up
    if (player.xp + xp >= player.maxXp) {
      gameState.updatePlayer({
        xp: (player.xp + xp) - player.maxXp,
        maxXp: player.maxXp + 20,
        maxHealth: player.maxHealth + 10,
        health: player.maxHealth + 10,
        maxEnergy: player.maxEnergy + 5,
        energy: player.maxEnergy + 5,
      });
      addEventLog('🎉 LEVEL UP! Stats increased!', 'success');
    }
  };

  return (
    <div className="left-panel">
      <div className="panel district-panel">
        <h3>📍 DISTRICT: {currentDistrict.name}</h3>
        <div className="district-stats">
          <div className="stat-row">
            <span className="stat-label">Crime Index</span>
            <div className="stat-bar">
              <div
                className="stat-fill crime"
                style={{ width: `${currentDistrict.crime}%` }}
              />
            </div>
            <span className="stat-value">{currentDistrict.crime}%</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Prosperity</span>
            <div className="stat-bar">
              <div
                className="stat-fill prosperity"
                style={{ width: `${currentDistrict.prosperity}%` }}
              />
            </div>
            <span className="stat-value">{currentDistrict.prosperity}%</span>
          </div>
        </div>
      </div>

      <div className="panel player-stats-panel">
        <h3>⚡ PLAYER STATS</h3>
        <div className="player-stats">
          <div className="stat-item">
            <span>❤️ Health:</span>
            <span>{player.health}/{player.maxHealth}</span>
          </div>
          <div className="stat-item">
            <span>⚡ Energy:</span>
            <span>{player.energy}/{player.maxEnergy}</span>
          </div>
          <div className="stat-item">
            <span>⭐ XP:</span>
            <span>{player.xp}/{player.maxXp}</span>
          </div>
          <div className="stat-item">
            <span>🎯 Influence:</span>
            <span>{player.influence}</span>
          </div>
          {player.emz > 0 && (
            <div className="stat-item">
              <span>💎 EMZ:</span>
              <span>{player.emz}</span>
            </div>
          )}
        </div>
      </div>

      {roleConfig && (
        <div className="panel actions-panel">
          <h3>🎮 QUICK ACTIONS</h3>
          <div className="action-buttons">
            {roleConfig.actions.map(action => (
              <button
                key={action.id}
                className="action-btn"
                onClick={() => performAction(action.id)}
                disabled={player.energy < action.energyCost}
              >
                {action.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

