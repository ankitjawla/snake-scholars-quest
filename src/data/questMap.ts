import { educationalTopics } from "./educationalContent";

export interface QuestChapter {
  id: string;
  title: string;
  nickname: string;
  description: string;
  icon: string;
  color: string;
  theme: "forest" | "grove" | "alley" | "harbor" | "observatory" | "dojo";
  mapPosition: { x: number; y: number };
  topicIds: number[];
  badgeId: string;
  funFact: string;
}

export const questChapters: QuestChapter[] = [
  {
    id: "fractions-forest",
    title: "Fractions Forest",
    nickname: "Friendly Fractions",
    description: "Turn pizza slices and battery bars into brave math missions!",
    icon: "🌲",
    color: "from-emerald-400 to-green-600",
    theme: "forest",
    mapPosition: { x: 12, y: 72 },
    topicIds: [102, 4, 5],
    badgeId: "fraction-master",
    funFact: "Butterflies in the forest flap wings in perfect fractions of a second!",
  },
  {
    id: "geometry-grove",
    title: "Geometry Grove",
    nickname: "Shape Shifters",
    description: "Measure playgrounds, angle branches, and build forts with area magic.",
    icon: "📐",
    color: "from-blue-400 to-sky-600",
    theme: "grove",
    mapPosition: { x: 36, y: 48 },
    topicIds: [14, 9, 10],
    badgeId: "area-ace",
    funFact: "Trees grow in spiral patterns that follow secret geometry rules!",
  },
  {
    id: "algebra-alley",
    title: "Algebra Alley",
    nickname: "Puzzle Programmers",
    description: "Crack patterns, solve for x, and balance equations with street smarts.",
    icon: "🧩",
    color: "from-purple-400 to-indigo-600",
    theme: "alley",
    mapPosition: { x: 58, y: 62 },
    topicIds: [103, 15, 7],
    badgeId: "pattern-pro",
    funFact: "Street artists hide algebra patterns in murals all over the world!",
  },
  {
    id: "measurement-harbor",
    title: "Measurement Harbor",
    nickname: "Captain Measure",
    description: "Sail through capacity, volume, and time with trusty measuring mates.",
    icon: "⚓",
    color: "from-cyan-400 to-blue-500",
    theme: "harbor",
    mapPosition: { x: 74, y: 38 },
    topicIds: [107, 108, 1],
    badgeId: "measure-mate",
    funFact: "Harbor clocks use precise angles to guide ships safely home!",
  },
  {
    id: "data-observatory",
    title: "Data Observatory",
    nickname: "Chart Champions",
    description: "Read star charts, tally meteor showers, and decode secret data signals.",
    icon: "🔭",
    color: "from-amber-400 to-orange-500",
    theme: "observatory",
    mapPosition: { x: 20, y: 24 },
    topicIds: [13, 8, 6],
    badgeId: "data-detective",
    funFact: "Astronomers graph stars to discover brand-new planets!",
  },
  {
    id: "logic-dojo",
    title: "Logic Dojo",
    nickname: "Mind Ninjas",
    description: "Train with quick brain challenges and lightning-round mental math.",
    icon: "🥋",
    color: "from-rose-400 to-red-500",
    theme: "dojo",
    mapPosition: { x: 88, y: 70 },
    topicIds: [101, 105, 2],
    badgeId: "logic-legend",
    funFact: "Martial artists use patterns and timing—just like algebra and fractions!",
  },
];

export const chapterOrder = questChapters.map(chapter => chapter.id);

export const getChapterByTopicId = (topicId: number): QuestChapter | undefined =>
  questChapters.find(chapter => chapter.topicIds.includes(topicId));

export const getChapterIndex = (chapterId: string) =>
  chapterOrder.findIndex(id => id === chapterId);

export const getNextChapterId = (chapterId: string) => {
  const currentIndex = getChapterIndex(chapterId);
  if (currentIndex < 0) return undefined;
  return chapterOrder[currentIndex + 1];
};

export const getChapterTopics = (chapterId: string) => {
  const chapter = questChapters.find(c => c.id === chapterId);
  if (!chapter) return [];
  return chapter.topicIds
    .map(topicId => educationalTopics.find(topic => topic.id === topicId))
    .filter((topic): topic is NonNullable<typeof topic> => Boolean(topic));
};
