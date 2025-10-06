import type { EducationalTopic } from "@/data/educationalContent";

interface QuestionTemplate {
  difficulty: "easy" | "medium" | "hard";
  template: string;
  generateOptions: () => { question: string; options: string[]; correctIndex: number };
}

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Fraction question generators
const fractionTemplates: QuestionTemplate[] = [
  {
    difficulty: "easy",
    template: "simplify",
    generateOptions: () => {
      const num = randomInt(2, 10) * 2;
      const den = randomInt(2, 10) * 2;
      const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
      const divisor = gcd(num, den);
      const simplified = `${num / divisor}/${den / divisor}`;
      
      return {
        question: `Simplify the fraction: ${num}/${den}`,
        options: [
          simplified,
          `${num / 2}/${den / 2}`,
          `${num + 1}/${den + 1}`,
          `${num}/${den + 1}`
        ],
        correctIndex: 0
      };
    }
  },
  {
    difficulty: "medium",
    template: "add",
    generateOptions: () => {
      const num1 = randomInt(1, 5);
      const num2 = randomInt(1, 5);
      const den = randomInt(3, 8);
      const sum = num1 + num2;
      
      return {
        question: `What is ${num1}/${den} + ${num2}/${den}?`,
        options: [
          `${sum}/${den}`,
          `${num1 + num2}/${den * 2}`,
          `${sum}/${den + 1}`,
          `${num1}/${num2}`
        ],
        correctIndex: 0
      };
    }
  },
  {
    difficulty: "hard",
    template: "mixed",
    generateOptions: () => {
      const whole = randomInt(2, 5);
      const num = randomInt(1, 4);
      const den = randomInt(5, 8);
      const improper = whole * den + num;
      
      return {
        question: `Convert ${whole} ${num}/${den} to an improper fraction`,
        options: [
          `${improper}/${den}`,
          `${whole * num}/${den}`,
          `${improper}/${den + 1}`,
          `${whole}/${den}`
        ],
        correctIndex: 0
      };
    }
  }
];

// Number operations
const arithmeticTemplates: QuestionTemplate[] = [
  {
    difficulty: "easy",
    template: "addition",
    generateOptions: () => {
      const a = randomInt(10, 50);
      const b = randomInt(10, 50);
      const answer = a + b;
      
      return {
        question: `What is ${a} + ${b}?`,
        options: [
          String(answer),
          String(answer + randomInt(1, 10)),
          String(answer - randomInt(1, 10)),
          String(answer + randomInt(11, 20))
        ],
        correctIndex: 0
      };
    }
  },
  {
    difficulty: "medium",
    template: "multiplication",
    generateOptions: () => {
      const a = randomInt(6, 15);
      const b = randomInt(6, 15);
      const answer = a * b;
      
      return {
        question: `What is ${a} × ${b}?`,
        options: [
          String(answer),
          String(answer + a),
          String(answer - b),
          String(answer + b)
        ],
        correctIndex: 0
      };
    }
  },
  {
    difficulty: "hard",
    template: "division",
    generateOptions: () => {
      const quotient = randomInt(5, 20);
      const divisor = randomInt(3, 12);
      const dividend = quotient * divisor;
      
      return {
        question: `What is ${dividend} ÷ ${divisor}?`,
        options: [
          String(quotient),
          String(quotient + 1),
          String(quotient - 1),
          String(Math.floor(dividend / (divisor + 1)))
        ],
        correctIndex: 0
      };
    }
  }
];

export const generateDynamicQuestion = (
  topicId: number,
  difficulty: "easy" | "medium" | "hard" = "medium"
) => {
  // Select appropriate template bank based on topic
  let templates = arithmeticTemplates;
  
  if (topicId >= 3 && topicId <= 5) {
    // Fraction-related topics
    templates = fractionTemplates;
  }
  
  const filtered = templates.filter(t => t.difficulty === difficulty);
  const template = filtered[Math.floor(Math.random() * filtered.length)] || templates[0];
  
  return template.generateOptions();
};

export const generateAdaptiveQuestions = (
  topic: EducationalTopic,
  recentAccuracy: number
): Array<{ question: string; options: string[]; correctIndex: number }> => {
  let difficulty: "easy" | "medium" | "hard" = "medium";
  
  if (recentAccuracy < 0.5) {
    difficulty = "easy";
  } else if (recentAccuracy > 0.8) {
    difficulty = "hard";
  }
  
  const questions = [];
  for (let i = 0; i < 5; i++) {
    questions.push(generateDynamicQuestion(topic.id, difficulty));
  }
  
  return questions;
};
