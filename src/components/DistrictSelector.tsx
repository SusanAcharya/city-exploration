import { useGameState } from '../hooks/useGameState';
import './DistrictSelector.css';

interface DistrictSelectorProps {
  gameState: ReturnType<typeof useGameState>;
  onClose: () => void;
  addEventLog: (message: string, type?: string) => void;
}

export default function DistrictSelector({
  gameState,
  onClose,
  addEventLog,
}: DistrictSelectorProps) {
  const { districts, currentDistrict } = gameState.gameState;

  const handleTravel = (districtId: number) => {
    if (districtId === currentDistrict.id) {
      addEventLog('You are already in this district!', 'warning');
      return;
    }

    // Find airport building to travel
    const airport = currentDistrict.buildings.find(b => b.type === 'airport');
    if (!airport) {
      addEventLog('You must be at an Airport to travel!', 'danger');
      onClose();
      return;
    }

    const cost = 100;
    if (gameState.gameState.player.crown < cost) {
      addEventLog('Not enough CROWN!', 'danger');
      onClose();
      return;
    }

    gameState.travelToDistrict(districtId);
    gameState.updatePlayer({
      crown: gameState.gameState.player.crown - cost,
    });

    addEventLog(`Traveled to ${districts.find(d => d.id === districtId)?.name}!`, 'success');
    onClose();
  };

  return (
    <div className="modal active" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content district-selector">
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
        <div className="modal-header">
          <h2>🗺️ Select District</h2>
          <p>Choose a district to travel to</p>
        </div>
        <div className="districts-grid">
          {districts.map(district => (
            <div
              key={district.id}
              className={`district-card ${district.id === currentDistrict.id ? 'current' : ''}`}
              onClick={() => handleTravel(district.id)}
            >
              <h3>{district.name}</h3>
              <div className="district-info">
                <div className="stat-item">
                  <span>Crime:</span>
                  <span>{district.crime}%</span>
                </div>
                <div className="stat-item">
                  <span>Prosperity:</span>
                  <span>{district.prosperity}%</span>
                </div>
                <div className="stat-item">
                  <span>State:</span>
                  <span>{district.worldState}</span>
                </div>
              </div>
              {district.id === currentDistrict.id && (
                <div className="current-badge">Current</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

