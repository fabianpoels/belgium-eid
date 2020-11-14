"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pkcs11js = require("pkcs11js");
var Card = /** @class */ (function () {
    function Card() {
        this.firstnames = this.surname = this.cardNumber = this.chipNumber = this.nationalNumber = this.nationality = this.gender = this.documentType = "";
        this.addressAndStreetNumber = this.addressMunicipality = this.addressZipcode = this.dateOfBirth = "";
        this.readCard();
    }
    Card.prototype.initPkcs11 = function () {
        try {
            // Card.pkcs11.load("C:\\Windows\\System32\\beidpkcs11.dll");
            Card.pkcs11.load("/usr/lib/x86_64-linux-gnu/libbeidpkcs11.so.0");
            Card.pkcs11.C_Initialize();
        }
        catch (error) {
            console.error(error);
        }
    };
    Card.prototype.readCard = function () {
        this.initPkcs11();
        var slots = Card.pkcs11.C_GetSlotList(true);
        var slot = slots[0];
        var session = Card.pkcs11.C_OpenSession(slot, pkcs11js.CKF_RW_SESSION | pkcs11js.CKF_SERIAL_SESSION);
        Card.pkcs11.C_FindObjectsInit(session, [{ type: pkcs11js.CKA_CLASS, value: pkcs11js.CKO_DATA }]);
        var hObject = Card.pkcs11.C_FindObjects(session);
        while (hObject) {
            var attrs = Card.pkcs11.C_GetAttributeValue(session, hObject, [
                { type: pkcs11js.CKA_LABEL },
                { type: pkcs11js.CKA_VALUE }
            ]);
            if (attrs[0].value !== undefined && attrs[1].value !== undefined) {
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
                    case "addres_street_and_number":
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
    };
    Card.pkcs11 = new pkcs11js.PKCS11();
    return Card;
}());
exports.default = Card;
//# sourceMappingURL=card.js.map