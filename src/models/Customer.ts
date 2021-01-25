export interface ICustomer {
  submitData: string;             // 등록 일시
  customer_name: string;          // 고객 명
  customer_mobile: string;        // 고객 전화번호
  device_name: string;            // 단말기 명
  device_color: string;           // 단말기 색상
  device_storage: string;         // 단말기 용량
  installment_plan: string;       // 할부 개월 수
  promo_company: string;          // 프로모션 회사 코드
  promo_name: string;             // 프로모션 회사 명
  masterPlan: string;             // 신규, 기변, 번호이동
  payPlan: string;                // 요금제
  isDone: boolean;                // 처리 유무
}
// export interface ICustomerMore {
//   device_name: string;
//   device_color: string;
//   device_storage: string;
//   installment_plan: string;
//   promo_company: string;
//   promo_name: string;
//   subscription_type: string;
// }
