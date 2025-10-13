import type { PowerUpId } from "@/types/powerUps";

export interface MicroChallenge {
  id: string;
  topicIds: number[];
  prompt: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  starReward: number;
  powerUpReward: PowerUpId | null;
  timeLimitSeconds: number;
  funTip: string;
}

export const microChallenges: MicroChallenge[] = [
  {
    id: "fraction-flash",
    topicIds: [102, 104],
    prompt: "The snake stretches 3/5 of a log and a beaver chews 1/5 more. How much of the log is covered now?",
    options: ["4/5", "3/6", "2/5", "1"],
    correctAnswer: 0,
    explanation: "Add fractions with the same denominator: 3/5 + 1/5 = 4/5. The log is almost full!",
    starReward: 8,
    powerUpReward: "length-boost",
    timeLimitSeconds: 45,
    funTip: "Friendly hint: equal bottoms mean you just add the tops!",
  },
  {
    id: "angle-guardian",
    topicIds: [14, 9],
    prompt: "A shield opens to 90°. If the snake twists it 30° more, what angle is the shield now?",
    options: ["120°", "100°", "60°", "180°"],
    correctAnswer: 0,
    explanation: "90° + 30° = 120°. That's an obtuse angle—perfect for blocking obstacles!",
    starReward: 10,
    powerUpReward: "angle-shield",
    timeLimitSeconds: 40,
    funTip: "Right angles are 90°. Bigger ones are obtuse like a big hug!",
  },
  {
    id: "decimal-dash",
    topicIds: [5, 13],
    prompt: "The snake slides 12.5 m then 7.4 m in a speed run. How far altogether?",
    options: ["19.9 m", "19.8 m", "18.9 m", "20.1 m"],
    correctAnswer: 0,
    explanation: "Line up decimals: 12.5 + 7.4 = 19.9 m. Almost twenty meters of speedy math!",
    starReward: 6,
    powerUpReward: "fraction-freeze",
    timeLimitSeconds: 50,
    funTip: "Keep the decimal points lined up like train doors."
  },
  {
    id: "pattern-pop",
    topicIds: [8, 15, 103],
    prompt: "Find the missing number: 4, 9, 14, __, 24",
    options: ["19", "18", "20", "17"],
    correctAnswer: 1,
    explanation: "The pattern adds 5 each time: 4 + 5 = 9, 9 + 5 = 14, 14 + 5 = 19, 19 + 5 = 24!",
    starReward: 7,
    powerUpReward: "length-boost",
    timeLimitSeconds: 35,
    funTip: "Patterns are like music beats—listen for the repeat!",
  },
];

export const getChallengeForTopic = (topicId: number) =>
  microChallenges.find(challenge => challenge.topicIds.includes(topicId));
