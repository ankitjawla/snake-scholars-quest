export interface EducationalTopic {
  id: number;
  subject: "math" | "science" | "programming";
  title: string;
  concept: string;
  example: string;
  funFact: string;
  emoji: string;
}

export const educationalTopics: EducationalTopic[] = [
  {
    id: 1,
    subject: "math",
    title: "Addition & Subtraction",
    concept: "Adding numbers together or taking them apart",
    example: "5 insects + 3 insects = 8 insects total!",
    funFact: "Ancient Egyptians used addition to count their treasures over 4,000 years ago!",
    emoji: "➕"
  },
  {
    id: 2,
    subject: "science",
    title: "Photosynthesis",
    concept: "How plants make their own food using sunlight",
    example: "Plants use sun + water + CO₂ = food + oxygen for us!",
    funFact: "A single tree produces enough oxygen for 2 people in one year!",
    emoji: "🌱"
  },
  {
    id: 3,
    subject: "math",
    title: "Multiplication",
    concept: "Quick way to add the same number many times",
    example: "3 × 4 = 3 + 3 + 3 + 3 = 12",
    funFact: "The multiplication symbol (×) was invented in 1631!",
    emoji: "✖️"
  },
  {
    id: 4,
    subject: "science",
    title: "Gravity",
    concept: "The force that pulls everything toward Earth",
    example: "Why insects fall down when the snake jumps!",
    funFact: "On the Moon, you'd weigh only 1/6th of your Earth weight!",
    emoji: "🌍"
  },
  {
    id: 5,
    subject: "programming",
    title: "Loops",
    concept: "Repeating the same action multiple times",
    example: "for (i = 0; i < 10; i++) { collect_insect(); }",
    funFact: "Loops help game characters move smoothly 60 times every second!",
    emoji: "🔄"
  },
  {
    id: 6,
    subject: "math",
    title: "Fractions",
    concept: "Parts of a whole thing",
    example: "You collected 1/2 of the insects (5 out of 10)!",
    funFact: "Pizza slices are the tastiest way to learn fractions!",
    emoji: "🍕"
  },
  {
    id: 7,
    subject: "science",
    title: "Speed & Velocity",
    concept: "How fast something moves",
    example: "Snake speed = distance ÷ time",
    funFact: "Cheetahs can run at 70 mph - that's as fast as a car!",
    emoji: "⚡"
  },
  {
    id: 8,
    subject: "programming",
    title: "If-Then Statements",
    concept: "Making decisions in code",
    example: "IF hit obstacle THEN lose life",
    funFact: "Every app on your phone uses millions of if-then decisions!",
    emoji: "🔀"
  },
  {
    id: 9,
    subject: "math",
    title: "Geometry Shapes",
    concept: "Different shapes have different properties",
    example: "Circles have no corners, squares have 4 equal sides",
    funFact: "Bees make hexagon-shaped honeycombs because it's the strongest shape!",
    emoji: "🔷"
  },
  {
    id: 10,
    subject: "science",
    title: "Food Chain",
    concept: "How energy passes from one living thing to another",
    example: "Insects eat plants → Snake eats insects → Energy flows!",
    funFact: "You're part of a food chain too - everything is connected!",
    emoji: "🦎"
  },
  {
    id: 11,
    subject: "programming",
    title: "Variables",
    concept: "Containers that store information",
    example: "let score = 0; score = score + 10;",
    funFact: "Your game score is stored in a variable that updates constantly!",
    emoji: "📦"
  },
  {
    id: 12,
    subject: "math",
    title: "Patterns & Sequences",
    concept: "Numbers or shapes that follow a rule",
    example: "2, 4, 6, 8... (add 2 each time)",
    funFact: "Nature loves patterns - look at flower petals or pinecones!",
    emoji: "🔢"
  },
];
