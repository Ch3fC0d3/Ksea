/**
 * NFT Generator Utility
 * 
 * This utility provides functions to generate deterministic colors for NFTs
 * based on input seeds. This ensures that the same inputs will always
 * produce the same color scheme, making the NFT appearance predictable.
 */

// Simple hash function to generate a numeric value from a string
const simpleHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

// Generate a deterministic color based on a seed
const generateColor = (seed, index) => {
  const hash = simpleHash(seed + index.toString());
  const h = hash % 360;
  const s = 70 + (hash % 30); // 70-100%
  const l = 40 + (hash % 30); // 40-70%
  return `hsl(${h}, ${s}%, ${l}%)`;
};

// Generate a deterministic NFT color scheme based on a seed
export const generateDeterministicNFT = (seed) => {
  const hash = simpleHash(seed);
  
  // Generate primary and secondary colors
  const primaryColor = generateColor(seed, 1);
  const secondaryColor = generateColor(seed, 2);
  const accentColor = generateColor(seed, 3);
  
  // Generate a unique name based on the colors
  const namePrefix = ['Cosmic', 'Geometric', 'Digital', 'Quantum', 'Prismatic'][hash % 5];
  const nameSuffix = ['Vision', 'Dream', 'Harmony', 'Essence', 'Dimension'][simpleHash(seed + 'name') % 5];
  const nameNumber = (hash % 1000) + 1;
  const name = `${namePrefix} ${nameSuffix} #${nameNumber}`;
  
  // Generate attributes focusing on colors
  const attributes = [
    { trait_type: 'Primary Color', value: `Hue ${Math.round(simpleHash(primaryColor) % 360)}` },
    { trait_type: 'Secondary Color', value: `Hue ${Math.round(simpleHash(secondaryColor) % 360)}` },
    { trait_type: 'Accent Color', value: `Hue ${Math.round(simpleHash(accentColor) % 360)}` },
    { trait_type: 'Rarity', value: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'][hash % 5] }
  ];
  
  // Return the simplified NFT data with just color information
  return {
    name,
    description: `A deterministic NFT with a unique color scheme.`,
    image: '', // This would be generated or set later
    attributes,
    design: {
      primaryColor,
      secondaryColor,
      accentColor
    }
  };
};

// Generate a deterministic CSS color scheme based on NFT data
export const generateCSS = (nftData) => {
  const { design } = nftData;
  
  // Return just the color properties
  return {
    backgroundColor: design.primaryColor,
    borderColor: design.secondaryColor,
    accentColor: design.accentColor
  };
};
