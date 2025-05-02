import { apiMethods } from "@/services/api-methods";

export interface ICheckIn {
  activityId: string;
  type: 'text' | 'image';
  content: string;
  mediaUrl?: string;
}

export interface ICheckInResult extends ICheckIn {
  _id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export const CheckInService = {
  createCheckIn: (checkInData: ICheckIn, file?: File) => {
    const formData = new FormData();
    formData.append('activityId', checkInData.activityId.toString());
    formData.append('type', checkInData.type);
    formData.append('content', checkInData.content);
    if (file) {
      formData.append('file', file);
    }
    return apiMethods.post<ICheckInResult>("/checkins", formData, {
      'Content-Type': 'multipart/form-data',
    });
  },

  getCheckInsByActivity: (activityId: string) =>
    apiMethods.get<ICheckInResult[]>(`/checkins/activity/${activityId}`),

  getCheckInsByUser: (userId: string) =>
    apiMethods.get<ICheckInResult[]>(`/checkins/user/${userId}`),

  uploadFile: (activityId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiMethods.post<{ url: string; filename: string }>(
      `/checkins/upload/${activityId}`, 
      formData, 
      {
        'Content-Type': 'multipart/form-data',
      }
    );
  },

  getFiles: (activityId: string) =>
    apiMethods.get<Array<{ filename: string; url: string }>>(
      `/checkins/files/${activityId}`
    ),
}; 