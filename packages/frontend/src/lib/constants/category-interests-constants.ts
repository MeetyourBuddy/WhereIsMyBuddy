export const interestCategories = [
  { label: 'Technology', value: 'Technology' },
  { label: 'Science', value: 'Science' },
  { label: 'Arts', value: 'Arts' },
  { label: 'Sports', value: 'Sports' },
  { label: 'Music', value: 'Music' },
  { label: 'Travel', value: 'Travel' },
  { label: 'Food & Cooking', value: 'Food & Cooking' },
  { label: 'Fashion', value: 'Fashion' },
  { label: 'Gaming', value: 'Gaming' },
  { label: 'Books', value: 'Books' },
  { label: 'Movies', value: 'Movies' },
  { label: 'Fitness', value: 'Fitness' },
  { label: 'Photography', value: 'Photography' },
  { label: 'Education', value: 'Education' },
  { label: 'Business', value: 'Business' },
  { label: 'Nature', value: 'Nature' },
  { label: 'Pets', value: 'Pets' },
  { label: 'DIY', value: 'DIY' },
  { label: 'Writing', value: 'Writing' }
] as const;

export type InterestCategory = (typeof interestCategories)[number]['value'];

export const commoditiesByCategory: Record<
  InterestCategory,
  Array<{ label: string; value: string }>
