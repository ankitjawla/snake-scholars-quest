export interface FounderStory {
  id: number;
  name: string;
  age: number;
  company: string;
  city: string;
  country: string;
  achievement: string;
  lesson: string;
  quote: string;
  shortStory: string;
}

export const founderStories: FounderStory[] = [
  {
    id: 1,
    name: "Tilak Mehta",
    age: 13,
    company: "Papers N Parcels",
    city: "Mumbai",
    country: "India",
    achievement: "Built Mumbai's fastest courier service connecting dabbawallas with modern logistics",
    lesson: "Start with what you know: Tilak observed the dabbawalla system and built upon it",
    quote: "Don't wait to be old enough. Ideas have no age limit!",
    shortStory: "At 13, Tilak noticed how dabbawallas efficiently delivered lunch boxes. He created Papers N Parcels, connecting them with customers needing fast local delivery. Within months, he had 300+ deliveries per day!"
  },
  {
    id: 2,
    name: "Alina Morse",
    age: 9,
    company: "Zollipops",
    city: "Detroit",
    country: "USA",
    achievement: "Created sugar-free lollipops that clean teeth, now sold in 25,000+ stores",
    lesson: "Turn problems into opportunities: Alina wanted candy that wouldn't harm teeth",
    quote: "Why can't we make a lollipop that's good for your teeth?",
    shortStory: "After being told she couldn't have a lollipop at the bank because it was bad for her teeth, 7-year-old Alina asked, 'Why can't we make one that's actually good for teeth?' Two years later, Zollipops was born!"
  },
  {
    id: 3,
    name: "Mikaila Ulmer",
    age: 11,
    company: "Me & the Bees Lemonade",
    city: "Austin",
    country: "USA",
    achievement: "Built $11M lemonade business that saves bees, sold in Whole Foods nationwide",
    lesson: "Combine passion with purpose: Mikaila loves bees and turned that into a mission",
    quote: "Buy a lemonade, save a bee!",
    shortStory: "Stung by a bee twice in one week, Mikaila researched and fell in love with bees. She created a lemonade sweetened with honey, donating to bee conservation. Now it's in 1,500+ stores!"
  },
  {
    id: 4,
    name: "Moziah Bridges",
    age: 9,
    company: "Mo's Bows",
    city: "Memphis",
    country: "USA",
    achievement: "Fashion designer who appeared on Shark Tank and dressed NBA players",
    lesson: "Express yourself: Moziah couldn't find bowties he liked, so he made his own",
    quote: "You don't have to wait until you're older to be successful.",
    shortStory: "At 9, Moziah taught himself to sew bow ties because he wanted to dress sharp but couldn't find the styles he liked. His colorful bowties caught Daymond John's attention on Shark Tank, leading to mentorship and massive growth!"
  },
  {
    id: 5,
    name: "Ryan Kaji",
    age: 3,
    company: "Ryan's World",
    city: "Texas",
    country: "USA",
    achievement: "Started YouTube toy reviews at age 3, earning $29.5M by age 9",
    lesson: "Be authentic: Ryan's genuine reactions resonated with millions of kids",
    quote: "Let's open it and see what's inside!",
    shortStory: "Ryan asked his parents why he wasn't on YouTube like other kids. They started filming toy unboxings in 2015. His authentic enthusiasm made him the most-watched YouTuber, leading to his own toy line in Walmart!"
  },
  {
    id: 6,
    name: "Gitanjali Rao",
    age: 15,
    company: "Tethys / Kindly",
    city: "Colorado",
    country: "USA",
    achievement: "TIME's first-ever Kid of the Year, invented device to detect lead in water",
    lesson: "Science solves real problems: Use knowledge to help communities",
    quote: "If I can do it, anyone can do it!",
    shortStory: "Inspired by the Flint water crisis, 11-year-old Gitanjali invented Tethys, a device detecting lead in water using carbon nanotubes. She went on to create Kindly, an app detecting cyberbullying using AI!"
  },
  {
    id: 7,
    name: "Param Jaggi",
    age: 16,
    company: "Ecoviate",
    city: "Texas",
    country: "USA",
    achievement: "Invented device converting car emissions into oxygen",
    lesson: "Think big about climate: Young people can innovate for sustainability",
    quote: "Every problem is an opportunity for innovation.",
    shortStory: "At 14, Param noticed how much pollution cars create. He invented the Algae Mobile, a device using algae to convert carbon dioxide emissions into oxygen. He's now working on scaling this technology!"
  },
  {
    id: 8,
    name: "Isabella Rose Taylor",
    age: 13,
    company: "Isabella Rose Taylor",
    city: "Texas",
    country: "USA",
    achievement: "Fashion designer with paintings displayed in galleries worldwide",
    lesson: "Multiple talents: Combine art, fashion, and business",
    quote: "Age is just a number when you're following your passion.",
    shortStory: "Isabella started painting at 3 and designing clothes at 9. By 13, she was showing her collections at New York Fashion Week and selling in Nordstrom, proving art and business can thrive together!"
  },
  {
    id: 9,
    name: "Hart Main",
    age: 13,
    company: "ManCans",
    city: "Ohio",
    country: "USA",
    achievement: "Created masculine-scented candles, now in 150+ stores across USA",
    lesson: "Find market gaps: Hart noticed only 'girly' scented candles existed",
    quote: "Why can't guys have cool-smelling candles too?",
    shortStory: "Teasing his sister about her girly candle fundraiser, Hart realized there were no 'manly' scented candles. He created ManCans with scents like 'Campfire' and 'Fresh Cut Grass,' using soup cans as containers!"
  },
  {
    id: 10,
    name: "Akash Manoj",
    age: 16,
    company: "Manoj Innovation",
    city: "Chennai",
    country: "India",
    achievement: "Invented non-invasive heart attack detection device after grandfather's death",
    lesson: "Personal pain drives innovation: Turn grief into helping others",
    quote: "I want to make sure no one loses their loved ones like I did.",
    shortStory: "After his grandfather died from a silent heart attack, Akash spent 2 years researching. At 16, he invented a patch that detects heart attack biomarkers, potentially saving millions of lives!"
  },
  {
    id: 11,
    name: "Vrinda & Aarya Mann",
    age: 10,
    company: "Catch the Snake",
    city: "Delhi",
    country: "India",
    achievement: "Created an educational game teaching programming, math, and science",
    lesson: "Learning should be fun: Games can teach important skills",
    quote: "We wanted to make learning feel like playing!",
    shortStory: "Sisters Vrinda (10) and Aarya (9), students at Ryan International School Delhi, noticed their friends found learning boring. They created an interactive game combining fun gameplay with educational content in programming, math, and science!"
  },
];

export const innovationCities = [
  { name: "Delhi", country: "India", unlockLevel: 1, lat: 28.6139, lng: 77.2090 },
  { name: "Mumbai", country: "India", unlockLevel: 2, lat: 19.0760, lng: 72.8777 },
  { name: "Austin", country: "USA", unlockLevel: 3, lat: 30.2672, lng: -97.7431 },
  { name: "Detroit", country: "USA", unlockLevel: 4, lat: 42.3314, lng: -83.0458 },
  { name: "Memphis", country: "USA", unlockLevel: 5, lat: 35.1495, lng: -90.0490 },
  { name: "Chennai", country: "India", unlockLevel: 6, lat: 13.0827, lng: 80.2707 },
  { name: "Colorado", country: "USA", unlockLevel: 7, lat: 39.5501, lng: -105.7821 },
  { name: "New York", country: "USA", unlockLevel: 8, lat: 40.7128, lng: -74.0060 },
];
