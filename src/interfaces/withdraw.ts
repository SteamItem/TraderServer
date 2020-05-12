export interface IWithdrawMakerResult {
  successWithdrawCount: number;
  failWithdrawCount: number;
  successWithdrawItemCount: number;
  failWithdrawItemCount: number;
}

export interface IWithdrawResult {
  status: boolean;
  count: number;
}