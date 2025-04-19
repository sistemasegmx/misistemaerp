export interface IEnteContacts {
    id?: string;
    enteid: string | null;
    fullname: string;
    position: string;
    email: string;
    phone: string;
    created_by?: string;
    created_at?: string;
    modified_by?: string;
    modified_at?: string;
    [key: string]: any;
}
