export interface ISaleItems {
  id: string;
  saleid: string;
  itemid: string;
  code: string;
  description: string;
  qty: number;
  price: number;
  priceold: number;
  cost: number;
  estimated: string;
  created_by: string;
  created_at: string;
  modified_by: string;
  modified_at: string;
  [key: string]: any;
  isUpdating: boolean;
}