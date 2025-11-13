import { useState, useEffect, useCallback } from 'react';
import { GameState, Player, District, NFTRole } from '../types/game';
import { DISTRICTS, INITIAL_BUILDINGS, calculateWorldState } from '../data/gameData';

const MAP_WIDTH = 16;
const MAP_HEIGHT = 12;

function initializeGameState(): GameState {
  const districts = DISTRICTS.map(district => ({
    ...district,
    buildings: INITIAL_BUILDINGS.map(b => ({ ...b })),
  }));

  const player: Player = {
    role: null,
    crown: 1000,
    emz: 0,
    health: 100,
    maxHealth: 100,
    energy: 100,
    maxEnergy: 50,
    xp: 0,
    maxXp: 100,
    influence: 0,
    position: { x: 8, y: 6 },
    inventory: [
      { id: 'pistol', icon: '🔫', name: 'Pistol', type: 'weapon' },
      { id: 'medkit', icon: '💊', name: 'Med Kit', type: 'item' },
    ],
    districtId: 1,
    badges: [],
    seasonPassActive: false,
  };

  return {
    player,
    currentDistrict: districts[0],
    districts,
    seasonalLeaderboard: [],
    worldState: 'Neutral',
    worldStateLastUpdate: new Date(),
    seasonPassPrice: 5,
    seasonalRewardPool: 0,
  };
}

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(initializeGameState);

  // Update world state every 24 hours
  useEffect(() => {
    const updateWorldState = () => {
      setGameState(prev => {
        const newWorldState = calculateWorldState(prev.districts);
        return {
          ...prev,
          worldState: newWorldState,
          worldStateLastUpdate: new Date(),
        };
      });
    };

    // Check every hour if 24 hours have passed
    const interval = setInterval(() => {
      const now = new Date();
      const lastUpdate = gameState.worldStateLastUpdate;
      const hoursSinceUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceUpdate >= 24) {
        updateWorldState();
      }
    }, 60 * 60 * 1000); // Check every hour

    return () => clearInterval(interval);
  }, [gameState.worldStateLastUpdate]);

  const selectRole = useCallback((role: NFTRole) => {
    setGameState(prev => ({
      ...prev,
      player: { ...prev.player, role },
    }));
  }, []);

  const movePlayer = useCallback((newX: number, newY: number) => {
    setGameState(prev => {
      if (prev.player.energy <= 0) return prev;

      const clampedX = Math.max(0, Math.min(MAP_WIDTH - 1, newX));
      const clampedY = Math.max(0, Math.min(MAP_HEIGHT - 1, newY));

      return {
        ...prev,
        player: {
          ...prev.player,
          position: { x: clampedX, y: clampedY },
          energy: Math.max(0, prev.player.energy - 1),
        },
      };
    });
  }, []);

  const updatePlayer = useCallback((updates: Partial<Player>) => {
    setGameState(prev => ({
      ...prev,
      player: { ...prev.player, ...updates },
    }));
  }, []);

  const updateDistrict = useCallback((districtId: number, updates: Partial<District>) => {
    setGameState(prev => {
      const updatedDistricts = prev.districts.map(d =>
        d.id === districtId ? { ...d, ...updates } : d
      );
      
      const currentDistrict = updatedDistricts.find(d => d.id === prev.currentDistrict.id) || prev.currentDistrict;

      return {
        ...prev,
        districts: updatedDistricts,
        currentDistrict,
      };
    });
  }, []);

  const travelToDistrict = useCallback((districtId: number) => {
    setGameState(prev => {
      const targetDistrict = prev.districts.find(d => d.id === districtId);
      if (!targetDistrict) return prev;

      return {
        ...prev,
        player: {
          ...prev.player,
          districtId,
          position: { x: 8, y: 6 }, // Reset position in new district
        },
        currentDistrict: targetDistrict,
      };
    });
  }, []);

  const purchaseSeasonPass = useCallback(() => {
    setGameState(prev => {
      if (prev.player.crown < prev.seasonPassPrice) return prev;

      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 30); // 30 day season

      return {
        ...prev,
        player: {
          ...prev.player,
          crown: prev.player.crown - prev.seasonPassPrice,
          seasonPassActive: true,
          seasonPassExpiry: expiry,
        },
        seasonalRewardPool: prev.seasonalRewardPool + (prev.seasonPassPrice * 0.8), // 80% to pool
      };
    });
  }, []);

  return {
    gameState,
    selectRole,
    movePlayer,
    updatePlayer,
    updateDistrict,
    travelToDistrict,
    purchaseSeasonPass,
  };
}

