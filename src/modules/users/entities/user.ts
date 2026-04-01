export const USER_ROLE_VALUES = ["EMPLOYEE", "MANAGER", "ADMIN"] as const;
export type UserRole = (typeof USER_ROLE_VALUES)[number];
