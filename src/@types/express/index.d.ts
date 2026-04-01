declare namespace Express {
  export interface Request {
    user?: {
      sub: string;
      departmentId?: string;
      role?: "EMPLOYEE" | "MANAGER" | "ADMIN";
    };
  }
}
