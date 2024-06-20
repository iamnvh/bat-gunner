export enum ProfileStep {
  RECOGNIZATION = 'recognization',
  VERIFICATION = 'verification',
  PROFILE = 'profile',
  VERIFY = 'verify',
  VERIFIED = 'verified',
}

export const ScreenName = {
  YourLike: 'YourLike',
  Chat: 'Chat',
  Matched: 'Matched',
  Profile: 'Profile',
  Loved: 'Loved',
  PicpieeCreated: 'PicpieeCreated',
  PostDetail: 'PostDetail',
  PostCommentDetail: 'PostCommentDetail',
};

export const QUEUE_PROCESSOR = {
  ORAISWAP: {
    NAME: 'oraiswap',
    PROCESS: {
      SEND_REWARD: 'send-reward',
      SEND_REWARD_CHECK_IN: 'send-reward-check-in',
    },
  },
  FILE: {
    NAME: 'file',
    PROCESS: {
      COMPRESS: 'compress',
      UPLOAD_IMAGES: 'upload-images',
    },
  },
};

export const FixedLanguageNames = [
  'English',
  'French',
  'Spanish',
  'German',
  'Italian',
  'Chinese',
  'Japanese',
  'Russian',
  'Arabic',
  'Portuguese',
];

export const FILE_CHECK_TYPE = {
  NSFW: 'nsfw',
  FACE_MATCH: 'face-match',
};

export const ERROR_TYPE = {
  MAXIMUM_LIKED: 'maximumLiked',
};
