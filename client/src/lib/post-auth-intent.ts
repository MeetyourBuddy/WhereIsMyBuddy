export interface PostAuthIntentJoinActivity {
  type: "join-activity";
  activityId: string;
  returnTo?: string;
}

export interface PostAuthIntentConnectBuddy {
  type: "connect-buddy";
  userId: string;
  returnTo?: string;
}

export type PostAuthIntent = PostAuthIntentJoinActivity | PostAuthIntentConnectBuddy;

const POST_AUTH_INTENT_KEY = "postAuthIntent";

export const postAuthIntent = {
  set: (intent: PostAuthIntent) => {
    localStorage.setItem(POST_AUTH_INTENT_KEY, JSON.stringify(intent));
  },

  get: (): PostAuthIntent | null => {
    const raw = localStorage.getItem(POST_AUTH_INTENT_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as PostAuthIntent;
    } catch {
      return null;
    }
  },

  clear: () => {
    localStorage.removeItem(POST_AUTH_INTENT_KEY);
  },
};


