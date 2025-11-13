import { GameState, Building } from '../types/game';
import { Assets } from '../data/assets';
import './GameMap.css';

interface GameMapProps {
  gameState: GameState;
  onBuildingClick: (building: Building) => void;
}

const MAP_WIDTH = 16;
const MAP_HEIGHT = 12;

export default function GameMap({ gameState, onBuildingClick }: GameMapProps) {
  const { player, currentDistrict } = gameState;

  const getPlayerNode = () => {
    if (!player.role) return <span>👤</span>;
    const sprite = Assets.characters[player.role];
    if (sprite) {
      return <img src={sprite} alt={player.role} />;
    }
    const emoji = Assets.roleIcons[player.role] || '👤';
    return <span>{emoji}</span>;
  };

  const getBuildingIcon = (building: Building) => {
    return building.icon;
  };

  return (
    <div className="map-container">
      <div className="map-header">
        <div className="map-controls">
          <span>🎮 Arrow Keys/WASD to Move | Enter/E to Interact</span>
        </div>
      </div>
      <div className="game-map">
        {Array.from({ length: MAP_HEIGHT }).map((_, y) =>
          Array.from({ length: MAP_WIDTH }).map((_, x) => {
            const building = currentDistrict.buildings.find(b => b.x === x && b.y === y);
            const isPlayer = player.position.x === x && player.position.y === y;

            return (
              <div
                key={`${x}-${y}`}
                className={`tile ${building ? 'building' : ''}`}
                style={{
                  backgroundImage: building
                    ? undefined
                    : `url(${Assets.tiles.grass})`,
                  backgroundSize: 'cover',
                }}
                onClick={() => building && onBuildingClick(building)}
                title={building?.name}
              >
                {building && (
                  <div className="building-sprite">
                    <span style={{ fontSize: '0.9em' }}>
                      {getBuildingIcon(building)}
                    </span>
                  </div>
                )}
                {isPlayer && (
                  <div className="player">
                    {getPlayerNode()}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      <div className="map-legend">
        <span>🏨 Hotel</span>
        <span>🏪 Shop</span>
        <span>🏥 Hospital</span>
        <span>🏟️ Arena</span>
        <span>🎓 Education</span>
        <span>🏛️ Government</span>
        <span>🏬 Commercial</span>
        <span>✈️ Airport</span>
      </div>
    </div>
  );
}

