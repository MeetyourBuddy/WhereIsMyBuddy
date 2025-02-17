export const checkInCardMockData = {
  daily: {
    date: 'March 15, 2024',
    stats: {
      checkedIn: 4,
      notCheckedIn: 1
    },
    message: 'Saturday is here! How are your tasks going?',
    hashtag: 'studyday',
    imageSrc: '/gallery/7.jpg',
    imageAlt: 'Daily check-in image',
    likes: 24,
    checkInsCount: 12,
    onCheckIn: () => console.log('Daily check-in clicked'),
    onViewAll: () => console.log('View all daily check-ins clicked')
  },
  weekly: {
    date: 'February 2, 2024',
    stats: {
      checkedIn: 3,
      notCheckedIn: 2
    },
    message: 'Weekly progress check! Share your achievements!',
    hashtag: 'weeklygoals',
    imageSrc: '/gallery/8.jpg',
    imageAlt: 'Weekly check-in image',
    likes: 89,
    checkInsCount: 45,
    onCheckIn: () => console.log('Weekly check-in clicked'),
    onViewAll: () => console.log('View all weekly check-ins clicked')
  },
  monthly: {
    date: 'January 10, 2024',
    stats: {
      checkedIn: 5,
      notCheckedIn: 0
    },
    message: 'Monthly reflection time! What did you learn this month?',
    hashtag: 'monthlyreview',
    imageSrc: '/gallery/4.jpg',
    imageAlt: 'Monthly check-in image',
    likes: 156,
    checkInsCount: 180,
    onCheckIn: () => console.log('Monthly check-in clicked'),
    onViewAll: () => console.log('View all monthly check-ins clicked')
  }
};
