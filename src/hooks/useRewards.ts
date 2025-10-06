import { useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { awardStars, updateStickerAlbum, recordBadge } from "@/utils/progressStorage";
import { REWARDS } from "@/constants/game";

export const useRewards = () => {
  const rewardCorrectAnswer = useCallback((streak: number = 1) => {
    const baseReward = REWARDS.CORRECT_ANSWER;
    const streakBonus = streak > 1 ? (streak - 1) * REWARDS.STREAK_BONUS : 0;
    const total = baseReward + streakBonus;
    
    const newTotal = awardStars(total);
    
    toast({
      title: "Great job! 🌟",
      description: `+${total} stars earned!${streak > 1 ? ` (${streak}x streak!)` : ""}`,
      duration: 2000,
    });
    
    return newTotal;
  }, []);

  const rewardLessonComplete = useCallback((topicId: number) => {
    const newTotal = awardStars(REWARDS.LESSON_COMPLETE);
    
    toast({
      title: "Lesson Complete! 🎉",
      description: `+${REWARDS.LESSON_COMPLETE} stars earned!`,
      duration: 3000,
    });
    
    return newTotal;
  }, []);

  const rewardAssessmentPass = useCallback(() => {
    const newTotal = awardStars(REWARDS.ASSESSMENT_PASS);
    
    toast({
      title: "Assessment Passed! 🏆",
      description: `+${REWARDS.ASSESSMENT_PASS} stars earned!`,
      duration: 3000,
    });
    
    return newTotal;
  }, []);

  const unlockSticker = useCallback((topicId: number, tier: number) => {
    updateStickerAlbum(topicId, tier);
    
    toast({
      title: "New Sticker Unlocked! ✨",
      description: `Tier ${tier} sticker added to your album!`,
      duration: 2000,
    });
  }, []);

  const earnBadge = useCallback((id: string, tier: 1 | 2 | 3, name: string) => {
    recordBadge(id, tier);
    
    toast({
      title: "Badge Earned! 🏅",
      description: name,
      duration: 3000,
    });
  }, []);

  return {
    rewardCorrectAnswer,
    rewardLessonComplete,
    rewardAssessmentPass,
    unlockSticker,
    earnBadge,
  };
};
