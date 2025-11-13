import gangsterImg from '../../assets/characters/gangster.png';
import detectiveImg from '../../assets/characters/detective.png';
import civilianImg from '../../assets/characters/civilian.png';

export const Assets = {
  characters: {
    // Swap mappings to match actual image contents
    gangster: detectiveImg,
    detective: gangsterImg,
    civilian: civilianImg,
  },
  buildings: {
    hotel: '/assets/buildings/hotel.png',
    shop: '/assets/buildings/shop.png',
    hospital: '/assets/buildings/hospital.png',
    arena: '/assets/buildings/arena.png',
    education: null,
    government: null,
    commercial: null,
    airport: null,
  },
  tiles: {
    grass: '/assets/tiles/grass-tile.png',
    road: '/assets/tiles/road-tile.png',
    sidewalk: '/assets/tiles/sidewalk.png',
  },
  roleIcons: {
    gangster: '🔫',
    detective: '👮',
    civilian: '👔',
  },
};

// Helper to check if asset exists, fallback to emoji
export function getAssetOrEmoji(path: string | null, emoji: string): string {
  return path || emoji;
}

