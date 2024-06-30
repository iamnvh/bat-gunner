export const HOURS_SPEND_CLAIM = 5 * 60 * 1000;

export const LIMIT_REFERRAL = 100;

export const POINT_REWARD = 60;

export enum CLAIM_TYPE {
  CLAIM_FOR_ME = 'claim_for_me',
  CLAIM_FOR_DIRECT_REF = 'claim_for_direct_ref',
  CLAIM_FOR_IN_DIRECT_REF = 'claim_for_in_direct_ref',
  CLAIM_FOR_MISSION = 'claim_for_mission',
  CLAIM_FOR_GAME = 'claim_for_game',
}

export enum LEVEL_CLAIM {
  LEVEL_ONE = 1,
  LEVEL_TWO = 0.1,
  LEVEL_THREE = 0.025,
}

export enum MISSION_STATUS {
  FINISHED = 'finished',
  NOT_STARTED = 'not_started',
}

export enum MISSION_TYPE {
  SOCIAL = 'social',
  TARGET = 'target',
}

export enum GUN_TYPE {
  GUN_BLACK = 1,
  GUN_RED = 2,
  GUN_GREEN = 3,
  GUN_BLUE = 4,
}

export const INTRODUCE =
  "Now we're rolling out our Telegram mini app! Start farming points now, and who knows what cool stuff you'll snag with them soon! 🚀\n\nGot friends? Bring 'em in! The more, the merrier! 🌱\n\nRemember: Bat Gunner is where growth thrives and endless opportunities bloom! 🌼";
