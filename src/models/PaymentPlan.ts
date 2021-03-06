export interface IPaymentPlan {
  month_discount: number;
  month_fix: number;
  month_pay_after_discount: number;
  total_discount: number;
  name: string;
  netKind: string;
}
export interface IPayPlan {
  name: string;
  netKind: string;
  actualMonthPay: number;
  monthPay: number;
  monthlyPay: number;
  totallyPay: number;
  //publicPrice: number;
}
export interface IPlan {
  name: string;
  PayPlan: IPayPlan[];
}

export interface IUserPlan {
  netKind: string;
  plan: IPlan[];
}
export interface IPlanDialogResult {
  code: number;
  message: string;
}
export interface PlanDataGroup {
  name: string;
  value: IPayPlan[];
}