> = {
  Technology: [
    { label: 'Web Development', value: 'Web Development' },
    { label: 'Mobile Apps', value: 'Mobile Apps' },
    { label: 'AI/ML', value: 'AI/ML' },
    { label: 'Cybersecurity', value: 'Cybersecurity' },
    { label: 'Cloud Computing', value: 'Cloud Computing' },
    { label: 'Blockchain', value: 'Blockchain' },
    { label: 'IoT', value: 'IoT' },
    { label: 'Data Science', value: 'Data Science' },
    { label: 'DevOps', value: 'DevOps' },
    { label: 'UI/UX Design', value: 'UI/UX Design' }
  ],
  Science: [
    { label: 'Physics', value: 'Physics' },
    { label: 'Chemistry', value: 'Chemistry' },
    { label: 'Biology', value: 'Biology' },
    { label: 'Astronomy', value: 'Astronomy' },
    { label: 'Mathematics', value: 'Mathematics' },
    { label: 'Environmental Science', value: 'Environmental Science' },
    { label: 'Neuroscience', value: 'Neuroscience' },
    { label: 'Genetics', value: 'Genetics' },
    { label: 'Quantum Computing', value: 'Quantum Computing' },
    { label: 'Robotics', value: 'Robotics' }
  ],
  Arts: [
    { label: 'Painting', value: 'Painting' },
    { label: 'Sculpting', value: 'Sculpting' },
    { label: 'Drawing', value: 'Drawing' },
    { label: 'Digital Art', value: 'Digital Art' },
    { label: 'Pottery', value: 'Pottery' },
    { label: 'Printmaking', value: 'Printmaking' },
    { label: 'Art History', value: 'Art History' },
    { label: 'Contemporary Art', value: 'Contemporary Art' },
    { label: 'Street Art', value: 'Street Art' },
    { label: 'Animation', value: 'Animation' }
  ],
  Sports: [
    { label: 'Football', value: 'Football' },
    { label: 'Basketball', value: 'Basketball' },
    { label: 'Tennis', value: 'Tennis' },
    { label: 'Golf', value: 'Golf' },
    { label: 'Soccer', value: 'Soccer' },
    { label: 'Baseball', value: 'Baseball' },
    { label: 'Swimming', value: 'Swimming' },
    { label: 'Martial Arts', value: 'Martial Arts' },
    { label: 'Cycling', value: 'Cycling' },
    { label: 'Rock Climbing', value: 'Rock Climbing' }
  ],
  Music: [
    { label: 'Rock', value: 'Rock' },
    { label: 'Pop', value: 'Pop' },
    { label: 'Jazz', value: 'Jazz' },
    { label: 'Classical', value: 'Classical' },
    { label: 'Hip-Hop', value: 'Hip-Hop' }
  ],
  Travel: [
    { label: 'Europe', value: 'Europe' },
    { label: 'Asia', value: 'Asia' },
    { label: 'Africa', value: 'Africa' },
    { label: 'North America', value: 'North America' },
    { label: 'South America', value: 'South America' }
  ],
  'Food & Cooking': [
    { label: 'Italian Cuisine', value: 'Italian Cuisine' },
    { label: 'Asian Cuisine', value: 'Asian Cuisine' },
    { label: 'Baking', value: 'Baking' },
    { label: 'Vegetarian/Vegan', value: 'Vegetarian/Vegan' },
    { label: 'Wine & Spirits', value: 'Wine & Spirits' },
    { label: 'Restaurant Reviews', value: 'Restaurant Reviews' },
    { label: 'Food Photography', value: 'Food Photography' },
    { label: 'Meal Planning', value: 'Meal Planning' },
    { label: 'Sustainable Food', value: 'Sustainable Food' },
    { label: 'Food Science', value: 'Food Science' }
  ],
  Fashion: [
    { label: 'Streetwear', value: 'Streetwear' },
    { label: 'High Fashion', value: 'High Fashion' },
    { label: 'Vintage', value: 'Vintage' },
    { label: 'Sustainable Fashion', value: 'Sustainable Fashion' },
    { label: 'Boutique Fashion', value: 'Boutique Fashion' }
  ],
  Gaming: [
    { label: 'Video Games', value: 'Video Games' },
    { label: 'Board Games', value: 'Board Games' },
    { label: 'Card Games', value: 'Card Games' },
    { label: 'Role-Playing Games', value: 'Role-Playing Games' },
    { label: 'Strategy Games', value: 'Strategy Games' }
  ],
  Books: [
    { label: 'Fiction', value: 'Fiction' },
    { label: 'Non-Fiction', value: 'Non-Fiction' },
    { label: 'Biographies', value: 'Biographies' },
    { label: 'Fantasy', value: 'Fantasy' },
    { label: 'Science Fiction', value: 'Science Fiction' }
  ],
  Movies: [
    { label: 'Action', value: 'Action' },
    { label: 'Adventure', value: 'Adventure' },
    { label: 'Comedy', value: 'Comedy' },
    { label: 'Drama', value: 'Drama' },
    { label: 'Horror', value: 'Horror' }
  ],
  Fitness: [
    { label: 'Yoga', value: 'Yoga' },
    { label: 'Pilates', value: 'Pilates' },
    { label: 'CrossFit', value: 'CrossFit' },
    { label: 'Weight Training', value: 'Weight Training' },
    { label: 'HIIT', value: 'HIIT' },
    { label: 'Running', value: 'Running' },
    { label: 'Calisthenics', value: 'Calisthenics' },
    { label: 'Personal Training', value: 'Personal Training' },
    { label: 'Nutrition', value: 'Nutrition' },
    { label: 'Mental Wellness', value: 'Mental Wellness' }
  ],
  Photography: [
    { label: 'Landscape', value: 'Landscape' },
    { label: 'Portrait', value: 'Portrait' },
    { label: 'Street', value: 'Street' },
    { label: 'Wildlife', value: 'Wildlife' },
    { label: 'Macro', value: 'Macro' }
  ],
  Education: [
    { label: 'Online Courses', value: 'Online Courses' },
    { label: 'Tutoring', value: 'Tutoring' },
    { label: 'Workshops', value: 'Workshops' },
    { label: 'Seminars', value: 'Seminars' },
    { label: 'Webinars', value: 'Webinars' }
  ],
  Business: [
    { label: 'Entrepreneurship', value: 'Entrepreneurship' },
    { label: 'Marketing', value: 'Marketing' },
    { label: 'Sales', value: 'Sales' },
    { label: 'Finance', value: 'Finance' },
    { label: 'Investment', value: 'Investment' },
    { label: 'Project Management', value: 'Project Management' },
    { label: 'Business Strategy', value: 'Business Strategy' },
    { label: 'E-commerce', value: 'E-commerce' },
    { label: 'Startups', value: 'Startups' },
    { label: 'Business Analytics', value: 'Business Analytics' }
  ],
  Nature: [
    { label: 'Hiking', value: 'Hiking' },
    { label: 'Camping', value: 'Camping' },
    { label: 'Gardening', value: 'Gardening' },
    { label: 'Wildlife', value: 'Wildlife' },
    { label: 'Birdwatching', value: 'Birdwatching' }
  ],
  Pets: [
    { label: 'Dogs', value: 'Dogs' },
    { label: 'Cats', value: 'Cats' },
    { label: 'Birds', value: 'Birds' },
    { label: 'Fish', value: 'Fish' },
    { label: 'Reptiles', value: 'Reptiles' }
  ],
  DIY: [
    { label: 'Home Improvement', value: 'Home Improvement' },
    { label: 'DIY Crafts', value: 'DIY Crafts' },
    { label: 'DIY Electronics', value: 'DIY Electronics' },
    { label: 'DIY Furniture', value: 'DIY Furniture' },
    { label: 'DIY Gardening', value: 'DIY Gardening' }
  ],
  Writing: [
    { label: 'Creative Writing', value: 'Creative Writing' },
    { label: 'Technical Writing', value: 'Technical Writing' },
    { label: 'Copywriting', value: 'Copywriting' },
    { label: 'Blog Writing', value: 'Blog Writing' },
    { label: 'Freelance Writing', value: 'Freelance Writing' }
  ]
};

export type Commodity = {
  label: string;
  value: string;
};

export const getCommoditiesForCategory = (
  category: InterestCategory | InterestCategory[]
): Commodity[] => {
  if (Array.isArray(category)) {
    return category.flatMap((cat) => commoditiesByCategory[cat]);
  }
  return commoditiesByCategory[category];
};

export const isCommodityInCategory = (
  category: InterestCategory,
  commodityValue: string
): boolean => {
  return commoditiesByCategory[category].some((commodity) => commodity.value === commodityValue);
};
