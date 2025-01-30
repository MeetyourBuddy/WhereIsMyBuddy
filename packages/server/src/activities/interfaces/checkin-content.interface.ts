export interface PhotoContent {
  imageUrl: string;
  caption?: string;
}

export interface ChecklistItem {
  text: string;
  completed: boolean;
}

export interface ChecklistContent {
  items: ChecklistItem[];
}

export interface HoursContent {
  hours: number;
  notes?: string;
}

export type CheckInContent = PhotoContent | ChecklistContent | HoursContent;
