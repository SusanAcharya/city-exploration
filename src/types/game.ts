export type NFTRole = 'gangster' | 'detective' | 'civilian';

export type WorldState = 'Crime Hub' | 'Lawful City' | 'Neutral';

export type BuildingType = 
  | 'hotel'      // Residential
  | 'shop'       // Industrial
  | 'hospital'   // Health
  | 'arena'      // Recreation
  | 'education'  // Education
  | 'government' // Government
  | 'commercial' // Commercial
  | 'airport';   // Airport

export interface Position {
  x: number;
  y: number;
}

export interface Building {
  type: BuildingType;
  icon: string;
  x: number;
  y: number;
  name: string;
  owner?: string;
}

export interface Player {
  role: NFTRole | null;
  crown: number;
  emz: number; // EMZ token (mentioned in perks)
  health: number;
  maxHealth: number;
  energy: number;
  maxEnergy: number;
  xp: number;
  maxXp: number;
  influence: number;
  position: Position;
  inventory: InventoryItem[];
  districtId: number;
  badges: string[];
  arenaRank?: number;
  seasonPassActive: boolean;
  seasonPassExpiry?: Date;
}

export interface InventoryItem {
  id: string;
  icon: string;
  name: string;
  type?: 'weapon' | 'item' | 'perk';
}

export interface District {
  id: number;
  name: string;
  crime: number;
  prosperity: number;
  worldState: WorldState;
  leaderboard: DistrictLeader[];
  buildings: Building[];
}

export interface DistrictLeader {
  name: string;
  score: number;
  rank: number;
  role: NFTRole;
  nftId?: string;
}

export interface SeasonalLeader {
  name: string;
  score: number;
  rank: number;
  role: NFTRole;
  districtsHeld: number;
}

export interface GameState {
  player: Player;
  currentDistrict: District;
  districts: District[];
  seasonalLeaderboard: SeasonalLeader[];
  worldState: WorldState;
  worldStateLastUpdate: Date;
  seasonPassPrice: number; // 5 SUI
  seasonalRewardPool: number;
}

export interface RoleConfig {
  icon: string;
  badge: string;
  actions: RoleAction[];
  perks: RolePerk[];
}

export interface RoleAction {
  id: string;
  name: string;
  energyCost: number;
}

export interface RolePerk {
  id: string;
  name: string;
  description: string;
  active: boolean;
}

