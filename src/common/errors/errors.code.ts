export const ERROR_CODES = {
  CONFLICT_EMAIL: 'CONFLICT_EMAIL',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  INVALID_INPUT: 'INVALID_INPUT',
  // add more as needed
} as const;

export type ERROR_CODES = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
