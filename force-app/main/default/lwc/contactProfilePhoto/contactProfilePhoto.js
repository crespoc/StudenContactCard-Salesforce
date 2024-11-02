import { LightningElement, api, wire } from 'lwc';
import getContactInfo from '@salesforce/apex/ContactImageController.getContactInfo';

export default class ContactProfilePhoto extends LightningElement {
    @api recordId;
    imageUrl;
    firstName;
    lastName;
    email;
    accountName;
    phone;

    @wire(getContactInfo, { contactId: '$recordId' })
    wiredContactInfo({ error, data }) {
        if (data) {
            console.log('Contact Info:', data);
            this.imageUrl = data.profilePhotoUrl;
            this.firstName = data.firstName;
            this.lastName = data.lastName;
            this.email = data.email;
            this.accountName = data.accountName;
            this.phone = data.phone;
        } else if (error) {
            console.error('Error retrieving contact info:', error);
        }
    }
}
