export interface EducationalTopic {
  id: number;
  subject: "math" | "science" | "programming";
  title: string;
  concept: string;
  example: string;
  funFact: string;
  emoji: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const educationalTopics: EducationalTopic[] = [
  {
    id: 1,
    subject: "math",
    title: "Addition & Subtraction",
    concept: "Adding numbers together or taking them apart",
    example: "5 insects + 3 insects = 8 insects total!",
    funFact: "Ancient Egyptians used addition to count their treasures over 4,000 years ago!",
    emoji: "➕",
    question: "A snake collected 48 insects in the morning and 37 insects in the evening. If it ate 29 insects, how many are left?",
    options: ["56 insects", "66 insects", "85 insects", "114 insects"],
    correctAnswer: 0,
    explanation: "First add: 48 + 37 = 85 total collected. Then subtract: 85 - 29 = 56 insects remaining!"
  },
  {
    id: 2,
    subject: "science",
    title: "Photosynthesis",
    concept: "How plants make their own food using sunlight",
    example: "Plants use sun + water + CO₂ = food + oxygen for us!",
    funFact: "A single tree produces enough oxygen for 2 people in one year!",
    emoji: "🌱",
    question: "During photosynthesis, what gas do plants RELEASE into the atmosphere?",
    options: ["Carbon dioxide", "Oxygen", "Nitrogen", "Hydrogen"],
    correctAnswer: 1,
    explanation: "Plants take in CO₂ and release Oxygen (O₂) as a byproduct. This oxygen is what we breathe!"
  },
  {
    id: 3,
    subject: "math",
    title: "Multiplication",
    concept: "Quick way to add the same number many times",
    example: "3 × 4 = 3 + 3 + 3 + 3 = 12",
    funFact: "The multiplication symbol (×) was invented in 1631!",
    emoji: "✖️",
    question: "If 12 insects are arranged in equal rows of 4, and the snake eats 2 complete rows, how many insects remain?",
    options: ["4 insects", "6 insects", "8 insects", "10 insects"],
    correctAnswer: 0,
    explanation: "Total rows = 12 ÷ 4 = 3 rows. Snake ate 2 rows (2 × 4 = 8). Remaining = 12 - 8 = 4 insects!"
  },
  {
    id: 4,
    subject: "science",
    title: "Gravity",
    concept: "The force that pulls everything toward Earth",
    example: "Why insects fall down when the snake jumps!",
    funFact: "On the Moon, you'd weigh only 1/6th of your Earth weight!",
    emoji: "🌍",
    question: "Why do astronauts float in space but not on Earth?",
    options: ["Space has no air", "Space has very weak gravity", "Spaceships have special technology", "Astronauts wear special suits"],
    correctAnswer: 1,
    explanation: "In space, gravity is much weaker. On Earth, gravity pulls us down strongly (9.8 m/s²)!"
  },
  {
    id: 5,
    subject: "programming",
    title: "Loops",
    concept: "Repeating the same action multiple times",
    example: "for (i = 0; i < 10; i++) { collect_insect(); }",
    funFact: "Loops help game characters move smoothly 60 times every second!",
    emoji: "🔄",
    question: "What will this code output: for(i=1; i<=5; i++) { print(i*2); }",
    options: ["1, 2, 3, 4, 5", "2, 4, 6, 8, 10", "2, 4, 8, 16, 32", "1, 4, 9, 16, 25"],
    correctAnswer: 1,
    explanation: "The loop runs 5 times (i = 1 to 5) and prints i×2 each time: 2, 4, 6, 8, 10!"
  },
  {
    id: 6,
    subject: "math",
    title: "Fractions",
    concept: "Parts of a whole thing",
    example: "You collected 1/2 of the insects (5 out of 10)!",
    funFact: "Pizza slices are the tastiest way to learn fractions!",
    emoji: "🍕",
    question: "Which is greater: 3/4 or 5/8?",
    options: ["3/4", "5/8", "Both are equal", "Cannot compare"],
    correctAnswer: 0,
    explanation: "Convert to same denominator: 3/4 = 6/8. Since 6/8 > 5/8, therefore 3/4 is greater!"
  },
  {
    id: 7,
    subject: "science",
    title: "Speed & Velocity",
    concept: "How fast something moves",
    example: "Snake speed = distance ÷ time",
    funFact: "Cheetahs can run at 70 mph - that's as fast as a car!",
    emoji: "⚡",
    question: "A snake runs at 8 m/s for 15 seconds, then 12 m/s for 10 seconds. What's the total distance covered?",
    options: ["200 meters", "240 meters", "120 meters", "180 meters"],
    correctAnswer: 1,
    explanation: "Distance = Speed × Time. First part: 8×15 = 120m. Second part: 12×10 = 120m. Total = 240m!"
  },
  {
    id: 8,
    subject: "programming",
    title: "If-Then Statements",
    concept: "Making decisions in code",
    example: "IF hit obstacle THEN lose life",
    funFact: "Every app on your phone uses millions of if-then decisions!",
    emoji: "🔀",
    question: "What is the output: IF(x=10) { print 'A' } ELSE IF(x>5) { print 'B' } ELSE { print 'C' } when x=10?",
    options: ["A", "B", "C", "AB"],
    correctAnswer: 0,
    explanation: "When x=10, the first condition (x=10) is true, so it prints 'A' and skips the rest!"
  },
  {
    id: 9,
    subject: "math",
    title: "Geometry Shapes",
    concept: "Different shapes have different properties",
    example: "Circles have no corners, squares have 4 equal sides",
    funFact: "Bees make hexagon-shaped honeycombs because it's the strongest shape!",
    emoji: "🔷",
    question: "What is the area of a rectangle with length 12 cm and breadth 8 cm?",
    options: ["20 cm²", "40 cm²", "96 cm²", "48 cm²"],
    correctAnswer: 2,
    explanation: "Area of rectangle = Length × Breadth = 12 × 8 = 96 cm²"
  },
  {
    id: 10,
    subject: "science",
    title: "Food Chain",
    concept: "How energy passes from one living thing to another",
    example: "Insects eat plants → Snake eats insects → Energy flows!",
    funFact: "You're part of a food chain too - everything is connected!",
    emoji: "🦎",
    question: "In this food chain: Grass → Grasshopper → Frog → Snake → Eagle, what is the snake's role?",
    options: ["Producer", "Primary consumer", "Secondary consumer", "Tertiary consumer"],
    correctAnswer: 3,
    explanation: "Snake is a tertiary (3rd level) consumer. It eats frogs (secondary consumers) that eat grasshoppers (primary consumers) that eat grass (producer)!"
  },
  {
    id: 11,
    subject: "programming",
    title: "Variables",
    concept: "Containers that store information",
    example: "let score = 0; score = score + 10;",
    funFact: "Your game score is stored in a variable that updates constantly!",
    emoji: "📦",
    question: "If x=5 and y=10, what is the value of z after: z = x + y * 2?",
    options: ["30", "25", "20", "15"],
    correctAnswer: 1,
    explanation: "Following order of operations (BODMAS): y * 2 = 20, then x + 20 = 25. Multiplication happens before addition!"
  },
  {
    id: 12,
    subject: "math",
    title: "Patterns & Sequences",
    concept: "Numbers or shapes that follow a rule",
    example: "2, 4, 6, 8... (add 2 each time)",
    funFact: "Nature loves patterns - look at flower petals or pinecones!",
    emoji: "🔢",
    question: "Find the missing number: 3, 9, 27, 81, __?",
    options: ["162", "243", "108", "135"],
    correctAnswer: 1,
    explanation: "Each number is multiplied by 3. This is a geometric sequence: 81 × 3 = 243!"
  },
];
