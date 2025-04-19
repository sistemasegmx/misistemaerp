export interface ICategory {
    id: string;
    accountid: string;
    categoryid: string;    
    fullname: string;
    description: string;
    image: string;
    status: string;
    created_by?: string;
    created_at?: string;
    modified_by?: string;
    modified_at?: string;
    [key: string]: any;
}
