export interface ICurrency {
    id: string;
    accountid: string;
    fullname: string;
    amount: string;
    symbol?: string;
    currency_precision?: string;
    thousand_separator?: string;
    decimal_separator?: string;
    code: string;
    status: string;
    created_by?: string;
    created_at?: string;
    modified_by?: string;
    modified_at?: string;
    [key: string]: any;

}
