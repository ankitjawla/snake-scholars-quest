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
    question: "If you collected 7 insects and then collected 5 more, how many insects do you have in total?",
    options: ["10 insects", "12 insects", "15 insects", "8 insects"],
    correctAnswer: 1,
    explanation: "7 + 5 = 12 insects! Great job!"
  },
  {
    id: 2,
    subject: "science",
    title: "Photosynthesis",
    concept: "How plants make their own food using sunlight",
    example: "Plants use sun + water + CO₂ = food + oxygen for us!",
    funFact: "A single tree produces enough oxygen for 2 people in one year!",
    emoji: "🌱",
    question: "What do plants need to make their own food?",
    options: ["Only water", "Sunlight, water, and air", "Only soil", "Only sunlight"],
    correctAnswer: 1,
    explanation: "Plants need sunlight, water, and carbon dioxide from air to make food through photosynthesis!"
  },
  {
    id: 3,
    subject: "math",
    title: "Multiplication",
    concept: "Quick way to add the same number many times",
    example: "3 × 4 = 3 + 3 + 3 + 3 = 12",
    funFact: "The multiplication symbol (×) was invented in 1631!",
    emoji: "✖️",
    question: "What is 6 × 3?",
    options: ["15", "18", "21", "9"],
    correctAnswer: 1,
    explanation: "6 × 3 = 18. That's the same as 6 + 6 + 6!"
  },
  {
    id: 4,
    subject: "science",
    title: "Gravity",
    concept: "The force that pulls everything toward Earth",
    example: "Why insects fall down when the snake jumps!",
    funFact: "On the Moon, you'd weigh only 1/6th of your Earth weight!",
    emoji: "🌍",
    question: "What makes things fall down to the ground?",
    options: ["Wind", "Gravity", "Magnetism", "Air pressure"],
    correctAnswer: 1,
    explanation: "Gravity is the force that pulls everything toward Earth's center!"
  },
  {
    id: 5,
    subject: "programming",
    title: "Loops",
    concept: "Repeating the same action multiple times",
    example: "for (i = 0; i < 10; i++) { collect_insect(); }",
    funFact: "Loops help game characters move smoothly 60 times every second!",
    emoji: "🔄",
    question: "What do loops do in programming?",
    options: ["Delete code", "Repeat actions multiple times", "Stop the program", "Change colors"],
    correctAnswer: 1,
    explanation: "Loops repeat the same action many times - like collecting insects over and over!"
  },
  {
    id: 6,
    subject: "math",
    title: "Fractions",
    concept: "Parts of a whole thing",
    example: "You collected 1/2 of the insects (5 out of 10)!",
    funFact: "Pizza slices are the tastiest way to learn fractions!",
    emoji: "🍕",
    question: "If you eat 2 slices of a pizza that has 8 slices total, what fraction did you eat?",
    options: ["1/2", "2/8 or 1/4", "1/8", "2/4"],
    correctAnswer: 1,
    explanation: "2 out of 8 slices = 2/8, which simplifies to 1/4. Nice work!"
  },
  {
    id: 7,
    subject: "science",
    title: "Speed & Velocity",
    concept: "How fast something moves",
    example: "Snake speed = distance ÷ time",
    funFact: "Cheetahs can run at 70 mph - that's as fast as a car!",
    emoji: "⚡",
    question: "If a snake travels 20 meters in 5 seconds, what's its speed?",
    options: ["5 m/s", "4 m/s", "10 m/s", "15 m/s"],
    correctAnswer: 1,
    explanation: "Speed = Distance ÷ Time. So 20 ÷ 5 = 4 meters per second!"
  },
  {
    id: 8,
    subject: "programming",
    title: "If-Then Statements",
    concept: "Making decisions in code",
    example: "IF hit obstacle THEN lose life",
    funFact: "Every app on your phone uses millions of if-then decisions!",
    emoji: "🔀",
    question: "If you write: IF score > 100 THEN say 'Great!', when does it say 'Great!'?",
    options: ["Always", "When score is more than 100", "When score is 100", "Never"],
    correctAnswer: 1,
    explanation: "The code only says 'Great!' when the score is MORE than 100. That's how IF statements work!"
  },
  {
    id: 9,
    subject: "math",
    title: "Geometry Shapes",
    concept: "Different shapes have different properties",
    example: "Circles have no corners, squares have 4 equal sides",
    funFact: "Bees make hexagon-shaped honeycombs because it's the strongest shape!",
    emoji: "🔷",
    question: "How many corners does a triangle have?",
    options: ["2", "3", "4", "5"],
    correctAnswer: 1,
    explanation: "A triangle has 3 corners (vertices) and 3 sides. That's why it's called a 'tri-angle'!"
  },
  {
    id: 10,
    subject: "science",
    title: "Food Chain",
    concept: "How energy passes from one living thing to another",
    example: "Insects eat plants → Snake eats insects → Energy flows!",
    funFact: "You're part of a food chain too - everything is connected!",
    emoji: "🦎",
    question: "In a food chain, where does energy start from?",
    options: ["Animals", "The Sun", "Water", "Rocks"],
    correctAnswer: 1,
    explanation: "Energy starts from the Sun! Plants use sunlight to make food, then animals eat plants."
  },
  {
    id: 11,
    subject: "programming",
    title: "Variables",
    concept: "Containers that store information",
    example: "let score = 0; score = score + 10;",
    funFact: "Your game score is stored in a variable that updates constantly!",
    emoji: "📦",
    question: "What is a variable in programming?",
    options: ["A type of loop", "A container that stores information", "A game character", "An error message"],
    correctAnswer: 1,
    explanation: "Variables are like boxes that store information - like your score, name, or any data!"
  },
  {
    id: 12,
    subject: "math",
    title: "Patterns & Sequences",
    concept: "Numbers or shapes that follow a rule",
    example: "2, 4, 6, 8... (add 2 each time)",
    funFact: "Nature loves patterns - look at flower petals or pinecones!",
    emoji: "🔢",
    question: "What comes next in this pattern: 5, 10, 15, 20, __?",
    options: ["22", "25", "30", "21"],
    correctAnswer: 1,
    explanation: "The pattern adds 5 each time, so 20 + 5 = 25. You found the pattern!"
  },
];
