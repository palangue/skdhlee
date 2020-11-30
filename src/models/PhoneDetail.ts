//export declare type PHONE_DETAIL = {
export interface PHONE_DETAIL {
  PhoneName: string;
  camera: string;
  camera_comment: string;
  inches: string;
  origin_price: string;
  power: string
  promo_category: string;
  size_x: string;
  size_y: string;
  size_z: string;
  storage: string;
  video: string;
  weight: string;
  installment_type: string;
  net_type_5g: boolean;
  net_type_lte: boolean;
  using_play_type: string;
  colors: Array<IColorSet>;
  gov_price: number;
  gov_price_end: number;
  gov_price_start: number;
  device_installment: Array<number>,
  mainImgSrc: string,
  price_change_device: number,
  price_new_regist: number,
  price_move_telecom: number,
  price_promotion: number
}

// 상품 리스트에서 팝업 또는 다음 화면에 전달 할 데이터
export interface ISelectedDeviceInfo {
  Name: string;
  DeviceName: string;
  PromotionCategory: string;
}

export interface IColorSet {
  name: string;
  value: string;
}

export interface IPhoneStorage {
  size: number;
  newRegist: string;
  changeDevice: string;
  changeNumber: string;
}
