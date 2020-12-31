import { PlanDataGroup } from './PaymentPlan';
import { PHONE_DETAIL } from './PhoneDetail';

export interface Promotion {
  idx: string;
  // bizone_price: number;
  promotion_target: string;
  promotion_target_company: string;
  // date_start : number;
  // date_end : number;
  // support : Array<SupportPromotionDevice>;
}
export interface SupportPromotionDevice {
  changeDevice: string;
  deviceName: string;
  moveNumber: string;
  newDevice: string;
  planName: string;
  sktNetType: string;
  monthPay: string;
  publicPrice: string;
}

export interface PromotionDialogResult {
  code: number;
  message: string;
}

export interface PromoSupportDialogData {
  width: string;
  type: string;                     // 업체 등록 or 프로모션 단말기 + 요금제 별 복지금 등록
  company: string;                  // 프로모션 업체 명
  code: string;                     // 프로모션 업체 코드
  id: string;                       // 인덱스
  supportDeviceData: any;           // 프로모션 업체의 지원 단말기 목록
  phoneList: Array<PHONE_DETAIL>;   // 단말기 리스트
  planGroup: Array<PlanDataGroup>;  // 요금제 리스트
}