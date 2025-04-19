export interface IEnte {
    id: string;
    accountid: string;
    code: string;
    fullname: string;
    nationality: string;
    rfc: string;
    fiscalname: string;
    fulladdress: string;
    email: string;
    phone: string;
    level: string;
    type: string;
    image: string;
    status: string;
    created_by?: string;
    created_at?: string;
    modified_by?: string;
    modified_at?: string;
    [key: string]: any;
}
