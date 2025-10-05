export interface AssessmentQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface EducationalTopic {
  id: number;
  subject: "math" | "science" | "english" | "hindi" | "social-science" | "evs" | "programming";
  subCategory?: string;
  grade: number;
  title: string;
  concept: string;
  example: string;
  funFact: string;
  emoji: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  ncertChapter?: string;
  learningOutcome: string;
  assessmentQuestions?: AssessmentQuestion[];
}

import { class5MathTopics } from "./class5MathTopics";

export const educationalTopics: EducationalTopic[] = [
  // Class 5 Math Topics from NCERT (Kid-friendly & simplified)
  ...class5MathTopics,
  
  // MATHEMATICS (Advanced topics)
  {
    id: 1,
    subject: "math",
    grade: 5,
    title: "Large Numbers",
    ncertChapter: "Chapter 1: We the Travellers - I (Reading and Writing Large Numbers)",
    concept: "Numbers can be super big! Like the number of stars in the sky or people in India. We use place values to read and write big numbers: Ones, Tens, Hundreds, Thousands, Ten Thousands. The bigger the place, the bigger the value!",
    example: "India has about 1,40,00,00,000 (140 crore) people! That's written as: 1 Arab + 40 Crore. To write it: we group digits by commas from right: 1,40,00,00,000. Cool, right?",
    funFact: "Did you know? The number 1 followed by 100 zeros is called a 'Googol'! That's where Google got its name (but they spelled it differently)! 🔢",
    emoji: "🔢",
    question: "A city has 52,847 people. What is the place value of digit 5 in this number?",
    options: ["50,000 (Fifty thousand)", "5,000 (Five thousand)", "500 (Five hundred)", "5 (Five)"],
    correctAnswer: 0,
    explanation: "The digit 5 is in the ten thousands place! So its value is 5 × 10,000 = 50,000. Remember: count places from right to left!",
    learningOutcome: "Read, write and understand place values of numbers up to 1 lakh (100,000)",
    assessmentQuestions: [
      {
        question: "Write this number in words: 43,256",
        options: [
          "Forty-three thousand two hundred fifty-six",
          "Four thousand three hundred twenty-five",
          "Forty-three hundred fifty-six",
          "Four lakh three thousand"
        ],
        correctAnswer: 0,
        explanation: "Break it down: 43,000 (forty-three thousand) + 200 (two hundred) + 56 (fifty-six) = Forty-three thousand two hundred fifty-six!"
      },
      {
        question: "What is the value of 7 in the number 76,543?",
        options: ["70,000", "7,000", "700", "70"],
        correctAnswer: 0,
        explanation: "7 is in the ten thousands place, so its value is 7 × 10,000 = 70,000!"
      },
      {
        question: "Which number is greater: 58,432 or 58,423?",
        options: ["58,432", "58,423", "Both are equal", "Cannot compare"],
        correctAnswer: 0,
        explanation: "Compare digit by digit from left: 5=5, 8=8, 4=4, 3>2. So 58,432 is greater!"
      }
    ]
  },
  {
    id: 2,
    subject: "math",
    grade: 5,
    title: "Multiplication",
    concept: "Repeated addition of the same number. Multiplication helps us calculate quickly when we have equal groups of items. It's fundamental for understanding area, volume, and scaling.",
    example: "A garden has 24 rows with 18 plants in each row. Total plants = 24 × 18 = 432 plants. This is much faster than adding 18 forty-four times!",
    funFact: "Ancient Babylonians created the first multiplication tables around 4,000 years ago on clay tablets! Indian mathematician Brahmagupta perfected rules for multiplying negative numbers in 628 CE.",
    emoji: "✖️",
    question: "A solar panel farm has 45 rows of panels, with 28 panels in each row. If each panel costs ₹12,500, what is the total cost of all panels?",
    options: ["₹15,750,000", "₹1,575,000", "₹157,500", "₹1,260"],
    correctAnswer: 0,
    explanation: "First find total panels: 45 × 28 = 1,260 panels. Then multiply by cost: 1,260 × ₹12,500 = ₹15,750,000. This shows multiplication in real engineering and finance!",
    learningOutcome: "Apply multi-digit multiplication in complex real-world scenarios involving money and measurements"
  },
  {
    id: 3,
    subject: "math",
    grade: 5,
    title: "Division & Remainder",
    concept: "Splitting a total into equal parts or groups. Division is the inverse of multiplication. The remainder is what's left over when division isn't exact. Essential for sharing fairly and understanding fractions.",
    example: "If 1,847 books need to be packed into boxes that hold 24 books each: 1,847 ÷ 24 = 76 boxes with 23 books remaining. You'd need 77 boxes total!",
    funFact: "The division symbol (÷) is called an obelus! Swiss mathematician Johann Rahn introduced it in 1659. In India, we also use the '/' symbol, which is even older!",
    emoji: "➗",
    question: "An electric car factory produces 8,456 batteries in a week. If each car needs 16 batteries, how many complete cars can be made and how many batteries will be left over?",
    options: ["528 cars, 8 batteries left", "527 cars, 24 batteries left", "529 cars, 0 batteries left", "528 cars, 16 batteries left"],
    correctAnswer: 0,
    explanation: "8,456 ÷ 16 = 528 remainder 8. They can make 528 complete cars with 8 batteries remaining for the next car!",
    learningOutcome: "Perform long division with 4-digit numbers and interpret remainders in practical manufacturing contexts"
  },
  {
    id: 4,
    subject: "math",
    grade: 5,
    title: "Fractions",
    concept: "A fraction represents a part of a whole. The top number (numerator) tells how many parts we have, the bottom (denominator) tells how many equal parts make up the whole. Fractions help us share, measure, and understand portions.",
    example: "If you drink 3/4 of a 1-liter water bottle, you drank 750ml. If your friend drinks 2/3 of their bottle, who drank more? 3/4 = 9/12 and 2/3 = 8/12, so you drank more!",
    funFact: "Ancient Egyptians only used unit fractions (numerator = 1) like 1/2, 1/3, 1/4. They wrote 3/4 as 1/2 + 1/4! Modern fraction notation was developed in India around 500 CE.",
    emoji: "🍕",
    question: "A smartphone's battery was at 3/5 capacity. After charging for some time, it increased by 1/4. What fraction of battery capacity is it at now?",
    options: ["17/20", "4/9", "4/5", "13/20"],
    correctAnswer: 0,
    explanation: "Find common denominator (20): 3/5 = 12/20 and 1/4 = 5/20. Add them: 12/20 + 5/20 = 17/20. The battery is now at 17/20 or 85% capacity!",
    learningOutcome: "Add and compare fractions with different denominators using LCM method in technology contexts"
  },
  {
    id: 5,
    subject: "math",
    grade: 5,
    title: "Decimals",
    concept: "Decimals are another way to write fractions using place value. The decimal point separates whole numbers from parts: tenths (0.1), hundredths (0.01), thousandths (0.001). Used in money, measurements, and scientific calculations.",
    example: "The difference between India's fastest 100m sprinters might be 0.07 seconds! If one runs in 10.45 seconds and another in 10.52 seconds, that tiny 0.07 gap determines who wins gold!",
    funFact: "Scottish mathematician John Napier popularized the decimal point in 1616. In India, we use a dot (.) but many countries use a comma (,) as their decimal separator! Ancient Indians used decimals in astronomy calculations.",
    emoji: "🔢",
    question: "An Olympic archer scored 9.8, 10.5, 9.9, and 10.7 in four rounds. If the maximum score per round is 10.9, what was the archer's total score and average?",
    options: ["Total: 40.9, Average: 10.225", "Total: 41.9, Average: 10.475", "Total: 40.8, Average: 10.2", "Total: 39.9, Average: 9.975"],
    correctAnswer: 0,
    explanation: "Add all scores: 9.8 + 10.5 + 9.9 + 10.7 = 40.9 total. Average = 40.9 ÷ 4 = 10.225. Close to perfect!",
    learningOutcome: "Perform operations with decimals including addition and division to find averages in sports statistics"
  },
  {
    id: 6,
    subject: "math",
    grade: 5,
    title: "Percentages",
    concept: "Percentage means 'per hundred' - a way to express fractions and decimals. Very useful for comparing proportions, calculating discounts, understanding statistics, and analyzing data. Essential for shopping, banking, and understanding news.",
    example: "A laptop originally costs ₹45,000 but has a 15% discount. Discount amount = 15% of ₹45,000 = ₹6,750. Final price = ₹45,000 - ₹6,750 = ₹38,250. You save ₹6,750!",
    funFact: "The % symbol evolved from the Italian term 'per cento'. Ancient Romans used fractions like '1/100' for taxes. Today's % symbol first appeared in print around 1425! Banks use percentages for interest rates - that's how your savings grow!",
    emoji: "📊",
    question: "India's literacy rate was 74.04% in 2011. If India's population was 121 crore (1.21 billion), approximately how many people were literate?",
    options: ["90 crore people", "89.6 crore people", "85 crore people", "95 crore people"],
    correctAnswer: 1,
    explanation: "74.04% of 121 crore = (74.04/100) × 121 = 89.6 crore literate people. This is how census data helps government plan schools and education programs!",
    learningOutcome: "Calculate percentages of large numbers and interpret them in demographic and economic contexts"
  },
  {
    id: 7,
    subject: "math",
    grade: 5,
    title: "LCM & HCF",
    concept: "LCM (Lowest Common Multiple) is the smallest number divisible by two or more numbers. HCF/GCD (Highest Common Factor) is the largest number that divides all given numbers. Used for synchronizing events, simplifying fractions, and scheduling.",
    example: "Three LED lights blink every 12, 18, and 24 seconds. When will all three blink together? LCM of 12, 18, 24 = 72 seconds. They'll sync every 72 seconds! HCF helps cutting 36cm and 48cm ribbons into equal maximum lengths: HCF(36,48) = 12cm pieces.",
    funFact: "Euclid's algorithm from 300 BCE is still the most efficient way to find HCF! Used in computer encryption today. Ancient Indian mathematicians used LCM/HCF in astronomy to predict eclipses by finding when planet cycles align!",
    emoji: "🔢",
    question: "Two buses leave a terminal at 6:00 AM. Bus A returns every 45 minutes, Bus B every 60 minutes. When will both buses be at the terminal together again?",
    options: ["9:00 AM", "7:30 AM", "8:00 AM", "9:30 AM"],
    correctAnswer: 0,
    explanation: "Find LCM of 45 and 60: Prime factors: 45 = 3² × 5, 60 = 2² × 3 × 5. LCM = 2² × 3² × 5 = 180 minutes = 3 hours. Both buses meet at 6:00 AM + 3 hours = 9:00 AM!",
    learningOutcome: "Apply LCM to solve real-world scheduling problems using prime factorization method"
  },
  {
    id: 8,
    subject: "math",
    grade: 5,
    title: "Average & Mean",
    concept: "Average (arithmetic mean) is the sum of all values divided by the count of values. It represents the central tendency of data. Essential for understanding test scores, temperatures, speeds, and comparing performances across different datasets.",
    example: "A cricketer scored 45, 67, 23, 89, and 71 runs in 5 matches. Average = (45+67+23+89+71)÷5 = 295÷5 = 59 runs. This batting average helps scouts evaluate consistency! If a student scores 85, 92, 78, 88, and 82, average = 85% - a solid B grade.",
    funFact: "Virat Kohli's ODI average is over 58 - one of cricket's best ever! Formula 1 drivers analyze average lap times to milliseconds. Weather reports use 30-year averages. Indian mathematician Bhaskara II used averages in astronomy 900 years ago!",
    emoji: "📈",
    question: "A city's daily maximum temperatures for a week were: 32°C, 34°C, 31°C, 35°C, 33°C, 36°C, and 32°C. What was the average temperature? If next week's average increases by 2°C, what will it be?",
    options: ["33°C, then 35°C", "34°C, then 36°C", "32°C, then 34°C", "33.3°C, then 35.3°C"],
    correctAnswer: 0,
    explanation: "Sum = 32+34+31+35+33+36+32 = 233°C. Average = 233÷7 = 33.29°C ≈ 33°C. Next week's average = 33 + 2 = 35°C. This shows climate change tracking!",
    learningOutcome: "Calculate and interpret averages from real meteorological data and understand trend analysis"
  },
  {
    id: 9,
    subject: "math",
    grade: 5,
    title: "Perimeter & Area",
    concept: "Perimeter is the total distance around the boundary of a 2D shape (measured in cm, m, km). Area is the space covered inside a shape (measured in cm², m², hectares). Critical for construction, flooring, painting, farming, and real estate.",
    example: "A rectangular cricket pitch is 22 yards long and 10 feet wide. Area = 22×10 = 220 square yards of grass to maintain. Boundary rope perimeter = 2(22+10) = 64 yards. A square park with 50m sides has area = 50×50 = 2,500 m² = 0.25 hectares.",
    funFact: "Ancient Indians calculated area for agriculture using 'Shulba Sutras' (800 BCE)! Today, satellites use area calculations to monitor deforestation. One bigha = 2,500 m² in UP, but varies by state! The Pentagon building has area of 610,000 m²!",
    emoji: "📐",
    question: "A rectangular solar panel farm is 85 meters long and 45 meters wide. If fencing costs ₹150 per meter, what's the total fencing cost? If panels cover 70% of the area, how many square meters have panels?",
    options: ["₹39,000 and 2,677.5 m²", "₹19,500 and 3,825 m²", "₹39,000 and 2,677 m²", "₹52,000 and 2,677 m²"],
    correctAnswer: 0,
    explanation: "Perimeter = 2(85+45) = 260m. Cost = 260×₹150 = ₹39,000. Area = 85×45 = 3,825 m². Panel area = 70% of 3,825 = 2,677.5 m². Real renewable energy planning!",
    learningOutcome: "Apply perimeter and area calculations in modern engineering and cost estimation scenarios"
  },
  {
    id: 10,
    subject: "math",
    grade: 5,
    title: "Volume",
    concept: "Volume measures the 3D space inside an object (measured in cm³, m³, liters). For cubes: V = side³. For cuboids: V = length × width × height. Essential for packaging, shipping, construction, and calculating capacity of containers, tanks, and rooms.",
    example: "A water tank is 2m long, 1.5m wide, 1.2m high. Volume = 2×1.5×1.2 = 3.6 m³ = 3,600 liters (since 1 m³ = 1,000 liters). A Rubik's Cube with 5.7cm sides has volume = 5.7³ = 185.2 cm³. Shipping containers are 12m × 2.4m × 2.6m = 74.88 m³!",
    funFact: "The Great Pyramid of Giza has volume of 2.6 million m³! India's largest water tanker holds 15,000 liters (15 m³). Ancient Indians calculated volumes for temple tanks. ISS's pressurized volume is 916 m³ - a flying apartment!",
    emoji: "📦",
    question: "An aquarium is 120cm long, 40cm wide, and 50cm tall. If it's filled to 80% capacity to prevent overflow, how many liters of water does it contain? (1 liter = 1,000 cm³)",
    options: ["192 liters", "240 liters", "150 liters", "96 liters"],
    correctAnswer: 0,
    explanation: "Total volume = 120×40×50 = 240,000 cm³ = 240 liters. At 80% full = 240×0.8 = 192 liters. This is how aquarium designers calculate for fish habitats!",
    learningOutcome: "Calculate volume of cuboids and convert between cubic units and liters for practical applications"
  },
  {
    id: 11,
    subject: "math",
    grade: 5,
    title: "Time & Calendar",
    concept: "Time measurement and conversion: 60 seconds = 1 minute, 60 minutes = 1 hour, 24 hours = 1 day, 7 days = 1 week, 365 days = 1 year (366 in leap years). 12-hour (AM/PM) vs 24-hour format. Essential for scheduling, travel, and time management.",
    example: "A flight from Delhi to London departs 11:30 PM IST and takes 9 hours 20 minutes. Arrival time = 11:30 PM + 9:20 = 8:50 AM next day IST. But London is 5.5 hours behind, so local time = 3:20 AM! Time zones matter for international calls and meetings.",
    funFact: "India has ONE time zone (IST = UTC+5:30) despite being wide enough for 2! Ancient Indians divided day into 60 ghatikas. A leap year has 366 days - happens every 4 years (except century years not divisible by 400). 2024 was a leap year!",
    emoji: "⏰",
    question: "An online gaming tournament starts at 6:15 PM IST on Friday. If matches run continuously for 16 hours 45 minutes, when will the tournament end? What day and time?",
    options: ["Saturday 11:00 AM", "Saturday 10:00 AM", "Friday 11:00 PM", "Saturday 12:00 PM"],
    correctAnswer: 0,
    explanation: "6:15 PM + 16 hours = 10:15 AM next day (Saturday). Add 45 minutes: 10:15 + 0:45 = 11:00 AM Saturday. Gamers need to track international tournament times across zones!",
    learningOutcome: "Calculate elapsed time across multiple days and understand time management in digital contexts"
  },
  {
    id: 12,
    subject: "math",
    grade: 5,
    title: "Money & Profit-Loss",
    concept: "Cost Price (CP) = what you pay to buy. Selling Price (SP) = what you sell for. Profit = SP - CP (when SP > CP). Loss = CP - SP (when CP > SP). Profit% = (Profit/CP)×100. Loss% = (Loss/CP)×100. Foundation for business, shopping, and financial literacy.",
    example: "A shopkeeper buys 50 notebooks at ₹30 each (CP = ₹1,500). Sells 40 at ₹45 each and 10 at ₹35 each. Total SP = (40×₹45)+(10×₹35) = ₹1,800+₹350 = ₹2,150. Profit = ₹2,150-₹1,500 = ₹650. Profit% = (650/1,500)×100 = 43.3%!",
    funFact: "The ₹ symbol was designed by D. Udaya Kumar in 2010, combining Devanagari 'र' and Latin 'R'! India's first bank was Bank of Hindustan (1770). Chanakya's Arthashastra (300 BCE) taught profit calculations! E-commerce uses dynamic pricing - prices change based on demand!",
    emoji: "💰",
    question: "An electronics store bought 25 headphones at ₹800 each. They sold 20 at ₹1,200 each and had to sell remaining 5 at ₹600 each due to discount sale. What was the overall profit or loss and percentage?",
    options: ["₹7,000 profit, 35%", "₹6,000 profit, 30%", "₹8,000 profit, 40%", "₹5,000 loss, 25%"],
    correctAnswer: 0,
    explanation: "Total CP = 25×₹800 = ₹20,000. Total SP = (20×₹1,200)+(5×₹600) = ₹24,000+₹3,000 = ₹27,000. Profit = ₹27,000-₹20,000 = ₹7,000. Profit% = (7,000/20,000)×100 = 35%. Smart retail strategy!",
    learningOutcome: "Calculate profit/loss percentages in complex multi-item retail scenarios with mixed pricing"
  },
  {
    id: 13,
    subject: "math",
    grade: 5,
    title: "Data Handling",
    concept: "Collecting, organizing, and interpreting data using tables, pictographs, bar graphs, and line graphs. Data helps us make decisions, spot trends, and communicate information visually. Mode = most frequent value, Median = middle value when arranged in order.",
    example: "A class recorded daily temperatures: 28°C, 32°C, 30°C, 32°C, 35°C, 32°C, 29°C. Mode = 32°C (appears most). Arrange: 28, 29, 30, 32, 32, 32, 35. Median = 32°C (middle value). YouTube shows your watch history as bar graphs. Cricket scorecards are data tables!",
    funFact: "William Playfair invented bar charts (1786) and pie charts (1801)! Florence Nightingale used graphs in 1850s to save lives by showing hospital data. Today's AI analyzes billions of data points. India's UPI processes 12 billion transactions/month - that's massive data!",
    emoji: "📊",
    question: "Students' weekly screen time (hours): Arjun-14, Priya-8, Rohan-12, Meera-8, Karan-10, Diya-8, Tanvi-15. What is the mode and median screen time?",
    options: ["Mode: 8 hrs, Median: 10 hrs", "Mode: 10 hrs, Median: 8 hrs", "Mode: 8 hrs, Median: 12 hrs", "Mode: 14 hrs, Median: 10 hrs"],
    correctAnswer: 2,
    explanation: "Mode = 8 hours (appears 3 times - most frequent). Arrange data: 8, 8, 8, 10, 12, 14, 15. Median = middle value = 12 hours. This shows digital wellness tracking!",
    learningOutcome: "Calculate mode and median from real data and understand their significance in analyzing trends"
  },
  {
    id: 14,
    subject: "math",
    grade: 5,
    title: "Geometry Shapes",
    concept: "2D shapes (circles, triangles, quadrilaterals) and 3D shapes (spheres, cubes, cylinders, cones, prisms). Properties include sides, vertices, edges, faces, symmetry, and angles. Geometry is everywhere - architecture, art, nature, sports fields, and technology design.",
    example: "Football is a truncated icosahedron - 12 pentagons + 20 hexagons! Taj Mahal uses perfect symmetry. A stop sign is an octagon (8 sides). Pizza slice is a sector of a circle. Dice is a cube (6 faces, 12 edges, 8 vertices). Qutub Minar is a cylinder that tapers.",
    funFact: "Bees' hexagonal honeycombs use least wax for maximum space! Indian rangoli uses geometric patterns. The Pentagon has 5 sides, 5 floors, 5 rings! Buckyballs (C60 molecules) are soccer ball-shaped. Islamic architecture uses complex geometric tilework called 'girih' - created 1,000 years ago!",
    emoji: "🔷",
    question: "An architect designs a window using geometric shapes: an equilateral triangle on top of a square, with semicircles on two opposite sides of the square. If the square has 4 lines of symmetry, the triangle has 3, and each semicircle adds 1, what's unique about this design's symmetry?",
    options: ["It has 9 lines of symmetry", "Only 1 vertical line of symmetry remains", "It has no symmetry", "It has rotational symmetry only"],
    correctAnswer: 1,
    explanation: "When combined, most symmetry lines are lost! Only the vertical line through the triangle's apex and square's center remains. This teaches us complex shapes lose simpler symmetries - important in architectural design!",
    learningOutcome: "Analyze complex composite shapes and understand how combining shapes affects symmetry properties"
  },
  {
    id: 15,
    subject: "math",
    grade: 5,
    title: "Patterns & Sequences",
    concept: "Sequences follow rules: Arithmetic (add/subtract same number), Geometric (multiply/divide by same number), Square numbers (1, 4, 9, 16...), Fibonacci (each number is sum of previous two). Patterns help predict, code algorithms, and understand nature and art.",
    example: "Fibonacci: 0, 1, 1, 2, 3, 5, 8, 13... (each = previous two added). Found in flower petals, pinecones, galaxies! Square numbers: 1, 4, 9, 16, 25... (1², 2², 3², 4², 5²). Powers of 2: 2, 4, 8, 16, 32... (computer memory sizes: 2GB, 4GB, 8GB, 16GB, 32GB!)",
    funFact: "Sunflowers have 21, 34, 55, or 89 spirals - all Fibonacci numbers! Ancient Indian mathematicians discovered zero and understood number patterns. Binary (0,1) is the simplest sequence - powers all computers! Prime numbers (2,3,5,7,11...) have no pattern - mathematicians still trying to crack it!",
    emoji: "🔢",
    question: "A viral video got 100 views on Day 1. Each day, views triple. Sequence: 100, 300, 900... How many views on Day 6? And what type of sequence is this?",
    options: ["7,290 views, Arithmetic", "24,300 views, Geometric", "2,430 views, Geometric", "72,900 views, Fibonacci"],
    correctAnswer: 1,
    explanation: "Day 1: 100, Day 2: 300, Day 3: 900, Day 4: 2,700, Day 5: 8,100, Day 6: 24,300. It's geometric (multiply by 3 each time). This is how viral content spreads exponentially on social media!",
    learningOutcome: "Identify pattern types and apply geometric sequences to model exponential growth in digital contexts"
  },

  // SCIENCE/EVS (15 topics)
  {
    id: 16,
    subject: "science",
    subCategory: "Biology",
    grade: 5,
    title: "Photosynthesis",
    concept: "Photosynthesis is how plants make food using sunlight, water, and carbon dioxide in their chloroplasts (green chlorophyll). Equation: 6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ (glucose) + 6O₂. Plants are producers - they don't eat, they make their own food! This process powers almost all life on Earth.",
    example: "One large tree produces 118 kg of oxygen per year - enough for 2 people! Amazon rainforest creates 20% of Earth's oxygen. A single leaf has millions of chloroplasts doing photosynthesis. Without plants, atmospheric CO₂ would skyrocket, causing extreme global warming. Indoor plants improve air quality in homes!",
    funFact: "Jan Ingenhousz discovered photosynthesis in 1779! Ancient cyanobacteria started producing oxygen 2.4 billion years ago - The Great Oxygenation Event that made animal life possible! Some bacteria do photosynthesis using sulfur instead of water. Mangalore's mangroves sequester 4x more CO₂ than regular forests!",
    emoji: "🌱",
    question: "Scientists are designing artificial photosynthesis to combat climate change. If a 100 sq meter artificial leaf system absorbs 150 kg of CO₂ daily (like 5 trees), how much CO₂ could a 1 hectare (10,000 sq meter) facility absorb in a year?",
    options: ["547,500 kg", "54,750 kg", "5,475,000 kg", "5,475 kg"],
    correctAnswer: 0,
    explanation: "100 m² = 150 kg/day. 10,000 m² = (10,000/100)×150 = 1,500 kg/day. Per year = 1,500×365 = 547,500 kg = 547.5 tons of CO₂! This technology could help reverse climate change!",
    learningOutcome: "Understand photosynthesis chemistry and calculate its environmental impact on carbon sequestration"
  },
  {
    id: 17,
    subject: "science",
    subCategory: "Physics",
    grade: 5,
    title: "Gravity",
    concept: "Gravity is the force that attracts objects with mass toward each other. Earth's gravity pulls us down with 9.8 m/s² acceleration. Mass = amount of matter (stays same everywhere). Weight = mass × gravity (changes on different planets). Discovered by Isaac Newton (1687) and explained by Einstein's General Relativity (1915).",
    example: "If you weigh 40 kg on Earth, you'd weigh 6.6 kg on Moon (1/6th gravity), 15 kg on Mars (38% gravity), 94.8 kg on Jupiter (2.37x gravity)! Astronauts appear weightless in ISS not because there's no gravity, but because they're constantly falling around Earth - that's an orbit!",
    funFact: "Ancient Indian astronomer Brahmagupta described gravity in 628 CE - 1,000 years before Newton! Black holes have gravity so strong that even light can't escape! Gravity waves exist - LIGO detected them in 2015. Earth's gravity isn't uniform - it's slightly weaker at Equator due to rotation!",
    emoji: "🌍",
    question: "ISRO's Chandrayaan-3 landed on Moon in 2023. If the lander weighs 1,750 kg on Earth, what would be its weight on Moon's surface? (Moon gravity = 1/6th of Earth's)",
    options: ["291.67 kg", "10,500 kg", "1,750 kg", "875 kg"],
    correctAnswer: 0,
    explanation: "Weight on Moon = Earth weight ÷ 6 = 1,750 ÷ 6 = 291.67 kg. But its MASS remains 1,750 kg everywhere! This lower weight helped Chandrayaan use less fuel for landing. Understanding gravity is key to space missions!",
    learningOutcome: "Distinguish between mass and weight and calculate gravitational effects on different celestial bodies"
  },
  {
    id: 18,
    subject: "science",
    subCategory: "Physics",
    grade: 5,
    title: "Speed & Velocity",
    concept: "Speed = distance/time (scalar - only magnitude). Velocity = displacement/time (vector - has direction). Average speed vs instantaneous speed. Units: m/s, km/h. Understanding speed is crucial for transportation, sports, and space exploration.",
    example: "Usain Bolt's 100m world record: 9.58 seconds = 10.44 m/s = 37.58 km/h! India's fastest train Vande Bharat reaches 180 km/h. Speed of light = 3×10⁸ m/s. Sound travels at 343 m/s in air. A cheetah runs 120 km/h but only for 30 seconds - speed vs endurance!",
    funFact: "ISRO's Mars Orbiter Mission traveled 680 million km at average 36,000 km/h! Parker Solar Probe is fastest human-made object at 635,000 km/h! Internet speed is measured in Mbps (megabits per second). Indian runner Neeraj Chopra's javelin flies at 100+ km/h!",
    emoji: "⚡",
    question: "A delivery drone travels 12 km in 15 minutes, then returns by a different 15 km route in 20 minutes. What was its average speed for the entire journey?",
    options: ["46.3 km/h", "50 km/h", "54 km/h", "48 km/h"],
    correctAnswer: 0,
    explanation: "Total distance = 12+15 = 27 km. Total time = 15+20 = 35 minutes = 35/60 hours = 0.583 hours. Average speed = 27/0.583 = 46.3 km/h. This is how delivery apps calculate ETAs!",
    learningOutcome: "Calculate average speed over multi-leg journeys and understand real-world applications in logistics"
  },
  {
    id: 19,
    subject: "evs",
    subCategory: "Biology",
    grade: 5,
    title: "Food Chain",
    concept: "How energy passes from one living thing to another",
    example: "Insects eat plants → Snake eats insects → Energy flows!",
    funFact: "You're part of a food chain too - everything is connected!",
    emoji: "🦎",
    question: "In this food chain: Grass → Grasshopper → Frog → Snake → Eagle, what is the snake's role?",
    options: ["Producer", "Primary consumer", "Secondary consumer", "Tertiary consumer"],
    correctAnswer: 3,
    explanation: "Snake is a tertiary (3rd level) consumer. It eats frogs (secondary consumers) that eat grasshoppers (primary consumers) that eat grass (producer)!",
    learningOutcome: "Identify different levels in a food chain"
  },
  {
    id: 20,
    subject: "evs",
    subCategory: "Biology",
    grade: 5,
    title: "Human Body Systems",
    concept: "Different systems work together in our body",
    example: "Digestive system breaks down food, circulatory system carries blood",
    funFact: "Your heart beats about 100,000 times per day!",
    emoji: "🫀",
    question: "Which system is responsible for taking oxygen into our body?",
    options: ["Digestive system", "Respiratory system", "Nervous system", "Skeletal system"],
    correctAnswer: 1,
    explanation: "The respiratory system (lungs and airways) brings oxygen in when we breathe!",
    learningOutcome: "Identify major body systems and their functions"
  },
  {
    id: 21,
    subject: "evs",
    subCategory: "Biology",
    grade: 5,
    title: "Parts of Plants",
    concept: "Each plant part has a special job",
    example: "Roots absorb water, stems transport it, leaves make food",
    funFact: "The world's tallest tree is over 380 feet tall!",
    emoji: "🌳",
    question: "Which part of the plant is responsible for absorbing water from soil?",
    options: ["Leaves", "Stem", "Roots", "Flowers"],
    correctAnswer: 2,
    explanation: "Roots grow underground and absorb water and minerals from the soil!",
    learningOutcome: "Understand the functions of different plant parts"
  },
  {
    id: 22,
    subject: "evs",
    subCategory: "Biology",
    grade: 5,
    title: "Animal Classification",
    concept: "Animals are grouped by their characteristics",
    example: "Mammals have fur and feed milk, reptiles have scales",
    funFact: "Over 1 million animal species have been discovered!",
    emoji: "🦁",
    question: "Which of these is NOT a characteristic of mammals?",
    options: ["Have fur or hair", "Feed milk to babies", "Lay eggs underwater", "Breathe air"],
    correctAnswer: 2,
    explanation: "Most mammals give birth to live babies (not eggs). Some exceptions like platypus lay eggs on land!",
    learningOutcome: "Classify animals into major groups"
  },
  {
    id: 23,
    subject: "evs",
    subCategory: "Environmental Science",
    grade: 5,
    title: "Water Cycle",
    concept: "How water moves between Earth and atmosphere",
    example: "Evaporation → Condensation → Precipitation → Collection",
    funFact: "The water you drink today could have been in a dinosaur millions of years ago!",
    emoji: "💧",
    question: "What is the process called when water vapor turns into clouds?",
    options: ["Evaporation", "Condensation", "Precipitation", "Collection"],
    correctAnswer: 1,
    explanation: "Condensation is when water vapor cools and turns into tiny water droplets that form clouds!",
    learningOutcome: "Understand the stages of the water cycle"
  },
  {
    id: 24,
    subject: "science",
    subCategory: "Chemistry",
    grade: 5,
    title: "States of Matter",
    concept: "Matter exists in three main states",
    example: "Ice (solid) → Water (liquid) → Steam (gas)",
    funFact: "Scientists recently discovered a 4th state of matter called plasma!",
    emoji: "🧊",
    question: "What happens to water molecules when ice melts?",
    options: ["They move faster and spread apart", "They move slower", "They disappear", "They change to oxygen"],
    correctAnswer: 0,
    explanation: "When heated, molecules gain energy and move faster, changing from solid to liquid!",
    learningOutcome: "Understand properties of solids, liquids, and gases"
  },
  {
    id: 25,
    subject: "science",
    subCategory: "Physics",
    grade: 5,
    title: "Force & Motion",
    concept: "Forces make things move or stop",
    example: "Push and pull are forces. Friction slows things down.",
    funFact: "Astronauts' boots have special soles to create friction in space stations!",
    emoji: "⚡",
    question: "Which force always opposes motion?",
    options: ["Gravity", "Magnetic force", "Friction", "Electric force"],
    correctAnswer: 2,
    explanation: "Friction is the force that opposes motion between surfaces in contact!",
    learningOutcome: "Identify different types of forces"
  },
  {
    id: 26,
    subject: "science",
    subCategory: "Physics",
    grade: 5,
    title: "Simple Machines",
    concept: "Tools that make work easier",
    example: "Lever, pulley, inclined plane, wheel and axle",
    funFact: "The pyramids were built using simple machines like levers and ramps!",
    emoji: "⚙️",
    question: "A see-saw is an example of which simple machine?",
    options: ["Pulley", "Lever", "Wheel and axle", "Inclined plane"],
    correctAnswer: 1,
    explanation: "A see-saw is a lever with a fulcrum (pivot point) in the middle!",
    learningOutcome: "Identify and explain simple machines"
  },
  {
    id: 27,
    subject: "science",
    subCategory: "Astronomy",
    grade: 5,
    title: "Solar System",
    concept: "Sun and planets that orbit around it",
    example: "8 planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune",
    funFact: "Jupiter is so big that 1,000 Earths could fit inside it!",
    emoji: "🪐",
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
    explanation: "Mars appears red because of iron oxide (rust) on its surface!",
    learningOutcome: "Identify planets and their characteristics"
  },
  {
    id: 28,
    subject: "evs",
    subCategory: "Ecology",
    grade: 5,
    title: "Ecosystems",
    concept: "Living things and their environment interacting",
    example: "Desert, forest, ocean - each has unique plants and animals",
    funFact: "The Amazon rainforest produces 20% of Earth's oxygen!",
    emoji: "🌿",
    question: "What is adaptation in animals?",
    options: ["Growing bigger with age", "Special features to survive in their habitat", "Learning new tricks", "Moving to new places"],
    correctAnswer: 1,
    explanation: "Adaptation means special features that help animals survive in their environment, like polar bear's thick fur!",
    learningOutcome: "Understand ecosystems and adaptation"
  },
  {
    id: 29,
    subject: "evs",
    subCategory: "Health",
    grade: 5,
    title: "Health & Hygiene",
    concept: "Staying healthy through good habits",
    example: "Balanced diet, exercise, washing hands, enough sleep",
    funFact: "Washing hands with soap can prevent many diseases!",
    emoji: "🧼",
    question: "Why should we eat a balanced diet?",
    options: ["To gain weight", "To get all necessary nutrients", "To eat more food", "To save money"],
    correctAnswer: 1,
    explanation: "A balanced diet gives us proteins, carbs, fats, vitamins, and minerals our body needs!",
    learningOutcome: "Understand importance of health and hygiene"
  },
  {
    id: 30,
    subject: "evs",
    subCategory: "Environmental Science",
    grade: 5,
    title: "Natural Resources",
    concept: "Materials from nature that we use",
    example: "Air, water, soil, minerals, forests",
    funFact: "It takes 450 years for a plastic bottle to decompose!",
    emoji: "🌍",
    question: "Which is a renewable natural resource?",
    options: ["Coal", "Petroleum", "Solar energy", "Natural gas"],
    correctAnswer: 2,
    explanation: "Solar energy is renewable because the sun keeps shining! Coal and petroleum take millions of years to form!",
    learningOutcome: "Distinguish between renewable and non-renewable resources"
  },

  // ENGLISH LANGUAGE (10 topics)
  {
    id: 31,
    subject: "english",
    subCategory: "Grammar",
    grade: 5,
    title: "Parts of Speech",
    concept: "Words are classified into 8 types",
    example: "Noun: snake, Verb: runs, Adjective: fast",
    funFact: "The word 'set' has the most definitions in English - over 430!",
    emoji: "📝",
    question: "In the sentence 'The quick snake caught insects', what is 'quick'?",
    options: ["Noun", "Verb", "Adjective", "Adverb"],
    correctAnswer: 2,
    explanation: "'Quick' describes the snake, so it's an adjective!",
    learningOutcome: "Identify different parts of speech"
  },
  {
    id: 32,
    subject: "english",
    subCategory: "Grammar",
    grade: 5,
    title: "Tenses",
    concept: "When an action happens - past, present, or future",
    example: "I played (past), I play (present), I will play (future)",
    funFact: "English has 12 different tenses!",
    emoji: "⏰",
    question: "Which sentence is in past tense?",
    options: ["The snake catches insects", "The snake caught insects", "The snake will catch insects", "The snake is catching insects"],
    correctAnswer: 1,
    explanation: "'Caught' is the past tense of 'catch' - the action already happened!",
    learningOutcome: "Use correct verb tenses"
  },
  {
    id: 33,
    subject: "english",
    subCategory: "Grammar",
    grade: 5,
    title: "Sentence Formation",
    concept: "Every sentence has a subject and predicate",
    example: "The snake (subject) runs fast (predicate)",
    funFact: "The shortest complete sentence in English is 'Go!'",
    emoji: "✍️",
    question: "What is the subject in: 'The hungry snake ate ten insects'?",
    options: ["hungry", "The hungry snake", "ate", "ten insects"],
    correctAnswer: 1,
    explanation: "The subject is who/what the sentence is about - 'The hungry snake'!",
    learningOutcome: "Identify subject and predicate in sentences"
  },
  {
    id: 34,
    subject: "english",
    subCategory: "Grammar",
    grade: 5,
    title: "Active & Passive Voice",
    concept: "Who does the action vs what receives the action",
    example: "Active: Snake ate insect. Passive: Insect was eaten by snake.",
    funFact: "News reports often use passive voice!",
    emoji: "🔄",
    question: "Change to passive voice: 'The snake caught the insect'",
    options: ["The insect is caught by snake", "The insect was caught by the snake", "The insect catches the snake", "Snake was catching insect"],
    correctAnswer: 1,
    explanation: "Passive: The insect (object becomes subject) was caught (verb) by the snake (doer)!",
    learningOutcome: "Convert between active and passive voice"
  },
  {
    id: 35,
    subject: "english",
    subCategory: "Vocabulary",
    grade: 5,
    title: "Synonyms & Antonyms",
    concept: "Words with similar or opposite meanings",
    example: "Fast = Quick (synonym), Fast ≠ Slow (antonym)",
    funFact: "English has more synonyms than any other language!",
    emoji: "📚",
    question: "What is the antonym of 'difficult'?",
    options: ["Hard", "Tough", "Easy", "Complex"],
    correctAnswer: 2,
    explanation: "Easy is the opposite of difficult. Hard, tough, and complex are synonyms!",
    learningOutcome: "Build vocabulary through synonyms and antonyms"
  },
  {
    id: 36,
    subject: "english",
    subCategory: "Comprehension",
    grade: 5,
    title: "Reading Comprehension",
    concept: "Understanding what you read",
    example: "Read carefully, identify main idea, find details",
    funFact: "Reading improves memory and reduces stress!",
    emoji: "📖",
    question: "What is the main purpose of a story's conclusion?",
    options: ["Introduce characters", "Start the plot", "Resolve the story", "Create suspense"],
    correctAnswer: 2,
    explanation: "The conclusion wraps up the story and resolves conflicts!",
    learningOutcome: "Comprehend and analyze reading passages"
  },
  {
    id: 37,
    subject: "english",
    subCategory: "Grammar",
    grade: 5,
    title: "Punctuation",
    concept: "Marks that help us read and understand writing",
    example: "Period (.) Question mark (?) Comma (,) Exclamation (!)",
    funFact: "Ancient writing had no punctuation or spaces!",
    emoji: "❓",
    question: "Which punctuation mark shows excitement or strong feeling?",
    options: ["Period (.)", "Comma (,)", "Exclamation mark (!)", "Semicolon (;)"],
    correctAnswer: 2,
    explanation: "Exclamation marks (!) show excitement: 'I won the game!'",
    learningOutcome: "Use punctuation marks correctly"
  },
  {
    id: 38,
    subject: "english",
    subCategory: "Vocabulary",
    grade: 5,
    title: "Prefixes & Suffixes",
    concept: "Letters added to the beginning or end of words",
    example: "un-happy (prefix), help-ful (suffix)",
    funFact: "The prefix 'un-' is the most common in English!",
    emoji: "🔤",
    question: "What does the prefix 're-' mean in 'replay'?",
    options: ["Not", "Before", "Again", "Against"],
    correctAnswer: 2,
    explanation: "'Re-' means again. Replay = play again, rewrite = write again!",
    learningOutcome: "Understand how prefixes and suffixes change word meanings"
  },
  {
    id: 39,
    subject: "english",
    subCategory: "Vocabulary",
    grade: 5,
    title: "Homophones",
    concept: "Words that sound the same but have different meanings",
    example: "their/there, two/too/to, right/write",
    funFact: "There are over 400 homophones in English!",
    emoji: "👂",
    question: "Choose the correct word: 'I have ___ apples' (two/to/too)",
    options: ["two", "to", "too", "any is correct"],
    correctAnswer: 0,
    explanation: "'Two' is the number (2). 'To' shows direction. 'Too' means also/very!",
    learningOutcome: "Distinguish between commonly confused homophones"
  },
  {
    id: 40,
    subject: "english",
    subCategory: "Literature",
    grade: 5,
    title: "Story Elements",
    concept: "Parts that make up a good story",
    example: "Character, setting, plot, conflict, resolution, moral",
    funFact: "The oldest known story is the Epic of Gilgamesh from 2100 BC!",
    emoji: "📕",
    question: "What is the setting of a story?",
    options: ["The main character", "When and where the story happens", "The problem in the story", "The lesson learned"],
    correctAnswer: 1,
    explanation: "Setting describes when and where: 'Once upon a time in a jungle...'",
    learningOutcome: "Identify and describe story elements"
  },

  // HINDI LANGUAGE (8 topics)
  {
    id: 41,
    subject: "hindi",
    subCategory: "व्याकरण",
    grade: 5,
    title: "संज्ञा (Nouns)",
    concept: "किसी व्यक्ति, वस्तु या स्थान का नाम",
    example: "राम (व्यक्तिवाचक), सांप (जातिवाचक), प्यार (भाववाचक)",
    funFact: "हिंदी संस्कृत से निकली है और विश्व की 4वीं सबसे अधिक बोली जाने वाली भाषा है!",
    emoji: "🔤",
    question: "'दिल्ली' किस प्रकार की संज्ञा है?",
    options: ["जातिवाचक", "व्यक्तिवाचक", "भाववाचक", "समूहवाचक"],
    correctAnswer: 1,
    explanation: "'दिल्ली' एक विशेष स्थान का नाम है, इसलिए यह व्यक्तिवाचक संज्ञा है!",
    learningOutcome: "संज्ञा के प्रकार पहचानना"
  },
  {
    id: 42,
    subject: "hindi",
    subCategory: "व्याकरण",
    grade: 5,
    title: "सर्वनाम (Pronouns)",
    concept: "संज्ञा के स्थान पर प्रयुक्त शब्द",
    example: "मैं, तुम, वह, यह, कौन",
    funFact: "सर्वनाम का अर्थ है 'सभी नामों के लिए' (सर्व + नाम)!",
    emoji: "👤",
    question: "'वह स्कूल जाता है' में सर्वनाम कौन सा है?",
    options: ["स्कूल", "वह", "जाता", "है"],
    correctAnswer: 1,
    explanation: "'वह' सर्वनाम है जो किसी व्यक्ति के नाम की जगह आया है!",
    learningOutcome: "वाक्यों में सर्वनाम पहचानना"
  },
  {
    id: 43,
    subject: "hindi",
    subCategory: "व्याकरण",
    grade: 5,
    title: "क्रिया (Verbs)",
    concept: "जिस शब्द से कार्य होने का पता चले",
    example: "खाना, दौड़ना, पढ़ना, सोना",
    funFact: "हिंदी में क्रिया वाक्य के अंत में आती है!",
    emoji: "🏃",
    question: "'सांप तेज़ दौड़ता है' में क्रिया क्या है?",
    options: ["सांप", "तेज़", "दौड़ता", "है"],
    correctAnswer: 2,
    explanation: "'दौड़ता' क्रिया है जो काम (दौड़ने) को दर्शाता है!",
    learningOutcome: "वाक्यों में क्रिया पहचानना"
  },
  {
    id: 44,
    subject: "hindi",
    subCategory: "व्याकरण",
    grade: 5,
    title: "विशेषण (Adjectives)",
    concept: "संज्ञा या सर्वनाम की विशेषता बताने वाले शब्द",
    example: "सुंदर फूल, तेज़ गाड़ी, पांच सेब",
    funFact: "विशेषण हमेशा संज्ञा के साथ आते हैं!",
    emoji: "⭐",
    question: "'लाल सेब' में विशेषण कौन सा है?",
    options: ["लाल", "सेब", "दोनों", "कोई नहीं"],
    correctAnswer: 0,
    explanation: "'लाल' विशेषण है जो 'सेब' (संज्ञा) की विशेषता बताता है!",
    learningOutcome: "विशेषण पहचानना और प्रयोग करना"
  },
  {
    id: 45,
    subject: "hindi",
    subCategory: "व्याकरण",
    grade: 5,
    title: "लिंग (Gender)",
    concept: "स्त्रीलिंग और पुल्लिंग",
    example: "लड़का (पुल्लिंग), लड़की (स्त्रीलिंग)",
    funFact: "हिंदी में सभी संज्ञाओं का लिंग होता है!",
    emoji: "👦👧",
    question: "'किताब' किस लिंग में है?",
    options: ["पुल्लिंग", "स्त्रीलिंग", "दोनों", "कोई नहीं"],
    correctAnswer: 1,
    explanation: "'किताब' स्त्रीलिंग शब्द है। हम कहते हैं 'यह किताब अच्छी है'!",
    learningOutcome: "शब्दों का सही लिंग पहचानना"
  },
  {
    id: 46,
    subject: "hindi",
    subCategory: "व्याकरण",
    grade: 5,
    title: "वचन (Number)",
    concept: "एकवचन और बहुवचन",
    example: "लड़का (एकवचन), लड़के (बहुवचन)",
    funFact: "वचन से संख्या का पता चलता है - एक या अनेक!",
    emoji: "🔢",
    question: "'किताबें' किस वचन में है?",
    options: ["एकवचन", "बहुवचन", "दोनों", "कोई नहीं"],
    correctAnswer: 1,
    explanation: "'किताबें' बहुवचन है (एक से अधिक)। एकवचन 'किताब' होता है!",
    learningOutcome: "एकवचन और बहुवचन में बदलना"
  },
  {
    id: 47,
    subject: "hindi",
    subCategory: "शब्दावली",
    grade: 5,
    title: "मुहावरे (Idioms)",
    concept: "विशेष अर्थ देने वाले वाक्यांश",
    example: "'अंधे की लाठी' = एकमात्र सहारा",
    funFact: "मुहावरे भाषा को रंगीन और रोचक बनाते हैं!",
    emoji: "💬",
    question: "'आसमान से बातें करना' का अर्थ है:",
    options: ["बहुत ऊँचा होना", "हवा में उड़ना", "बादलों से बात करना", "शोर मचाना"],
    correctAnswer: 0,
    explanation: "इस मुहावरे का अर्थ है 'बहुत ऊँचा या महान होना'!",
    learningOutcome: "सामान्य मुहावरों का अर्थ और प्रयोग समझना"
  },
  {
    id: 48,
    subject: "hindi",
    subCategory: "शब्दावली",
    grade: 5,
    title: "पर्यायवाची और विलोम",
    concept: "समान और विपरीत अर्थ वाले शब्द",
    example: "सुंदर = खूबसूरत (पर्यायवाची), दिन ≠ रात (विलोम)",
    funFact: "हिंदी में एक शब्द के कई पर्यायवाची हो सकते हैं!",
    emoji: "🔄",
    question: "'प्रकाश' का विलोम शब्द क्या है?",
    options: ["अंधकार", "रोशनी", "उजाला", "चमक"],
    correctAnswer: 0,
    explanation: "'प्रकाश' (light) का विलोम 'अंधकार' (darkness) है!",
    learningOutcome: "पर्यायवाची और विलोम शब्द पहचानना"
  },

  // SOCIAL SCIENCE (12 topics: History, Geography, Civics)
  // HISTORY (4 topics)
  {
    id: 49,
    subject: "social-science",
    subCategory: "History",
    grade: 5,
    title: "The First Cities",
    concept: "Indus Valley Civilization - one of the oldest civilizations",
    example: "Harappa and Mohenjo-Daro had planned cities with drainage systems",
    funFact: "The Indus people had toilets and sewage systems 4500 years ago!",
    emoji: "🏛️",
    question: "Which river valley was home to the Indus Valley Civilization?",
    options: ["Ganga", "Yamuna", "Indus", "Brahmaputra"],
    correctAnswer: 2,
    explanation: "The Indus Valley Civilization developed along the Indus River (now in Pakistan)!",
    learningOutcome: "Understand early Indian civilizations"
  },
  {
    id: 50,
    subject: "social-science",
    subCategory: "History",
    grade: 5,
    title: "Kingdoms & Empires",
    concept: "Great empires that ruled ancient India",
    example: "Mauryan Empire (Ashoka), Gupta Empire (Golden Age)",
    funFact: "Emperor Ashoka spread Buddhism across Asia after the Kalinga war!",
    emoji: "👑",
    question: "Which emperor is known for spreading the message of peace and Buddhism?",
    options: ["Akbar", "Ashoka", "Chandragupta", "Harsha"],
    correctAnswer: 1,
    explanation: "Emperor Ashoka embraced non-violence after the bloody Kalinga war!",
    learningOutcome: "Learn about major ancient Indian empires"
  },
  {
    id: 51,
    subject: "social-science",
    subCategory: "History",
    grade: 5,
    title: "Delhi Sultanate",
    concept: "Medieval period of Islamic rule in India",
    example: "Qutub Minar built during Delhi Sultanate period",
    funFact: "The Qutub Minar is 73 meters tall - the tallest brick minaret in the world!",
    emoji: "🕌",
    question: "Who built the Qutub Minar?",
    options: ["Akbar", "Shah Jahan", "Qutb-ud-din Aibak", "Aurangzeb"],
    correctAnswer: 2,
    explanation: "Qutb-ud-din Aibak started building the Qutub Minar in 1192!",
    learningOutcome: "Understand medieval Indian history"
  },
  {
    id: 52,
    subject: "social-science",
    subCategory: "History",
    grade: 5,
    title: "Freedom Fighters",
    concept: "Heroes who fought for India's independence",
    example: "Mahatma Gandhi, Bhagat Singh, Subhash Chandra Bose",
    funFact: "India became independent on August 15, 1947!",
    emoji: "🇮🇳",
    question: "Who is known as the 'Father of the Nation' in India?",
    options: ["Jawaharlal Nehru", "Mahatma Gandhi", "Bhagat Singh", "Dr. Ambedkar"],
    correctAnswer: 1,
    explanation: "Mahatma Gandhi led India's non-violent freedom struggle!",
    learningOutcome: "Recognize contributions of freedom fighters"
  },

  // GEOGRAPHY (4 topics)
  {
    id: 53,
    subject: "social-science",
    subCategory: "Geography",
    grade: 5,
    title: "Maps & Globes",
    concept: "Tools to represent Earth's surface",
    example: "Globe = 3D model, Map = 2D representation",
    funFact: "The oldest known map is 4500 years old from Babylonia!",
    emoji: "🗺️",
    question: "What are the four main directions on a map?",
    options: ["Up, Down, Left, Right", "North, South, East, West", "Front, Back, Side, Center", "Top, Bottom, Middle, Edge"],
    correctAnswer: 1,
    explanation: "The cardinal directions are North, South, East, and West!",
    learningOutcome: "Read and interpret maps using directions"
  },
  {
    id: 54,
    subject: "social-science",
    subCategory: "Geography",
    grade: 5,
    title: "Major Landforms",
    concept: "Different physical features of Earth",
    example: "Mountains, plateaus, plains, deserts, islands",
    funFact: "Mount Everest grows about 4mm every year!",
    emoji: "⛰️",
    question: "Which is the highest mountain range in the world?",
    options: ["Western Ghats", "Himalayas", "Andes", "Alps"],
    correctAnswer: 1,
    explanation: "The Himalayas have the world's highest peaks including Mt. Everest!",
    learningOutcome: "Identify major landforms"
  },
  {
    id: 55,
    subject: "social-science",
    subCategory: "Geography",
    grade: 5,
    title: "Rivers of India",
    concept: "Major river systems and their importance",
    example: "Ganga, Yamuna, Brahmaputra, Godavari, Krishna",
    funFact: "The Ganga is considered holy in Hinduism!",
    emoji: "🌊",
    question: "Which river is known as the 'Sorrow of Bihar' due to frequent flooding?",
    options: ["Ganga", "Yamuna", "Kosi", "Brahmaputra"],
    correctAnswer: 2,
    explanation: "The Kosi river changes its course and causes devastating floods!",
    learningOutcome: "Learn about India's major rivers"
  },
  {
    id: 56,
    subject: "social-science",
    subCategory: "Geography",
    grade: 5,
    title: "Climate & Weather",
    concept: "India's seasons and weather patterns",
    example: "Summer, Monsoon, Winter, Spring",
    funFact: "Mawsynram in Meghalaya is the wettest place on Earth!",
    emoji: "🌦️",
    question: "Which season brings most rainfall to India?",
    options: ["Summer", "Winter", "Monsoon", "Spring"],
    correctAnswer: 2,
    explanation: "The monsoon (June-September) brings most of India's annual rainfall!",
    learningOutcome: "Understand India's climate and seasons"
  },

  // CIVICS (4 topics)
  {
    id: 57,
    subject: "social-science",
    subCategory: "Civics",
    grade: 5,
    title: "Government Types",
    concept: "Different ways countries are governed",
    example: "Democracy (people elect leaders), Monarchy (king/queen rules)",
    funFact: "India is the world's largest democracy!",
    emoji: "🏛️",
    question: "In which type of government do people elect their leaders?",
    options: ["Monarchy", "Democracy", "Dictatorship", "Autocracy"],
    correctAnswer: 1,
    explanation: "In a democracy, citizens vote to choose their government leaders!",
    learningOutcome: "Understand different forms of government"
  },
  {
    id: 58,
    subject: "social-science",
    subCategory: "Civics",
    grade: 5,
    title: "Fundamental Rights",
    concept: "Basic rights guaranteed to all Indian citizens",
    example: "Right to equality, freedom, education, constitutional remedies",
    funFact: "The Constitution of India has 6 Fundamental Rights!",
    emoji: "⚖️",
    question: "Which Fundamental Right allows children to go to school?",
    options: ["Right to Freedom", "Right to Equality", "Right to Education", "Right to Property"],
    correctAnswer: 2,
    explanation: "Right to Education (Article 21A) makes education free and compulsory for children aged 6-14!",
    learningOutcome: "Know basic fundamental rights"
  },
  {
    id: 59,
    subject: "social-science",
    subCategory: "Civics",
    grade: 5,
    title: "Our Constitution",
    concept: "The supreme law of India",
    example: "Written by Dr. B.R. Ambedkar, adopted on 26 Jan 1950",
    funFact: "Indian Constitution is the longest written constitution in the world!",
    emoji: "📜",
    question: "Who is known as the 'Father of the Indian Constitution'?",
    options: ["Mahatma Gandhi", "Jawaharlal Nehru", "Dr. B.R. Ambedkar", "Sardar Patel"],
    correctAnswer: 2,
    explanation: "Dr. B.R. Ambedkar was the chairman of the drafting committee of the Constitution!",
    learningOutcome: "Understand the importance of the Constitution"
  },
  {
    id: 60,
    subject: "social-science",
    subCategory: "Civics",
    grade: 5,
    title: "Local Government",
    concept: "Government at village and city level",
    example: "Gram Panchayat (village), Municipality (city)",
    funFact: "The Sarpanch is the head of a Gram Panchayat!",
    emoji: "🏘️",
    question: "What is the local government in villages called?",
    options: ["Municipality", "Gram Panchayat", "Municipal Corporation", "Nagar Palika"],
    correctAnswer: 1,
    explanation: "Gram Panchayat is the local self-government at the village level!",
    learningOutcome: "Understand local governance structures"
  },

  // PROGRAMMING (3 topics - keeping original)
  {
    id: 61,
    subject: "programming",
    grade: 5,
    title: "Loops",
    concept: "Repeating the same action multiple times",
    example: "for (i = 0; i < 10; i++) { collect_insect(); }",
    funFact: "Loops help game characters move smoothly 60 times every second!",
    emoji: "🔄",
    question: "What will this code output: for(i=1; i<=5; i++) { print(i*2); }",
    options: ["1, 2, 3, 4, 5", "2, 4, 6, 8, 10", "2, 4, 8, 16, 32", "1, 4, 9, 16, 25"],
    correctAnswer: 1,
    explanation: "The loop runs 5 times (i = 1 to 5) and prints i×2 each time: 2, 4, 6, 8, 10!",
    learningOutcome: "Understand loop concepts in programming"
  },
  {
    id: 62,
    subject: "programming",
    grade: 5,
    title: "If-Then Statements",
    concept: "Making decisions in code",
    example: "IF hit obstacle THEN lose life",
    funFact: "Every app on your phone uses millions of if-then decisions!",
    emoji: "🔀",
    question: "What is the output: IF(x=10) { print 'A' } ELSE IF(x>5) { print 'B' } ELSE { print 'C' } when x=10?",
    options: ["A", "B", "C", "AB"],
    correctAnswer: 0,
    explanation: "When x=10, the first condition (x=10) is true, so it prints 'A' and skips the rest!",
    learningOutcome: "Understand conditional logic"
  },
  {
    id: 63,
    subject: "programming",
    grade: 5,
    title: "Variables",
    concept: "Containers that store information",
    example: "let score = 0; score = score + 10;",
    funFact: "Your game score is stored in a variable that updates constantly!",
    emoji: "📦",
    question: "If x=5 and y=10, what is the value of z after: z = x + y * 2?",
    options: ["30", "25", "20", "15"],
    correctAnswer: 1,
    explanation: "Following order of operations (BODMAS): y * 2 = 20, then x + 20 = 25. Multiplication happens before addition!",
    learningOutcome: "Understand variables and operations"
  },
  {
    id: 64,
    subject: "science",
    subCategory: "Space Science",
    grade: 5,
    title: "Solar System Explorers",
    concept:
      "The Sun is at the center of our solar system. Eight planets orbit it at different speeds. Inner planets are rocky, outer planets are gas giants or icy worlds.",
    example:
      "Mercury zips around the Sun in just 88 days, while Neptune takes 165 Earth years! Earth takes 365 days to complete one orbit, giving us seasons.",
    funFact:
      "A day on Venus is longer than its year. It spins so slowly that it takes 243 Earth days to rotate once!",
    emoji: "🪐",
    question: "Which planet is known as the 'Red Planet'?",
    options: ["Mercury", "Venus", "Earth", "Mars"],
    correctAnswer: 3,
    explanation: "Mars looks red because its surface has iron-rich dust that rusts and reflects a reddish color.",
    learningOutcome: "Identify key features of planets in our solar system",
    assessmentQuestions: [
      {
        question: "Which planet is farthest from the Sun?",
        options: ["Mars", "Jupiter", "Saturn", "Neptune"],
        correctAnswer: 3,
        explanation: "Neptune orbits at the edge of our solar system, much farther than the other planets listed."
      },
      {
        question: "How long does Earth take to orbit the Sun once?",
        options: ["24 hours", "365 days", "30 days", "100 days"],
        correctAnswer: 1,
        explanation: "One Earth year equals 365 days—the time it takes to circle the Sun."
      },
      {
        question: "What force keeps planets moving around the Sun?",
        options: ["Wind", "Gravity", "Sunlight", "Clouds"],
        correctAnswer: 1,
        explanation: "Gravity is the invisible pull between objects. The Sun's gravity keeps planets in orbit."
      }
    ]
  },
  {
    id: 65,
    subject: "science",
    subCategory: "Physics",
    grade: 5,
    title: "Simple Machines & Force",
    concept:
      "Simple machines like levers, pulleys, and inclined planes change how force is applied. They make work easier by reducing the effort needed.",
    example:
      "A see-saw on a playground is a lever. A long crowbar helps lift a heavy rock because the longer arm multiplies force.",
    funFact:
      "Ancient Egyptians likely used ramps and rollers—simple machines—to build the pyramids!",
    emoji: "⚙️",
    question: "Which simple machine uses a wheel with a rope to lift heavy loads?",
    options: ["Lever", "Pulley", "Inclined plane", "Wedge"],
    correctAnswer: 1,
    explanation: "A pulley has a wheel and rope. Pulling down on the rope lifts the load upward with less effort.",
    learningOutcome: "Recognize simple machines and how they change force",
    assessmentQuestions: [
      {
        question: "Which object is a lever?",
        options: ["Ramp", "Seesaw", "Screw", "Wheelbarrow"],
        correctAnswer: 1,
        explanation: "A seesaw pivots around a fixed point (fulcrum), which makes it a lever."
      },
      {
        question: "A ramp used to push a box into a truck is which simple machine?",
        options: ["Inclined plane", "Pulley", "Wheel and axle", "Wedge"],
        correctAnswer: 0,
        explanation: "Ramps are inclined planes that spread the effort over a longer distance."
      },
      {
        question: "Why do screws have spirals?",
        options: ["For decoration", "To turn light into heat", "To change a turning force into forward motion", "To store air"],
        correctAnswer: 2,
        explanation: "A screw is an inclined plane wrapped around a cylinder. Turning it converts rotation into forward motion."
      }
    ]
  },
  {
    id: 66,
    subject: "evs",
    subCategory: "Environmental Science",
    grade: 5,
    title: "Reduce, Reuse, Recycle",
    concept:
      "The 3Rs help us care for Earth. Reduce means use less, Reuse means use things again, Recycle means turn waste into new items.",
    example:
      "Carrying a steel water bottle reduces plastic waste. Using old jars for pencil holders reuses materials. Recycling paper saves trees.",
    funFact:
      "Recycling one aluminium can saves enough energy to run a TV for 3 hours!",
    emoji: "♻️",
    question: "Which action best shows 'Reduce'?",
    options: ["Printing every worksheet twice", "Carrying a cloth bag instead of taking plastic bags", "Throwing bottles away", "Burning dry leaves"],
    correctAnswer: 1,
    explanation: "A cloth bag reduces the number of new plastic bags needed each time you shop.",
    learningOutcome: "Adopt eco-friendly habits for managing waste",
    assessmentQuestions: [
      {
        question: "Which bin should vegetable peels go into?",
        options: ["Dry waste", "Wet waste", "E-waste", "Glass"],
        correctAnswer: 1,
        explanation: "Vegetable peels are organic wet waste that can become compost."
      },
      {
        question: "How many Rs are there in the waste management slogan?",
        options: ["2", "3", "4", "5"],
        correctAnswer: 1,
        explanation: "Reduce, Reuse, Recycle—three powerful steps to protect the environment."
      },
      {
        question: "Which activity is an example of recycling?",
        options: ["Passing clothes to a younger cousin", "Using both sides of paper", "Melting old glass bottles to make new ones", "Buying more plastic toys"],
        correctAnswer: 2,
        explanation: "Turning used glass into new products is recycling—it gives materials a second life."
      }
    ]
  },
  {
    id: 67,
    subject: "english",
    subCategory: "Literature",
    grade: 5,
    title: "Poetry Toolbox",
    concept:
      "Poets use special devices like rhyme, rhythm, similes, and metaphors to make writing musical and imaginative.",
    example:
      "Simile: 'The snake moves like a ribbon in the wind.' Metaphor: 'The classroom was a buzzing hive.'",
    funFact:
      "Rabindranath Tagore wrote poems that children still sing today. He won the Nobel Prize for Literature in 1913!",
    emoji: "🎵",
    question: "Which poetic device compares two things using the words 'like' or 'as'?",
    options: ["Metaphor", "Simile", "Alliteration", "Personification"],
    correctAnswer: 1,
    explanation: "A simile uses 'like' or 'as' to compare—'brave as a lion'.",
    learningOutcome: "Identify common poetic devices in short poems",
    assessmentQuestions: [
      {
        question: "'Busy bees buzzed by the bush' is an example of which device?",
        options: ["Alliteration", "Metaphor", "Hyperbole", "Onomatopoeia"],
        correctAnswer: 0,
        explanation: "Alliteration repeats beginning sounds—here, the letter 'b'."
      },
      {
        question: "Which line has a metaphor?",
        options: ["The river sparkled like glass", "The classroom was a jungle", "As light as a feather", "Brighter than the sun"],
        correctAnswer: 1,
        explanation: "'Classroom was a jungle' directly says one thing is another—that's a metaphor."
      },
      {
        question: "What do we call the beat or pattern of stressed sounds in a poem?",
        options: ["Tone", "Rhythm", "Setting", "Dialogue"],
        correctAnswer: 1,
        explanation: "Rhythm is the musical pattern created by stressed and unstressed syllables."
      }
    ]
  },
  {
    id: 68,
    subject: "english",
    subCategory: "Writing",
    grade: 5,
    title: "Diary Writing",
    concept:
      "A diary entry records personal experiences, feelings, and reflections in first-person voice. It usually includes the date and is written like a friendly conversation with yourself.",
    example:
      "Tuesday, 5 March: Today our class coded a tiny snake game. I felt nervous at first but proud when it worked!",
    funFact:
      "Anne Frank's diary became famous for sharing her real experiences during World War II.",
    emoji: "📔",
    question: "Which sentence best fits the start of a diary entry?",
    options: ["Once upon a time...", "Dear Diary, today was the science fair!", "The moral of the story is...", "To whom it may concern"],
    correctAnswer: 1,
    explanation: "Diary entries often begin with a friendly greeting like 'Dear Diary' followed by the day's highlight.",
    learningOutcome: "Write reflective diary entries with feelings and details",
    assessmentQuestions: [
      {
        question: "Which point of view is used in diary writing?",
        options: ["First person", "Second person", "Third person", "All of them"],
        correctAnswer: 0,
        explanation: "You write about your own experiences using 'I' and 'my'."
      },
      {
        question: "What should appear at the top of a diary entry?",
        options: ["Chapter title", "Date and sometimes time", "Bibliography", "Signature of parents"],
        correctAnswer: 1,
        explanation: "Dates help track when events happened in your diary."
      },
      {
        question: "Which detail adds emotion to a diary entry?",
        options: ["I scored 8/10 in maths and felt super proud!", "The capital of India is New Delhi.", "There are 24 hours in a day.", "Water boils at 100°C."],
        correctAnswer: 0,
        explanation: "Sharing feelings (proud) makes the entry personal and reflective."
      }
    ]
  },
  {
    id: 69,
    subject: "social-science",
    subCategory: "Geography",
    grade: 5,
    title: "States & Capitals of India",
    concept:
      "India has 28 states and 8 Union Territories. Each state has a capital where the government works from.",
    example:
      "Maharashtra's capital is Mumbai, Karnataka's capital is Bengaluru, and Assam's capital is Dispur.",
    funFact:
      "Hyderabad is a shared capital for both Telangana and Andhra Pradesh (for a limited period).",
    emoji: "🗽",
    question: "What is the capital of Rajasthan?",
    options: ["Jaipur", "Bhopal", "Lucknow", "Patna"],
    correctAnswer: 0,
    explanation: "Jaipur, the Pink City, is the capital of Rajasthan.",
    learningOutcome: "Match Indian states with their capitals",
    assessmentQuestions: [
      {
        question: "Mumbai is the capital of which Indian state?",
        options: ["Gujarat", "Maharashtra", "Goa", "Kerala"],
        correctAnswer: 1,
        explanation: "Mumbai is the bustling capital city of Maharashtra."
      },
      {
        question: "Which state's capital is Itanagar?",
        options: ["Arunachal Pradesh", "Assam", "Sikkim", "Tripura"],
        correctAnswer: 0,
        explanation: "Itanagar is the capital of Arunachal Pradesh in northeast India."
      },
      {
        question: "Which capital city lies on the coast of the Bay of Bengal?",
        options: ["Jaipur", "Chennai", "Shimla", "Gangtok"],
        correctAnswer: 1,
        explanation: "Chennai in Tamil Nadu sits along the Bay of Bengal shoreline."
      }
    ]
  },
  {
    id: 70,
    subject: "social-science",
    subCategory: "Civics",
    grade: 5,
    title: "National Symbols of India",
    concept:
      "National symbols represent the pride and identity of our country. They include animals, birds, flags, songs, and emblems.",
    example:
      "The tricolour flag (Tiranga) has saffron for courage, white for peace, green for growth, and the blue Ashoka Chakra with 24 spokes.",
    funFact:
      "The national anthem 'Jana Gana Mana' takes about 52 seconds to sing properly!",
    emoji: "🇮🇳",
    question: "Which animal is India's national animal?",
    options: ["Elephant", "Bengal Tiger", "Peacock", "Lion"],
    correctAnswer: 1,
    explanation: "The Bengal tiger represents strength and grace, so it is our national animal.",
    learningOutcome: "Recall key national symbols and their meanings",
    assessmentQuestions: [
      {
        question: "What is India's national bird?",
        options: ["Sparrow", "Peacock", "Parrot", "Eagle"],
        correctAnswer: 1,
        explanation: "The peacock, with its colourful feathers, is India's national bird."
      },
      {
        question: "Name India's national flower.",
        options: ["Rose", "Sunflower", "Lotus", "Marigold"],
        correctAnswer: 2,
        explanation: "The lotus symbolises purity and is our national flower."
      },
      {
        question: "How many spokes are there in the Ashoka Chakra on the national flag?",
        options: ["12", "18", "24", "36"],
        correctAnswer: 2,
        explanation: "The Ashoka Chakra has 24 spokes, representing constant progress."
      }
    ]
  }
];
