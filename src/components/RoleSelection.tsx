import { NFTRole } from '../types/game';
import { ROLE_CONFIGS } from '../data/gameData';
import { Assets } from '../data/assets';
import './RoleSelection.css';

interface RoleSelectionProps {
  onSelectRole: (role: NFTRole) => void;
}

export default function RoleSelection({ onSelectRole }: RoleSelectionProps) {
  return (
    <div className="role-selection-modal active">
      <div className="modal-content role-select">
        <h1>🏙️ EMERALD CITY: DISTRICT HUSTLE</h1>
        <h2>Choose Your Role</h2>
        <div className="role-cards">
          {(['gangster', 'detective', 'civilian'] as NFTRole[]).map(role => {
            const config = ROLE_CONFIGS[role];
            const sprite = Assets.characters[role];
            return (
              <div
                key={role}
                className="role-card"
                onClick={() => onSelectRole(role)}
              >
                {sprite ? (
                  <img className="role-sprite" src={sprite} alt={role} />
                ) : (
                  <div className="role-icon">{config.icon}</div>
                )}
                <h3>{role.toUpperCase()}</h3>
                <p>{role === 'gangster' ? 'Profit through chaos' : role === 'detective' ? 'Control and profit from law' : 'Build and invest'}</p>
                <ul>
                  {config.actions.map(action => (
                    <li key={action.id}>{action.name}</li>
                  ))}
                </ul>
                <span className="playstyle">
                  {role === 'gangster' ? 'High-risk, high-reward' : role === 'detective' ? 'Tactical, control-based' : 'Balanced, economy-driven'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

