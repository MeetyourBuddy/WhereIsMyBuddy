export interface PhotoValidation {
  guidelines: string;
  requiredElements?: string[];
}

export interface ChecklistValidation {
  items: Array<{
    text: string;
    required: boolean;
  }>;
}

export interface HoursValidation {
  description: string;
  minHours?: number;
}

export type CheckInValidation =
  | PhotoValidation
  | ChecklistValidation
  | HoursValidation;
