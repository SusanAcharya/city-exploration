import { useState } from 'react';
import { useGameState } from './hooks/useGameState';
import RoleSelection from './components/RoleSelection';
import GameContainer from './components/GameContainer';
import './App.css';

function App() {
  const gameState = useGameState();
  const [showRoleSelection, setShowRoleSelection] = useState(!gameState.gameState.player.role);

  const handleRoleSelect = (role: 'gangster' | 'detective' | 'civilian') => {
    gameState.selectRole(role);
    setShowRoleSelection(false);
  };

  return (
    <div className="app">
      {showRoleSelection ? (
        <RoleSelection onSelectRole={handleRoleSelect} />
      ) : (
        <GameContainer gameState={gameState} />
      )}
    </div>
  );
}

export default App;

