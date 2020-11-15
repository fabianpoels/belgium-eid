import pkcs11js = require("pkcs11js");

export default class Card {

    static pkcs11: pkcs11js.PKCS11 = new pkcs11js.PKCS11();

    addressAndStreetNumber: string;
    addressMunicipality: string;
    addressZipcode: string;
    firstnames: string;
    surname: string;
    cardNumber: string;
    chipNumber: string;
    dateOfBirth: string;
    nationalNumber: string;
    nationality: string;
    gender: string;
    documentType: string;

    constructor() {
        this.firstnames = this.surname = this.cardNumber = this.chipNumber = this.nationalNumber = this.nationality = this.gender = this.documentType = "";
        this.addressAndStreetNumber = this.addressMunicipality = this.addressZipcode = this.dateOfBirth = "";
        this.readCard();
    }

    private initPkcs11(): void {
        try {
            // Card.pkcs11.load("C:\\Windows\\System32\\beidpkcs11.dll");
            Card.pkcs11.load("/usr/lib/x86_64-linux-gnu/libbeidpkcs11.so.0");
            Card.pkcs11.C_Initialize();
        } catch (error) {
            console.error(error);
        }
    }

    private readCard(): void {
       
        this.initPkcs11();
        
        let slots = Card.pkcs11.C_GetSlotList(true);
        let slot = slots[0];
        let session = Card.pkcs11.C_OpenSession(slot, pkcs11js.CKF_RW_SESSION | pkcs11js.CKF_SERIAL_SESSION);
        Card.pkcs11.C_FindObjectsInit(session, [{ type: pkcs11js.CKA_CLASS, value: pkcs11js.CKO_DATA }]);
        let hObject = Card.pkcs11.C_FindObjects(session);

        while (hObject) {

            let attrs = Card.pkcs11.C_GetAttributeValue(session, hObject, [
                { type: pkcs11js.CKA_LABEL },
                { type: pkcs11js.CKA_VALUE }
            ]);

            if(attrs[0].value !== undefined && attrs[1].value !== undefined) {
                switch (attrs[0].value.toString()) {
                    case "national_number":
                        this.nationalNumber = attrs[1].value.toString();
                        break;
                    case "firstnames":
                        this.firstnames = attrs[1].value.toString();
                        break;
                    case "surname":
                        this.surname = attrs[1].value.toString();
                        break;
                    case "card_number":
                        this.cardNumber = attrs[1].value.toString();
                        break;
                    case "chip_number":
                        this.chipNumber = attrs[1].value.toString();
                        break;
                    case "gender":
                        this.gender = attrs[1].value.toString();
                        break;
                    case "nationality":
                        this.nationality = attrs[1].value.toString();
                        break;
                    case "document_type":
                        this.documentType = attrs[1].value.toString();
                        break;
                    case "date_of_birth":
                        this.dateOfBirth = attrs[1].value.toString();
                        break;
                    case "address_street_and_number":
                        this.addressAndStreetNumber = attrs[1].value.toString();
                        break;
                    case "address_zip":
                        this.addressZipcode = attrs[1].value.toString();
                        break;
                    case "address_municipality":
                        this.addressMunicipality = attrs[1].value.toString();
                        break;
                }
            }
            
            hObject = Card.pkcs11.C_FindObjects(session);
        }

        Card.pkcs11.close();
    }

}