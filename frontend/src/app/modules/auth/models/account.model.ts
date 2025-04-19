export class AccountModel {
    id: string;
    currencyid: string;
    taxid: string;
    nationality: string;
    fullname: string;
    rfc: string;
    fiscalname: string;
    fulladdress: string;
    description: string;
    email: string;
    phone: string;
    company_usa: string;
    address_usa: string;
    phone_usa: string;
    defaultcomments: string;
    slug: string;
    image: string;
    type: string;
    status: string;
    created_by?: string;
    created_at?: string;
    modified_by?: string;
    modified_at?: string;

    setAccount(_account: unknown) {
        const account = _account as AccountModel;
        this.id = account.id;
        this.currencyid = account.currencyid;
        this.taxid = account.taxid;
        this.nationality = account.nationality;
        this.fullname = account.fullname;
        this.rfc = account.rfc;
        this.fiscalname = account.fiscalname;
        this.fulladdress = account.fulladdress;
        this.description = account.description;
        this.email = account.email;
        this.phone = account.phone;
        this.company_usa = account.company_usa;
        this.address_usa = account.address_usa;
        this.phone_usa = account.phone_usa;
        this.slug = account.slug;
        this.image = account.image;
        this.type = account.type;
        this.status = account.status;
        this.created_by = account.created_by;
        this.created_at = account.created_at;
        this.modified_by = account.modified_by;
        this.modified_at = account.modified_at;
    }
}