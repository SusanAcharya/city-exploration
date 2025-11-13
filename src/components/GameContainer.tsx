import { useEffect, useState } from 'react';
import { useGameState } from '../hooks/useGameState';
import TopBar from './TopBar';
import LeftPanel from './LeftPanel';
import GameMap from './GameMap';
import RightPanel from './RightPanel';
import BuildingModal from './BuildingModal';
import DistrictSelector from './DistrictSelector';
import SeasonPassModal from './SeasonPassModal';
import { Building } from '../types/game';

interface GameContainerProps {
  gameState: ReturnType<typeof useGameState>;
}

export default function GameContainer({ gameState }: GameContainerProps) {
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [showDistrictSelector, setShowDistrictSelector] = useState(false);
  const [showSeasonPass, setShowSeasonPass] = useState(false);
  const [eventLog, setEventLog] = useState<Array<{ message: string; type: string }>>([
    { message: 'Game started!', type: '' },
  ]);

  const addEventLog = (message: string, type: string = '') => {
    setEventLog(prev => [{ message, type }, ...prev.slice(0, 9)]);
  };

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedBuilding || showDistrictSelector || showSeasonPass) {
        // Handle interaction keys even when modals are open (to close them)
        if (e.key === 'Escape') {
          if (selectedBuilding) setSelectedBuilding(null);
          if (showDistrictSelector) setShowDistrictSelector(false);
          if (showSeasonPass) setShowSeasonPass(false);
        }
        return;
      }

      const { player, currentDistrict } = gameState.gameState;

      // Check for building interaction (Enter or E)
      if (e.key === 'Enter' || e.key === 'e' || e.key === 'E') {
        const building = currentDistrict.buildings.find(
          b => b.x === player.position.x && b.y === player.position.y
        );
        if (building) {
          e.preventDefault();
          setSelectedBuilding(building);
          return;
        }
      }

      // Movement controls
      let newX = player.position.x;
      let newY = player.position.y;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          newY = Math.max(0, newY - 1);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          newY = Math.min(11, newY + 1);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          newX = Math.max(0, newX - 1);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          newX = Math.min(15, newX + 1);
          break;
        default:
          return;
      }

      e.preventDefault();
      gameState.movePlayer(newX, newY);

      // Check for building after movement
      const building = currentDistrict.buildings.find(
        b => b.x === newX && b.y === newY
      );
      if (building) {
        addEventLog(`You arrived at ${building.name}. Press Enter or E to interact!`, 'warning');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, selectedBuilding, showDistrictSelector, showSeasonPass]);

  const handleBuildingClick = (building: Building) => {
    setSelectedBuilding(building);
  };

  const closeModal = () => {
    setSelectedBuilding(null);
  };

  return (
    <div className="game-container">
      <TopBar
        gameState={gameState.gameState}
        onShowSeasonPass={() => setShowSeasonPass(true)}
        onShowDistricts={() => setShowDistrictSelector(true)}
      />
      <div className="main-game">
        <LeftPanel gameState={gameState} addEventLog={addEventLog} />
        <GameMap
          gameState={gameState.gameState}
          onBuildingClick={handleBuildingClick}
        />
        <RightPanel gameState={gameState.gameState} eventLog={eventLog} />
      </div>
      {selectedBuilding && (
        <BuildingModal
          building={selectedBuilding}
          gameState={gameState}
          onClose={closeModal}
          addEventLog={addEventLog}
        />
      )}
      {showDistrictSelector && (
        <DistrictSelector
          gameState={gameState}
          onClose={() => setShowDistrictSelector(false)}
          addEventLog={addEventLog}
        />
      )}
      {showSeasonPass && (
        <SeasonPassModal
          gameState={gameState}
          onClose={() => setShowSeasonPass(false)}
          addEventLog={addEventLog}
        />
      )}
    </div>
  );
}

