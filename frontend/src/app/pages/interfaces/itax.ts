export interface ITax {
    id: string;
    accountid: string;
    fullname: string;
    description: string;
    amount: string;
    status: string;
    created_by?: string;
    created_at?: string;
    modified_by?: string;
    modified_at?: string;
    [key: string]: any;
}
