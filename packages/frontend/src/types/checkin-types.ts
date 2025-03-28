export enum CheckInType {
  PHOTO = 'photo',
  CHECKLIST = 'checklist',
  HOURS = 'hours'
}

export interface CheckInContent {
  photo?: {
    imageUrl: string;
    caption?: string;
  };
  checklist?: {
    items: Array<{
      text: string;
      completed: boolean;
    }>;
  };
  hours?: {
    hours: number;
    notes?: string;
  };
}
