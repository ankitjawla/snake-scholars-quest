export interface PowerUpDefinition {
  id: "length-boost" | "angle-shield" | "fraction-freeze";
  name: string;
  description: string;
  effect: string;
  icon: string;
}

export const powerUps: PowerUpDefinition[] = [
  {
    id: "length-boost",
    name: "Length Boost",
    description: "Grow an extra glowing tail segment that doubles bug points for 30 seconds.",
    effect: "double-points",
    icon: "📏",
  },
  {
    id: "angle-shield",
    name: "Angle Shield",
    description: "A shimmering protractor shield absorbs one obstacle hit.",
    effect: "one-hit-guard",
    icon: "🛡️",
  },
  {
    id: "fraction-freeze",
    name: "Fraction Freeze",
    description: "Freeze time to half speed for 10 seconds—perfect for tight squeezes!",
    effect: "slow-time",
    icon: "❄️",
  },
];

export const getPowerUpDefinition = (id: PowerUpDefinition["id"]) =>
  powerUps.find(power => power.id === id);
