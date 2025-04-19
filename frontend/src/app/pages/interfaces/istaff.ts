export interface IStaff {
  id: string;
  accountid: string;
  managerid: string;
  managername: string;
  fullname: string;
  dob: string;
  email: string;
  phone: string;
  fulladdress: string;
  hire_date: string;
  salary: string;
  have_user: string;
  image: string;
  status: string;
  created_by?: string;
  created_at?: string;
  modified_by?: string;
  modified_at?: string;
  [key: string]: any;
}
