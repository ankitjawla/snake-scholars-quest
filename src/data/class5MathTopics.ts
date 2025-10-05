// Class 5 Mathematics Topics - Based on NCERT Curriculum
// Simplified for 10-year-old students with fun examples and engaging content

import { EducationalTopic } from "./educationalContent";

export const class5MathTopics: EducationalTopic[] = [
  {
    id: 101,
    subject: "math",
    grade: 5,
    title: "Large Numbers",
    ncertChapter: "Chapter 1: We the Travellers - I",
    concept: "Big numbers are everywhere! Like counting all students in India or stars in the sky. We use place values: Ones, Tens, Hundreds, Thousands, Ten Thousands, Lakhs! Each place is 10 times bigger than the one before it.",
    example: "India has about 1,40,00,00,000 people! That's 1 Arab 40 Crore or 1.4 billion. To read it: Put commas from right in groups - 1,40,00,00,000. Easy peasy!",
    funFact: "A 'Googol' is 1 followed by 100 zeros! That's where Google got its name (but spelled differently). Also, the biggest number with a name is 'Googolplex' = 10 to the power of Googol! 🤯",
    emoji: "🔢",
    question: "In the number 52,847, what is the place value of 5?",
    options: [
      "50,000 (Fifty thousand)",
      "5,000 (Five thousand)",
      "500 (Five hundred)",
      "5 (Five)"
    ],
    correctAnswer: 0,
    explanation: "The 5 is in the ten thousands place! So 5 × 10,000 = 50,000. Count from right: Ones, Tens, Hundreds, Thousands, Ten Thousands!",
    learningOutcome: "Read and write large numbers up to 1 lakh using place values",
    assessmentQuestions: [
      {
        question: "Write 'Forty-three thousand two hundred fifty-six' in numerals:",
        options: ["43,256", "4,3256", "43256", "432,56"],
        correctAnswer: 0,
        explanation: "Break it: 43,000 + 200 + 56 = 43,256. Use comma after thousands!"
      },
      {
        question: "What is the value of 7 in 76,543?",
        options: ["70,000", "7,000", "700", "70"],
        correctAnswer: 0,
        explanation: "7 is in ten thousands place: 7 × 10,000 = 70,000!"
      },
      {
        question: "Which is bigger: 58,432 or 58,423?",
        options: ["58,432", "58,423", "Both equal", "Can't tell"],
        correctAnswer: 0,
        explanation: "Compare left to right: 5=5, 8=8, 4=4, 3>2, so 58,432 wins!"
      }
    ]
  },
  {
    id: 102,
    subject: "math",
    grade: 5,
    title: "Fractions - Parts of a Whole",
    ncertChapter: "Chapter 2: Fractions",
    concept: "A fraction shows a part of something! Like eating 3 out of 8 pizza slices = 3/8. Top number (numerator) = parts you have. Bottom number (denominator) = total equal parts.",
    example: "Your phone battery is at 3/4. That means 3 parts full out of 4 total parts. Same as 75%! If you use 1/4 more battery, you'll have: 3/4 + 1/4 = 4/4 = Full battery! 🔋",
    funFact: "Ancient Egyptians only used fractions with 1 on top! Like 1/2, 1/3, 1/4. To write 3/4, they'd write 1/2 + 1/4. Pretty cool math tricks! 🧮",
    emoji: "🍕",
    question: "Ramya ate 2/5 of a chocolate bar. Her friend ate 1/5. What fraction did they eat together?",
    options: ["3/5", "3/10", "2/6", "1/5"],
    correctAnswer: 0,
    explanation: "Same denominator, so just add numerators: 2/5 + 1/5 = (2+1)/5 = 3/5. Easy!",
    learningOutcome: "Add and subtract fractions with same denominators",
    assessmentQuestions: [
      {
        question: "What is 1/2 + 1/2?",
        options: ["1 (one whole)", "2/4", "1/4", "2/2"],
        correctAnswer: 0,
        explanation: "1/2 + 1/2 = 2/2 = 1 whole! Two halves make one complete thing!"
      },
      {
        question: "Which is bigger: 3/8 or 2/8?",
        options: ["3/8", "2/8", "Both equal", "Can't compare"],
        correctAnswer: 0,
        explanation: "Same denominator, so compare numerators: 3 > 2, so 3/8 is bigger!"
      },
      {
        question: "If you have 5/6 of a cake and eat 2/6, how much is left?",
        options: ["3/6", "7/6", "3/12", "5/12"],
        correctAnswer: 0,
        explanation: "Subtract: 5/6 - 2/6 = (5-2)/6 = 3/6. That's also equal to 1/2!"
      }
    ]
  },
  {
    id: 103,
    subject: "math",
    grade: 5,
    title: "Addition & Subtraction - Big Numbers",
    ncertChapter: "Chapter 4: We the Travellers - II",
    concept: "Adding = putting things together. Subtracting = taking away. For big numbers, line them up by place value (ones under ones, tens under tens). Carry over when needed!",
    example: "A library has 1,248 books. Gets 567 new books. Total = 1,248 + 567 = 1,815 books! If 392 are borrowed: 1,815 - 392 = 1,423 books left.",
    funFact: "The + and - symbols were invented in Germany around 1489! Before that, people wrote 'plus' and 'minus' with full words. Imagine writing homework then! 😅",
    emoji: "➕",
    question: "A train travels 1,456 km on Monday and 2,389 km on Tuesday. How many km total?",
    options: ["3,845 km", "3,735 km", "3,945 km", "4,845 km"],
    correctAnswer: 0,
    explanation: "Line up and add: 1,456 + 2,389 = 3,845 km. Add ones, tens, hundreds, thousands!",
    learningOutcome: "Add and subtract 4-digit numbers with carrying and borrowing",
    assessmentQuestions: [
      {
        question: "Solve: 5,678 + 3,456 = ?",
        options: ["9,134", "8,134", "9,034", "8,034"],
        correctAnswer: 0,
        explanation: "Add column by column: 8+6=14 (carry 1), 7+5+1=13 (carry 1), 6+4+1=11 (carry 1), 5+3+1=9. Answer: 9,134!"
      },
      {
        question: "What is 7,000 - 2,456?",
        options: ["4,544", "4,456", "5,544", "4,644"],
        correctAnswer: 0,
        explanation: "Borrow from zeros: 7,000 becomes 6,10,10,10. Then subtract: 10-6=4, 10-5=4, 10-4=5, 6-2=4. So 4,544!"
      },
      {
        question: "A shop had 8,234 toys. Sold 3,567. How many left?",
        options: ["4,667 toys", "4,767 toys", "4,567 toys", "5,667 toys"],
        correctAnswer: 0,
        explanation: "Subtract: 8,234 - 3,567 = 4,667 toys remaining!"
      }
    ]
  },
  {
    id: 104,
    subject: "math",
    grade: 5,
    title: "Multiplication - Quick Counting!",
    ncertChapter: "Chapter 9: Division",
    concept: "Multiplication is super-fast addition! Instead of adding 5 + 5 + 5 + 5, just do 5 × 4 = 20. It's like having groups of the same size.",
    example: "A garden has 24 rows with 18 plants each. Total plants = 24 × 18 = 432 plants. Way faster than counting one by one!",
    funFact: "Ancient Babylonians made the first multiplication tables 4,000 years ago on clay tablets! Indian mathematician Brahmagupta taught multiplying negative numbers in 628 CE. Math is ancient! 🏛️",
    emoji: "✖️",
    question: "A box has 12 chocolates. How many chocolates in 25 boxes?",
    options: ["300 chocolates", "250 chocolates", "350 chocolates", "275 chocolates"],
    correctAnswer: 0,
    explanation: "Multiply: 12 × 25 = (12 × 20) + (12 × 5) = 240 + 60 = 300 chocolates! Yummy! 🍫",
    learningOutcome: "Multiply 2-digit numbers using different strategies",
    assessmentQuestions: [
      {
        question: "What is 15 × 6?",
        options: ["90", "80", "95", "85"],
        correctAnswer: 0,
        explanation: "15 × 6 = (10 × 6) + (5 × 6) = 60 + 30 = 90!"
      },
      {
        question: "Solve: 23 × 4 = ?",
        options: ["92", "82", "102", "86"],
        correctAnswer: 0,
        explanation: "23 × 4 = (20 × 4) + (3 × 4) = 80 + 12 = 92!"
      },
      {
        question: "There are 18 bags with 15 marbles each. How many marbles total?",
        options: ["270 marbles", "250 marbles", "280 marbles", "260 marbles"],
        correctAnswer: 0,
        explanation: "18 × 15 = (18 × 10) + (18 × 5) = 180 + 90 = 270 marbles!"
      }
    ]
  },
  {
    id: 105,
    subject: "math",
    grade: 5,
    title: "Division - Fair Sharing",
    ncertChapter: "Chapter 9: Division Facts",
    concept: "Division means sharing equally! If you have 20 candies for 5 friends, each gets 20 ÷ 5 = 4 candies. Division is the opposite of multiplication!",
    example: "1,847 books need boxes that hold 24 books each. How many boxes? 1,847 ÷ 24 = 76 boxes with 23 books left over. So need 77 boxes total!",
    funFact: "The ÷ symbol is called 'obelus'! It was invented in 1659. In India, we also use the '/' symbol. Both mean the same thing! ➗",
    emoji: "➗",
    question: "96 students need to sit in groups of 8. How many groups?",
    options: ["12 groups", "11 groups", "13 groups", "10 groups"],
    correctAnswer: 0,
    explanation: "96 ÷ 8 = 12 groups. No remainder, perfect! Everyone sits with friends! 👥",
    learningOutcome: "Divide numbers and understand remainders",
    assessmentQuestions: [
      {
        question: "What is 144 ÷ 12?",
        options: ["12", "11", "13", "10"],
        correctAnswer: 0,
        explanation: "144 ÷ 12 = 12. Think: 12 × 12 = 144!"
      },
      {
        question: "Solve: 85 ÷ 5 = ?",
        options: ["17", "16", "18", "15"],
        correctAnswer: 0,
        explanation: "85 ÷ 5 = 17. Check: 17 × 5 = 85 ✓"
      },
      {
        question: "125 pencils packed in boxes of 10. How many boxes?",
        options: ["12 boxes with 5 left", "13 boxes", "12 boxes", "11 boxes with 15 left"],
        correctAnswer: 0,
        explanation: "125 ÷ 10 = 12 remainder 5. So 12 full boxes and 5 pencils extra!"
      }
    ]
  },
  {
    id: 106,
    subject: "math",
    grade: 5,
    title: "Shapes & Patterns",
    ncertChapter: "Chapter 7: Shapes and Patterns",
    concept: "Patterns repeat in a fun way! Like ABAB or 🔴🔵🔴🔵. Shapes can make cool designs when we put them together. Tessellation means covering a surface with shapes without gaps!",
    example: "Floor tiles make patterns! Square tiles fit perfectly together. Triangles and hexagons (6-sided) also make awesome tessellations. Bees use hexagons for honeycombs! 🐝",
    funFact: "M.C. Escher was an artist who made mind-blowing patterns with animals! His tessellations look like magic. You can be a pattern artist too! 🎨",
    emoji: "🔶",
    question: "What shape comes next in this pattern: Circle, Square, Triangle, Circle, Square, ___?",
    options: ["Triangle", "Circle", "Square", "Pentagon"],
    correctAnswer: 0,
    explanation: "Pattern repeats: Circle→Square→Triangle. So Triangle comes next! Then it starts over. 🔄",
    learningOutcome: "Identify and extend patterns using shapes and numbers",
    assessmentQuestions: [
      {
        question: "Complete: 2, 4, 6, 8, __?",
        options: ["10", "12", "9", "7"],
        correctAnswer: 0,
        explanation: "Pattern: add 2 each time. So 8 + 2 = 10!"
      },
      {
        question: "What's next: 🌟🌙🌟🌙🌟__?",
        options: ["🌙", "🌟", "☀️", "⭐"],
        correctAnswer: 0,
        explanation: "Alternating pattern: Star, Moon, Star, Moon... so Moon is next!"
      },
      {
        question: "Which shapes can tessellate (fit together perfectly)?",
        options: ["Squares and triangles", "Circles only", "Pentagons only", "Ovals"],
        correctAnswer: 0,
        explanation: "Squares and triangles fit together without gaps! Circles can't tessellate. Try drawing them!"
      }
    ]
  },
  {
    id: 107,
    subject: "math",
    grade: 5,
    title: "Measuring Length",
    ncertChapter: "Chapter 5: Far and Near",
    concept: "We measure length to know how long or far things are! Units: Centimeters (cm), Meters (m), Kilometers (km). 100 cm = 1 m, 1000 m = 1 km. Choose the right unit for the job!",
    example: "Your pencil: about 15 cm. Your height: maybe 140 cm = 1.4 m. Distance to school: perhaps 2 km. See? Different sizes, different units!",
    funFact: "The tallest statue in India is the Statue of Unity - 182 meters tall! That's taller than 60 grown-ups standing on each other! 🗿",
    emoji: "📏",
    question: "Convert to meters: 5 km 400 m = ? meters",
    options: ["5,400 m", "5,040 m", "540 m", "54 m"],
    correctAnswer: 0,
    explanation: "5 km = 5,000 m. Add 400 m: 5,000 + 400 = 5,400 m total!",
    learningOutcome: "Convert between cm, m, and km; measure and compare lengths",
    assessmentQuestions: [
      {
        question: "How many meters in 3 km?",
        options: ["3,000 m", "300 m", "30,000 m", "30 m"],
        correctAnswer: 0,
        explanation: "1 km = 1,000 m, so 3 km = 3 × 1,000 = 3,000 m!"
      },
      {
        question: "Which is longer: 250 cm or 2 m?",
        options: ["250 cm", "2 m", "Both equal", "Can't tell"],
        correctAnswer: 0,
        explanation: "250 cm = 2.5 m. So 250 cm > 2 m!"
      },
      {
        question: "A rope is 456 cm. How many meters and centimeters?",
        options: ["4 m 56 cm", "45 m 6 cm", "4 m 6 cm", "5 m 6 cm"],
        correctAnswer: 0,
        explanation: "456 ÷ 100 = 4 remainder 56. So 4 m 56 cm!"
      }
    ]
  },
  {
    id: 108,
    subject: "math",
    grade: 5,
    title: "Weight & Capacity",
    ncertChapter: "Chapter 8: Weight and Capacity",
    concept: "Weight tells how heavy something is! Units: Grams (g), Kilograms (kg). 1,000 g = 1 kg. Capacity is how much liquid something holds: Milliliters (ml), Liters (l). 1,000 ml = 1 l.",
    example: "An apple weighs about 150 g. A watermelon: 5 kg! A water bottle: 500 ml. A big bucket: 20 liters. We use the right unit for the size!",
    funFact: "An elephant weighs about 5,000 kg! A blue whale can weigh 150,000 kg - that's heavier than 25 elephants! 🐘🐋",
    emoji: "⚖️",
    question: "How many grams in 3 kg 250 g?",
    options: ["3,250 g", "3,025 g", "325 g", "32,500 g"],
    correctAnswer: 0,
    explanation: "3 kg = 3,000 g. Add 250 g: 3,000 + 250 = 3,250 g!",
    learningOutcome: "Convert between g and kg, ml and l; compare weights",
    assessmentQuestions: [
      {
        question: "What is 2 kg + 500 g in grams?",
        options: ["2,500 g", "2,050 g", "250 g", "7,500 g"],
        correctAnswer: 0,
        explanation: "2 kg = 2,000 g. Add 500 g: 2,000 + 500 = 2,500 g!"
      },
      {
        question: "Which holds more: 1,500 ml or 1 liter?",
        options: ["1,500 ml", "1 liter", "Both equal", "Can't compare"],
        correctAnswer: 0,
        explanation: "1,500 ml = 1.5 liters. So 1,500 ml > 1 liter!"
      },
      {
        question: "A bag of rice weighs 5 kg. What's that in grams?",
        options: ["5,000 g", "500 g", "50,000 g", "50 g"],
        correctAnswer: 0,
        explanation: "1 kg = 1,000 g. So 5 kg = 5 × 1,000 = 5,000 g!"
      }
    ]
  },
  {
    id: 109,
    subject: "math",
    grade: 5,
    title: "Perimeter & Area Adventures",
    ncertChapter: "Chapter 11: Area and Its Boundary",
    concept:
      "Perimeter measures the distance around a shape. Area measures the space inside a shape. We use square units like cm² or m² for area and plain units like cm or m for perimeter.",
    example:
      "Coach Riya wants a running track around a 20 m by 10 m rectangular field. Perimeter = 2 × (20 + 10) = 60 m of ribbon. To grow fresh grass inside, the gardener needs Area = 20 × 10 = 200 m² of seeds!",
    funFact:
      "India's cricket stadiums are measured in meters too! The Eden Gardens boundary is about 70 meters from the pitch on each side.",
    emoji: "📐",
    question: "A school garden is a rectangle 18 m long and 12 m wide. How many meters of fencing are needed for the boundary?",
    options: ["60 m", "72 m", "84 m", "96 m"],
    correctAnswer: 0,
    explanation:
      "Add the length and width then double it: (18 + 12) × 2 = 30 × 2 = 60 meters of fencing.",
    learningOutcome: "Calculate perimeter and area of rectangles and composite shapes",
    assessmentQuestions: [
      {
        question: "What is the area of a rectangle with length 25 m and width 8 m?",
        options: ["200 m²", "180 m²", "220 m²", "160 m²"],
        correctAnswer: 0,
        explanation: "Area = length × width = 25 × 8 = 200 square meters."
      },
      {
        question: "A square playground has a perimeter of 64 m. What is the length of one side?",
        options: ["16 m", "12 m", "8 m", "32 m"],
        correctAnswer: 0,
        explanation: "Perimeter of a square = 4 × side, so side = 64 ÷ 4 = 16 m."
      },
      {
        question: "Which shape has a larger area: Rectangle (12 m × 9 m) or rectangle (15 m × 6 m)?",
        options: ["12 × 9 rectangle", "15 × 6 rectangle", "Both equal", "Cannot compare"],
        correctAnswer: 0,
        explanation: "12 × 9 = 108 m² while 15 × 6 = 90 m². The first rectangle covers more space."
      },
      {
        question: "A floor is made of two rectangles: 5 m × 4 m and 3 m × 2 m. What is the total area?",
        options: ["26 m²", "20 m²", "34 m²", "28 m²"],
        correctAnswer: 0,
        explanation: "Find each area: 5 × 4 = 20 and 3 × 2 = 6. Add them: 20 + 6 = 26 m²."
      }
    ]
  },
  {
    id: 110,
    subject: "math",
    grade: 5,
    title: "Timetables & Time Travel",
    ncertChapter: "Chapter 4: Tick-Tick-Tick",
    concept:
      "We measure time in hours and minutes. 60 minutes = 1 hour. Timetables help us understand schedules like train timings, school periods, and sports fixtures.",
    example:
      "A metro leaves Central Station at 7:45 AM and reaches the museum at 8:32 AM. Travel time = 47 minutes. If you catch the 9:10 AM metro home, you get 38 minutes inside the museum!",
    funFact:
      "The Indian Railways timetable is one of the largest in the world. It coordinates more than 13,000 trains every day!",
    emoji: "⏱️",
    question: "The school assembly starts at 7:55 AM and classes begin at 8:15 AM. How long is the assembly?",
    options: ["10 minutes", "15 minutes", "20 minutes", "30 minutes"],
    correctAnswer: 2,
    explanation: "Count the minutes from 7:55 to 8:15. That's 20 minutes in total.",
    learningOutcome: "Read timetables, calculate elapsed time, and plan schedules",
    assessmentQuestions: [
      {
        question: "A cartoon starts at 4:35 PM and ends at 5:05 PM. What is its duration?",
        options: ["20 minutes", "25 minutes", "30 minutes", "35 minutes"],
        correctAnswer: 2,
        explanation: "From 4:35 to 5:05 is exactly 30 minutes."
      },
      {
        question: "The 6:20 PM bus is delayed by 18 minutes. When will it arrive?",
        options: ["6:28 PM", "6:38 PM", "6:42 PM", "6:48 PM"],
        correctAnswer: 1,
        explanation: "Add 18 minutes to 6:20 PM to get 6:38 PM."
      },
      {
        question: "Recess is 15 minutes long. If it ends at 11:10 AM, when did it begin?",
        options: ["10:55 AM", "10:57 AM", "10:58 AM", "10:50 AM"],
        correctAnswer: 0,
        explanation: "Work backwards: 11:10 − 15 minutes = 10:55 AM."
      },
      {
        question: "A train timetable shows departures every 25 minutes starting at 9:00 AM. When is the fourth train?",
        options: ["9:50 AM", "10:00 AM", "10:15 AM", "10:25 AM"],
        correctAnswer: 2,
        explanation: "List them: 9:00, 9:25, 9:50, 10:15. The fourth departure is 10:15 AM."
      }
    ]
  },
  {
    id: 111,
    subject: "math",
    grade: 5,
    title: "Smart Estimation",
    ncertChapter: "Chapter 3: How Many Squares?",
    concept:
      "Estimation helps us get quick answers by rounding numbers to nearby tens, hundreds, or thousands.",
    example:
      "A bookstore sells 198 comics, 305 novels, and 412 magazines in a week. Round to the nearest hundred: ≈ 200 + 300 + 400 = 900 books. The manager can order about 900 new books for next week.",
    funFact:
      "Mathematician Shakuntala Devi could estimate cube roots in seconds. She was called the 'Human Computer'!",
    emoji: "🧠",
    question: "Round 4,785 to the nearest hundred.",
    options: ["4,700", "4,780", "4,800", "4,900"],
    correctAnswer: 2,
    explanation: "The tens digit is 8 (five or more), so 4,785 rounds up to 4,800.",
    learningOutcome: "Use rounding and compatible numbers for quick estimates",
    assessmentQuestions: [
      {
        question: "Which is the best estimate for 198 + 403?",
        options: ["500", "600", "650", "700"],
        correctAnswer: 1,
        explanation: "Round to hundreds: 198 ≈ 200 and 403 ≈ 400. 200 + 400 = 600."
      },
      {
        question: "Estimate the product: 48 × 19",
        options: ["1,000", "900", "950", "1,100"],
        correctAnswer: 0,
        explanation: "48 ≈ 50 and 19 ≈ 20. 50 × 20 = 1,000, a close estimate."
      },
      {
        question: "Roughly how many minutes are in 5 hours?",
        options: ["240", "250", "300", "320"],
        correctAnswer: 2,
        explanation: "60 minutes × 5 hours ≈ 300 minutes."
      },
      {
        question: "A shopkeeper estimates ₹78 + ₹145 by rounding to the nearest ten. What estimate does she get?",
        options: ["₹220", "₹230", "₹240", "₹210"],
        correctAnswer: 1,
        explanation: "₹78 ≈ ₹80 and ₹145 ≈ ₹150. 80 + 150 = ₹230."
      }
    ]
  },
  {
    id: 112,
    subject: "math",
    grade: 5,
    title: "Data Detectives",
    ncertChapter: "Chapter 14: Smart Charts",
    concept:
      "Data is information we collect. We can show it using tally marks, pictographs, and bar graphs to spot patterns easily.",
    example:
      "Five friends tracked their daily steps: 4k, 6k, 7k, 5k, 9k. A bar graph makes it easy to see who walked the most. Divya's 9k steps win!",
    funFact:
      "ISRO scientists use data charts to track rocket fuel, speed, and altitude during launches!",
    emoji: "📊",
    question: "In a pictograph, each 🐾 stands for 200 steps. If Meera has 🐾🐾🐾🐾, how many steps did she walk?",
    options: ["600 steps", "800 steps", "1,000 steps", "1,200 steps"],
    correctAnswer: 1,
    explanation: "4 paw prints × 200 steps each = 800 steps.",
    learningOutcome: "Interpret charts and create simple graphs from data",
    assessmentQuestions: [
      {
        question: "A bar graph shows books read: Aryan 6, Kavya 4, Leena 8, Mohit 5. Who read the most?",
        options: ["Aryan", "Kavya", "Leena", "Mohit"],
        correctAnswer: 2,
        explanation: "Leena's bar reaches 8 books, the tallest bar."
      },
      {
        question: "How many votes in total if the tally marks show |||| ||| ?",
        options: ["5", "6", "7", "8"],
        correctAnswer: 3,
        explanation: "|||| = 5 and ||| = 3. Altogether 5 + 3 = 8 votes."
      },
      {
        question: "Which graph is best for showing 'Favourite Sports' data collected from classmates?",
        options: ["Bar graph", "Line graph", "Pie chart", "Flow chart"],
        correctAnswer: 0,
        explanation: "A bar graph compares categories like cricket, football, or badminton clearly."
      },
      {
        question: "A table shows weekly rainfall (mm): Mon 12, Tue 10, Wed 4, Thu 0, Fri 6. What was the total rainfall?",
        options: ["30 mm", "28 mm", "32 mm", "34 mm"],
        correctAnswer: 2,
        explanation: "Add them: 12 + 10 + 4 + 0 + 6 = 32 mm of rain."
      }
    ]
  }
];
