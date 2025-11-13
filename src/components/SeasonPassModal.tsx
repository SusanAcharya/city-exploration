import { useGameState } from '../hooks/useGameState';
import './SeasonPassModal.css';

interface SeasonPassModalProps {
  gameState: ReturnType<typeof useGameState>;
  onClose: () => void;
  addEventLog: (message: string, type?: string) => void;
}

export default function SeasonPassModal({
  gameState,
  onClose,
  addEventLog,
}: SeasonPassModalProps) {
  const { player, seasonalLeaderboard, seasonPassPrice, seasonalRewardPool } = gameState.gameState;

  const handlePurchase = () => {
    if (player.seasonPassActive) {
      addEventLog('You already have an active Season Pass!', 'warning');
      onClose();
      return;
    }

    if (player.crown < seasonPassPrice) {
      addEventLog('Not enough CROWN!', 'danger');
      onClose();
      return;
    }

    gameState.purchaseSeasonPass();
    addEventLog('Season Pass purchased! You are now eligible for seasonal rewards!', 'success');
    onClose();
  };

  return (
    <div className="modal active" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content season-pass-modal">
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
        <div className="modal-header">
          <h2>🎫 Season Pass</h2>
          <p>Unlock seasonal rewards and leaderboard access</p>
        </div>
        <div className="season-pass-content">
          <div className="season-pass-benefits">
            <h3>Benefits:</h3>
            <ul>
              <li>✅ Entry into Seasonal Leaderboard</li>
              <li>✅ CROWN bundle included</li>
              <li>✅ Access to seasonal rewards</li>
              <li>✅ Top 10 players win SUI rewards</li>
            </ul>
          </div>
          <div className="season-pass-info">
            <div className="info-item">
              <span>Price:</span>
              <span className="price">👑 {seasonPassPrice} CROWN</span>
            </div>
            <div className="info-item">
              <span>Reward Pool:</span>
              <span className="pool">👑 {seasonalRewardPool.toFixed(0)} CROWN</span>
            </div>
            {player.seasonPassActive && (
              <div className="active-badge">
                ✅ Season Pass Active
              </div>
            )}
          </div>
          {seasonalLeaderboard.length > 0 && (
            <div className="seasonal-leaderboard">
              <h3>🏆 Seasonal Leaderboard</h3>
              <div className="leaderboard">
                {seasonalLeaderboard.slice(0, 10).map((leader, i) => (
                  <div key={i} className={`leader-item ${leader.rank <= 3 ? `rank-${leader.rank}` : ''}`}>
                    <span className="rank">
                      {leader.rank === 1 ? '🥇' : leader.rank === 2 ? '🥈' : leader.rank === 3 ? '🥉' : `#${leader.rank}`}
                    </span>
                    <span className="name">{leader.name}</span>
                    <span className="score">{leader.score}</span>
                    <span className="districts">({leader.districtsHeld} districts)</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {!player.seasonPassActive && (
            <button className="purchase-btn" onClick={handlePurchase}>
              Purchase Season Pass
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

