export interface IDepartment {
    id: string;
    accountid: string;
    managerid: string;
    managername?: string;
    fullname: string;
    description: string;
    status: string;
    created_by?: string;
    created_at?: string;
    modified_by?: string;
    modified_at?: string;
    [key: string]: any;
}
