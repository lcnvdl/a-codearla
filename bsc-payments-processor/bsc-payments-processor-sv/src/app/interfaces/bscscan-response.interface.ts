export interface IBscScanResponse<T> {
  status: number;
  message: string;
  result: T;
}