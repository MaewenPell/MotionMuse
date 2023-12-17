export type APIResponse<T> = {
  data: Array<T>;
  message: string;
  success: boolean;
};
