export interface Promotion{
    idx : string;
    bizone_price : number;
    promotion_target : string;
    promotion_target_company : string;
    date_start : number;
    date_end : number;
    support : Array<SupportPromotionDevice>;
}
export interface SupportPromotionDevice{
    name : string;
    price : number;
}