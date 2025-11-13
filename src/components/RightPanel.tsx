import { GameState } from '../types/game';
import './RightPanel.css';

interface RightPanelProps {
  gameState: GameState;
  eventLog: Array<{ message: string; type: string }>;
}

export default function RightPanel({ gameState, eventLog }: RightPanelProps) {
  const { player, currentDistrict } = gameState;

  return (
    <div className="right-panel">
      <div className="panel inventory-panel">
        <h3>🎒 INVENTORY</h3>
        <div className="inventory-grid">
          {Array.from({ length: 4 }).map((_, i) => {
            const item = player.inventory[i];
            return (
              <div key={i} className={`inventory-slot ${!item ? 'empty' : ''}`}>
                {item && (
                  <>
                    <div className="item">{item.icon}</div>
                    <span>{item.name}</span>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="panel badges-panel">
        <h3>🏅 BADGES</h3>
        <div className="badges-list">
          {player.badges.length > 0 ? (
            player.badges.map((badge, i) => (
              <div key={i} className="badge-item">
                <span>{badge}</span>
              </div>
            ))
          ) : (
            <div className="no-badges">No badges yet</div>
          )}
        </div>
      </div>

      <div className="panel leaderboard-panel">
        <h3>🏆 DISTRICT LEADERBOARD</h3>
        <div className="leaderboard">
          {currentDistrict.leaderboard.length > 0 ? (
            currentDistrict.leaderboard.slice(0, 10).map((leader, i) => (
              <div
                key={i}
                className={`leader-item ${leader.rank <= 3 ? `rank-${leader.rank}` : ''}`}
              >
                <span className="rank">
                  {leader.rank === 1 ? '🥇' : leader.rank === 2 ? '🥈' : leader.rank === 3 ? '🥉' : `#${leader.rank}`}
                </span>
                <span className="name">{leader.name}</span>
                <span className="score">{leader.score}</span>
              </div>
            ))
          ) : (
            <div className="no-leaders">No leaders yet</div>
          )}
        </div>
      </div>

      <div className="panel event-log-panel">
        <h3>📜 EVENTS</h3>
        <div className="event-log">
          {eventLog.map((event, i) => (
            <div key={i} className={`event-item ${event.type}`}>
              {event.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

