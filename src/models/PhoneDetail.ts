//export declare type PHONE_DETAIL = {
export interface PHONE_DETAIL {
  PhoneName: string;          // 단말기 명 ( 예. 갤럭시 S20 FE )
  ModelName: string;          // 모델 명 ( 예. 갤럭시 S20 FE 256G )
  camera: string;             // 카메라
  camera_comment: string;     // 카메라 상세
  inches: string;             // 단말기 화면 크기 (인치)
  origin_price: string;       // 출시 가격 
  power: string;              // 전원 ( 12시간 연속 재생 등등. )
  promo_category: string;     // 필요한가 ?
  size_x: string;
  size_y: string;
  size_z: string;
  storage: IPhoneStorage;     // 단말기 저장 공간 + 신규 + 기변 + 번호이동 요금 ( 사용 안해도 될 듯 )
  video: string;              // 동영상
  weight: string;             // 무게
  installment_type: string;   // 할인 타입( 선택 약정, 공시 지원금 )
  net_type_5g: boolean;       // 5g 단말기 여부
  net_type_lte: boolean;      // LTE 단말기 여부
  using_play_type: string;
  colors: Array<IColorSet>;   // 단말기 색상 리스트
  gov_price: number;
  device_installment: Array<number>;
  mainImgSrc: string;   // 메인 이미지 위치
  storageSize: number;  // 단말기 용량
  NewDevice: number;    // 신규 가입 금액
  ChangeDevice: number; // 기기 변경 금액
  MoveNumber: number;   // 번호 이동 금액
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
  Size: number;
  NewDevice: number;
  ChangeDevice: number;
  MoveNumber: number;
}

export interface IPhonePrice {
  NewDevice: number;
  ChangeDevice: number;
  MoveNumber: number;
}
