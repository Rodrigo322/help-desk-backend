export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
};

export type ApiErrorResponse = {
  success: false;
  error: {
    message: string;
  };
};

export function successResponse<T>(data: T): ApiSuccessResponse<T> {
  return {
    success: true,
    data
  };
}

