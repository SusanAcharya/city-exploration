import { GameState } from '../types/game';
import { ROLE_CONFIGS } from '../data/gameData';
import './TopBar.css';

interface TopBarProps {
  gameState: GameState;
  onShowSeasonPass: () => void;
  onShowDistricts: () => void;
}

export default function TopBar({ gameState, onShowSeasonPass, onShowDistricts }: TopBarProps) {
  const { player, worldState } = gameState;
  const roleConfig = player.role ? ROLE_CONFIGS[player.role] : null;

  const getWorldStateClass = () => {
    if (worldState === 'Crime Hub') return 'crime-hub';
    if (worldState === 'Lawful City') return 'lawful-city';
    return '';
  };

  return (
    <div className="top-bar">
      <div className="player-info">
        {roleConfig && (
          <span className={`role-badge ${player.role}`}>
            {roleConfig.badge}
          </span>
        )}
        <span className="player-name">Player #001</span>
        <button className="season-pass-btn" onClick={onShowSeasonPass}>
          {player.seasonPassActive ? '✅ Season Pass' : '🎫 Buy Season Pass'}
        </button>
      </div>
      <div className={`world-state-badge ${getWorldStateClass()}`}>
        <span>🌍 {worldState}</span>
      </div>
      <div className="crown-balance">
        <span className="crown-icon">👑</span>
        <span>{player.crown}</span>
        <span className="crown-label">CROWN</span>
      </div>
      <button className="district-selector-btn" onClick={onShowDistricts}>
        🗺️ Districts
      </button>
    </div>
  );
}

