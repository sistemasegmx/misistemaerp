import { AccountModel } from './account.model';
import { AuthModel } from './auth.model';

export class UserModel extends AuthModel {
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
  account: AccountModel;

  setUser(_user: unknown) {
    const user = _user as UserModel;

    this.id = user.id || '';
    this.email = user.email || '';
    this.username = user.username || '';
    this.password = user.password || '';
    this.fullname = user.fullname || '';
    this.phone = user.phone || '';
    this.description = user.description || '';
    this.type = user.type || '';
    this.image = user.image || './assets/img/nofoto.png';
    this.lastlogin = user.lastlogin || '';
    this.status = user.status;
    this.created_by = user.created_by;
    this.modified_by = user.modified_by;
  }
}