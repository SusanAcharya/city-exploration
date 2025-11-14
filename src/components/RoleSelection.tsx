import { NFTRole } from '../types/game';
import { ROLE_CONFIGS } from '../data/gameData';
import { Assets } from '../data/assets';
import './RoleSelection.css';

interface RoleSelectionProps {
  onSelectRole: (role: NFTRole) => void;
}

export default function RoleSelection({ onSelectRole }: RoleSelectionProps) {
  const roleInfo = {
    gangster: {
      idNumber: 'EC-G-001',
      classification: 'HIGH RISK',
      specialty: 'Raider Operations',
      accentColor: '#ff6a6a',
    },
    detective: {
      idNumber: 'EC-D-001',
      classification: 'LAW ENFORCEMENT',
      specialty: 'Crime Investigation',
      accentColor: '#4dabf7',
    },
    civilian: {
      idNumber: 'EC-C-001',
      classification: 'CIVILIAN',
      specialty: 'Business Operations',
      accentColor: '#6bff6b',
    },
  };

  return (
    <div className="role-selection-modal active">
      <div className="role-select-background">
        <div className="role-select-header">
          <h1>EMERALD CITY</h1>
          <h2>DISTRICT HUSTLE</h2>
          <p className="subtitle">SELECT YOUR IDENTITY</p>
        </div>
        <div className="role-cards">
          {(['gangster', 'detective', 'civilian'] as NFTRole[]).map(role => {
            const config = ROLE_CONFIGS[role];
            const sprite = Assets.characters[role];
            const info = roleInfo[role];
            return (
              <div
                key={role}
                className={`role-id-card role-id-card-${role}`}
                onClick={() => onSelectRole(role)}
                style={{ '--accent-color': info.accentColor } as React.CSSProperties}
              >
                <div className="id-card-header">
                  <div className="id-card-logo">EC</div>
                  <div className="id-card-title">EMERALD CITY ID</div>
                </div>
                <div className="id-card-body">
                  <div className="id-photo-section">
                    {sprite ? (
                      <img className="id-photo" src={sprite} alt={role} />
                    ) : (
                      <div className="id-photo-placeholder">{config.icon}</div>
                    )}
                    <div className="id-photo-label">PHOTO</div>
                  </div>
                  <div className="id-info-section">
                    <div className="id-field">
                      <span className="id-label">NAME:</span>
                      <span className="id-value">{role.toUpperCase()}</span>
                    </div>
                    <div className="id-field">
                      <span className="id-label">ID #:</span>
                      <span className="id-value">{info.idNumber}</span>
                    </div>
                    <div className="id-field">
                      <span className="id-label">CLASS:</span>
                      <span className="id-value">{info.classification}</span>
                    </div>
                    <div className="id-field">
                      <span className="id-label">SPECIALTY:</span>
                      <span className="id-value">{info.specialty}</span>
                    </div>
                    <div className="id-actions">
                      <div className="id-actions-label">CAPABILITIES:</div>
                      <div className="id-actions-list">
                        {config.actions.slice(0, 2).map(action => (
                          <span key={action.id} className="id-action-tag">{action.name}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="id-card-footer">
                  <div className="id-playstyle">{role === 'gangster' ? 'HIGH-RISK, HIGH-REWARD' : role === 'detective' ? 'TACTICAL, CONTROL-BASED' : 'BALANCED, ECONOMY-DRIVEN'}</div>
                  <div className="id-select-hint">CLICK TO SELECT</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

