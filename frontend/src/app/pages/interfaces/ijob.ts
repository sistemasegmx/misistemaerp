export interface IJob {
  id: string;
  accountid: string;
  fullname: string;
  description: string;
  minsalary: string;
  maxsalary: string;
  status: string;
  created_by?: string;
  created_at?: string;
  modified_by?: string;
  modified_at?: string;
  [key: string]: any;

}
