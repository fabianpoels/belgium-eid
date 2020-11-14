import pkcs11js = require("pkcs11js");
export default class Card {
    static pkcs11: pkcs11js.PKCS11;
    addressAndStreetNumber: string;
    addressMunicipality: string;
    addressZipcode: string;
    dateOfBirth: string;
    firstnames: string;
    surname: string;
    cardNumber: string;
    chipNumber: string;
    nationalNumber: string;
    nationality: string;
    gender: string;
    documentType: string;
    constructor();
    private initPkcs11();
    private readCard();
}
