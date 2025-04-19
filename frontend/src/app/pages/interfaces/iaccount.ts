export interface IAccount {
    id: string;
    currencyid: string;
    taxid: string;
    nationality: string;
    fullname: string;
    rfc: string;
    fiscalname: string;
    fulladdress: string;
    description: string;
    email?: string;
    phone: string;
    company_usa: string;
    address_usa: string;
    phone_usa: string;
    slug?: string;
    image: string;
    type: string;
    status: string;
    created_by?: string;
    created_at?: string;
    modified_by?: string;
    modified_at?: string;
    [key: string]: any;
}
