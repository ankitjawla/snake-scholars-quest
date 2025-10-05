// Auto-generate assessment questions from topic data
import { AssessmentQuestion } from "@/data/educationalContent";

export const generateAssessmentQuestions = (topicId: number, topicQuestion: string, topicOptions: string[], correctAnswer: number, topicExplanation: string): AssessmentQuestion[] => {
  // Base question from the topic
  const baseQuestion: AssessmentQuestion = {
    question: topicQuestion,
    options: topicOptions,
    correctAnswer,
    explanation: topicExplanation,
  };

  // Generate 2 more variations by shuffling options
  const shuffledQuestions: AssessmentQuestion[] = [];
  
  for (let i = 0; i < 2; i++) {
    const shuffledOptions = [...topicOptions];
    const correctOption = shuffledOptions[correctAnswer];
    
    // Fisher-Yates shuffle
    for (let j = shuffledOptions.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      [shuffledOptions[j], shuffledOptions[k]] = [shuffledOptions[k], shuffledOptions[j]];
    }
    
    const newCorrectIndex = shuffledOptions.indexOf(correctOption);
    
    shuffledQuestions.push({
      question: topicQuestion,
      options: shuffledOptions,
      correctAnswer: newCorrectIndex,
      explanation: topicExplanation,
    });
  }

  // Return all 3 questions shuffled
  return [baseQuestion, ...shuffledQuestions].sort(() => Math.random() - 0.5).slice(0, 3);
};
