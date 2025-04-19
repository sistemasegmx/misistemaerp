export interface IUser {
  id: string;
  accountid: string;
  employeeid: string;
  email: string;
  username: string;
  password?: string;
  fullname: string;
  phone: string;
  description: string;
  lastlogin: string;
  type: string;
  image: string;
  status: string;
  created_by: string;
  modified_by: string;
  [key: string]: any;

}
