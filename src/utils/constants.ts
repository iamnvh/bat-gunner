export const HOURS_SPEND_CLAIM = 2 * 60 * 1000;

export const LIMIT_REFERRAL = 100;

export enum ClaimType {
  CLAIM_FOR_ME = 'claim_for_me',
  CLAIM_FOR_DIRECT_REF = 'claim_for_direct_ref',
  CLAIM_FOR_IN_DIRECT_REF = 'claim_for_in_direct_ref',
  CLAIM_FOR_MISSION = 'claim_for_mission',
  CLAIM_FOR_GAME = 'claim_for_game',
  CLAIM_FOR_BOOST = 'claim_for_boost',
}

export enum LevelClaimType {
  LEVEL_ONE = 1,
  LEVEL_TWO = 0.1,
  LEVEL_THREE = 0.025,
}

export enum MissionStatusType {
  FINISHED = 1,
  NOT_STARTED = 0,
}

export enum MissionType {
  SOCIAL = 'social',
  TARGET = 'target',
  DAILY_ONE = 'daily',
}

export enum GunType {
  PAID = 'paid',
  FREE = 'free',
  GIFTED = 'gifted',
}

export const INTRODUCE =
  "Now we're rolling out our Telegram mini app! Start farming points now, and who knows what cool stuff you'll snag with them soon! 🚀\n\nGot friends? Bring 'em in! The more, the merrier! 🌱\n\nRemember: Bat Gunner is where growth thrives and endless opportunities bloom! 🌼";

export enum GunStatusType {
  DISABLE = 0,
  ENABLE = 1,
}

export enum BoostStatusType {
  DISABLE = 0,
  ENABLE = 1,
}

export enum BoostLevelType {
  LEVEL_ZERO = 0,
  LEVEL_ONE = 1,
  LEVEL_TWO = 2,
  LEVEL_THREE = 3,
  LEVEL_FOUR = 4,
  LEVEL_FIVE = 5,
}
