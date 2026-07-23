export const OFFICIAL_MODEL_COLORS = {
  // 1. Mahindra XUV 3XO
  "xuv 3xo": ["Everest White", "Tango Red", "Nebula Blue", "Stealth Black", "Deep Forest"],
  
  // 2. Mahindra Bolero
  "bolero": ["Diamond White", "DSAT Silver", "Lakeside Brown"],
  
  // 3. Mahindra Thar
  "thar": ["Everest White", "Stealth Black", "Deep Grey", "Red Rage", "Aqua Marine"],
  
  // 4. Mahindra Scorpio Classic
  "scorpio classic": ["Pearl White", "Napoli Black", "Galaxy Grey", "Red Rage"],
  
  // 5. Mahindra Thar 4x4
  "thar 4x4": ["Everest White", "Stealth Black", "Deep Grey", "Red Rage", "Aqua Marine"],
  
  // 6. Mahindra BE 6
  "be 6": ["Arctic White", "Desert Myst", "Electric Blue", "Matte Grey", "Cosmic Black"],
  
  // 7. Kia Sonet Turbo
  "sonet turbo": ["Glacier White Pearl", "Aurora Black Pearl", "Imperial Blue", "Gravity Grey", "Intense Red"],
  "sonet": ["Glacier White Pearl", "Aurora Black Pearl", "Imperial Blue", "Gravity Grey", "Intense Red"],
  
  // 8. Kia Seltos X-Line
  "seltos x-line": ["Xclusive Matte Graphite", "Glacier White Pearl", "Aurora Black Pearl", "Gravity Grey"],
  "seltos": ["Xclusive Matte Graphite", "Glacier White Pearl", "Aurora Black Pearl", "Gravity Grey"],
  
  // 9. Kia Carens Luxury Plus
  "carens luxury plus": ["Imperial Blue", "Glacier White Pearl", "Sparkling Silver", "Aurora Black Pearl"],
  "carens": ["Imperial Blue", "Glacier White Pearl", "Sparkling Silver", "Aurora Black Pearl"],
  
  // 10. Kia Carnival Limousine
  "carnival limousine": ["Snow White Pearl", "Panthera Metal", "Aurora Black Pearl", "Ceramic Silver"],
  "carnival": ["Snow White Pearl", "Panthera Metal", "Aurora Black Pearl", "Ceramic Silver"],
  
  // 11. Kia EV6 GT-Line
  "ev6 gt-line": ["Snow White Pearl", "Yacht Blue Matte", "Runway Red", "Aurora Black Pearl", "Steel Matte Grey"],
  "ev6": ["Snow White Pearl", "Yacht Blue Matte", "Runway Red", "Aurora Black Pearl", "Steel Matte Grey"],
  
  // 12. Kia EV9 GT-Line
  "ev9 gt-line": ["Pebble Grey", "Panthera Metal", "Snow White Pearl", "Aurora Black Pearl", "Ocean Blue"],
  "ev9": ["Pebble Grey", "Panthera Metal", "Snow White Pearl", "Aurora Black Pearl", "Ocean Blue"],
  
  // 13. Hyundai Verna
  "verna": ["Atlas White", "Titan Grey", "Abyss Black", "Fiery Red", "Starry Night"],
  
  // 14. Hyundai Ioniq 5
  "ioniq 5": ["Gravity Gold Matte", "Atlas White", "Phantom Black", "Lucid Blue", "Cyber Grey"]
};

// Color Swatch Hex Mappings for UI display
export const COLOR_HEX_MAP = {
  "everest white": "#F8FAFC",
  "diamond white": "#FFFFFF",
  "arctic white": "#F1F5F9",
  "pearl white": "#F8FAFC",
  "snow white pearl": "#FFFFFF",
  "glacier white pearl": "#F8FAFC",
  "atlas white": "#FFFFFF",
  
  "stealth black": "#09090B",
  "napoli black": "#18181B",
  "cosmic black": "#09090B",
  "aurora black pearl": "#09090B",
  "abyss black": "#000000",
  "phantom black": "#09090B",
  "midnight black": "#09090B",

  "tango red": "#DC2626",
  "red rage": "#B91C1C",
  "intense red": "#EF4444",
  "runway red": "#DC2626",
  "fiery red": "#B91C1C",

  "nebula blue": "#2563EB",
  "electric blue": "#3B82F6",
  "imperial blue": "#1E3A8A",
  "yacht blue matte": "#1E40AF",
  "ocean blue": "#0284C7",
  "starry night": "#1E1B4B",
  "lucid blue": "#0EA5E9",
  "aqua marine": "#06B6D4",

  "deep forest": "#14532D",
  "lakeside brown": "#78350F",
  "desert myst": "#D97706",
  
  "dsat silver": "#94A3B8",
  "sparkling silver": "#CBD5E1",
  "deep grey": "#475569",
  "galaxy grey": "#334155",
  "matte grey": "#64748B",
  "gravity grey": "#475569",
  "xclusive matte graphite": "#334155",
  "panthera metal": "#475569",
  "steel matte grey": "#64748B",
  "ceramic silver": "#E2E8F0",
  "pebble grey": "#94A3B8",
  "titan grey": "#475569",
  "cyber grey": "#94A3B8",
  "gravity gold matte": "#D97706"
};

export function getColorsForModel(modelName) {
  if (!modelName) return ["Diamond White", "Stealth Black", "DSAT Silver"];
  const lower = modelName.toLowerCase().trim();
  
  for (const [key, colors] of Object.entries(OFFICIAL_MODEL_COLORS)) {
    if (lower.includes(key)) {
      return colors;
    }
  }
  
  return ["Diamond White", "Stealth Black", "DSAT Silver", "Tango Red"];
}
