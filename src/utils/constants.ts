export const HOURS_SPEND_CLAIM = 6 * 60 * 60 * 1000;

export const LIMIT_REFERRAL = 100;

export const POINT_REWARD = 60;

export enum CLAIM_TYPE {
  CLAIM_FOR_ME = 'claim_for_me',
  CLAIM_FOR_DIRECT_REF = 'claim_for_direct_ref',
  CLAIM_FOR_IN_DIRECT_REF = 'claim_for_in_direct_ref',
  CLAIM_FOR_MISSION = 'claim_for_mission',
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
