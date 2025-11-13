import { District, RoleConfig, NFTRole, WorldState } from '../types/game';

export const DISTRICTS: District[] = [
  { id: 1, name: 'Downtown', crime: 45, prosperity: 60, worldState: 'Neutral', leaderboard: [], buildings: [] },
  { id: 2, name: 'Uptown', crime: 20, prosperity: 80, worldState: 'Neutral', leaderboard: [], buildings: [] },
  { id: 3, name: 'Industrial Zone', crime: 70, prosperity: 35, worldState: 'Neutral', leaderboard: [], buildings: [] },
  { id: 4, name: 'Waterfront', crime: 55, prosperity: 50, worldState: 'Neutral', leaderboard: [], buildings: [] },
  { id: 5, name: 'Suburbs', crime: 15, prosperity: 85, worldState: 'Neutral', leaderboard: [], buildings: [] },
  { id: 6, name: 'Financial District', crime: 30, prosperity: 75, worldState: 'Neutral', leaderboard: [], buildings: [] },
  { id: 7, name: 'Old Town', crime: 60, prosperity: 40, worldState: 'Neutral', leaderboard: [], buildings: [] },
  { id: 8, name: 'Tech Park', crime: 25, prosperity: 70, worldState: 'Neutral', leaderboard: [], buildings: [] },
  { id: 9, name: 'Harbor District', crime: 50, prosperity: 55, worldState: 'Neutral', leaderboard: [], buildings: [] },
];

export const ROLE_CONFIGS: Record<NFTRole, RoleConfig> = {
  gangster: {
    icon: '🔫',
    badge: '🔫 Gangster',
    actions: [
      { id: 'extort', name: 'Extort', energyCost: 10 },
      { id: 'smuggle', name: 'Smuggle', energyCost: 15 },
      { id: 'bribe', name: 'Bribe', energyCost: 8 },
    ],
    perks: [
      { id: 'raider_bonus', name: 'Raider Bonus', description: '+25% CROWN gain from offensive wins', active: true },
      { id: 'black_market', name: 'Black Market Access', description: 'Discount on weapon/item purchases', active: true },
      { id: 'wanted_status', name: 'Wanted Status', description: 'Resting costs +30% in hotels', active: true },
    ],
  },
  detective: {
    icon: '👮',
    badge: '👮 Detective',
    actions: [
      { id: 'patrol', name: 'Patrol', energyCost: 8 },
      { id: 'confiscate', name: 'Confiscate', energyCost: 12 },
      { id: 'report', name: 'Report', energyCost: 10 },
    ],
    perks: [
      { id: 'law_bonus', name: 'Law Bonus', description: '+20% EMZ gain from defensive wins', active: true },
      { id: 'crime_tracker', name: 'Crime Tracker', description: 'Bonus EMZ when defeating Gangsters', active: true },
      { id: 'efficient_rest', name: 'Efficient Rest', description: 'Hotels cost less EMZ', active: true },
    ],
  },
  civilian: {
    icon: '👔',
    badge: '👔 Civilian',
    actions: [
      { id: 'trade', name: 'Trade', energyCost: 5 },
      { id: 'invest', name: 'Invest', energyCost: 20 },
      { id: 'adapt', name: 'Adapt', energyCost: 7 },
    ],
    perks: [
      { id: 'market_sense', name: 'Market Sense', description: '15% discount in shops during Neutral state', active: true },
      { id: 'entrepreneur', name: 'Entrepreneur Bonus', description: '+10% extra EMZ from land activity', active: true },
      { id: 'negotiator', name: 'Negotiator', description: '10% reduced fee when converting CROWN ↔ EMZ', active: true },
    ],
  },
};

export const BUILDING_TYPES = {
  hotel: { icon: '🏨', name: 'Hotel', type: 'Residential' },
  shop: { icon: '🏪', name: 'Shop', type: 'Industrial' },
  hospital: { icon: '🏥', name: 'Hospital', type: 'Health' },
  arena: { icon: '🏟️', name: 'Arena', type: 'Recreation' },
  education: { icon: '🎓', name: 'Education Center', type: 'Education' },
  government: { icon: '🏛️', name: 'Government', type: 'Government' },
  commercial: { icon: '🏬', name: 'Commercial', type: 'Commercial' },
  airport: { icon: '✈️', name: 'Airport', type: 'Airport' },
};

export const INITIAL_BUILDINGS = [
  { type: 'hotel' as const, icon: '🏨', x: 2, y: 2, name: 'Grand Hotel' },
  { type: 'shop' as const, icon: '🏪', x: 13, y: 2, name: 'Black Market' },
  { type: 'hospital' as const, icon: '🏥', x: 2, y: 9, name: 'City Hospital' },
  { type: 'arena' as const, icon: '🏟️', x: 13, y: 9, name: 'Combat Arena' },
  { type: 'education' as const, icon: '🎓', x: 7, y: 5, name: 'Training Center' },
  { type: 'government' as const, icon: '🏛️', x: 8, y: 2, name: 'City Hall' },
  { type: 'commercial' as const, icon: '🏬', x: 8, y: 8, name: 'Shopping Mall' },
  { type: 'airport' as const, icon: '✈️', x: 8, y: 11, name: 'Transit Station' },
];

export const BADGES = {
  DEFEAT_GANGSTER: { id: 'defeat_gangster', name: 'Gangster Defeated', icon: '🔫' },
  DEFEAT_DETECTIVE: { id: 'defeat_detective', name: 'Detective Defeated', icon: '👮' },
  ARENA_TOP: { id: 'arena_top', name: 'Arena Champion', icon: '🏆' },
  DISTRICT_DOMINATION: { id: 'district_domination', name: 'District Domination', icon: '👑' },
};

export const SEASON_PASS_PRICE = 5; // SUI (in game, we'll use CROWN equivalent)

export function calculateWorldState(districts: District[]): WorldState {
  // Count top 10 players across all districts by role
  const roleCounts: Record<string, number> = { gangster: 0, detective: 0, civilian: 0 };
  
  districts.forEach(district => {
    district.leaderboard.slice(0, 10).forEach(leader => {
      roleCounts[leader.role]++;
    });
  });
  
  const total = roleCounts.gangster + roleCounts.detective + roleCounts.civilian;
  if (total === 0) return 'Neutral';
  
  const gangsterPct = roleCounts.gangster / total;
  const detectivePct = roleCounts.detective / total;
  
  if (gangsterPct > 0.5) return 'Crime Hub';
  if (detectivePct > 0.5) return 'Lawful City';
  return 'Neutral';
}

