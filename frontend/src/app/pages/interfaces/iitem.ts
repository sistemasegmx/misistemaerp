export interface IItem {
  id: string;
  accountid: string;
  categoryid: string;
  supplierid: string;
  categoryname: string;
  suppliername: string;
  code: string;
  code_alternative: string;
  description: string;
  unitkey: string;
  cost: string;
  price: string;
  image: string;
  type: string;
  status: string;
  created_by?: string;
  created_at?: string;
  modified_by?: string;
  modified_at?: string;
  [key: string]: any;
  isUpdating?: boolean;
}
