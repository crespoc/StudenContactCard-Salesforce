import { LightningElement, track } from 'lwc';

export default class UserInfo extends LightningElement {
    @track userName = 'Waiting for data';
    @track userUsername = 'Waiting for data';
    @track userEmail = 'Waiting for data';
    @track userPhone = 'Waiting for data';
    @track userWebsite = 'Waiting for data';
    @track userAddress = 'Waiting for data';
    @track userGeo = 'Waiting for data';
    @track userCompanyName = 'Waiting for data';
    @track userCompanyCatchphrase = 'Waiting for data';
    @track userCompanyBS = 'Waiting for data';

    connectedCallback() {
        console.log('Component connected. Fetching user data...');
        this.fetchUserData();
    }

    fetchUserData() {
        fetch('https://jsonplaceholder.typicode.com/users/1')
            .then(response => {
                console.log('Response status:', response.status);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Fetched data:', data); // Log the entire fetched data

                this.userName = data.name;
                this.userUsername = data.username;
                this.userEmail = data.email;
                this.userPhone = data.phone;
                this.userWebsite = data.website;
                this.userAddress = `${data.address.suite}, ${data.address.street}, ${data.address.city}, ${data.address.zipcode}`;
                this.userGeo = `(${data.address.geo.lat}, ${data.address.geo.lng})`;
                this.userCompanyName = data.company.name;
                this.userCompanyCatchphrase = data.company.catchPhrase;
                this.userCompanyBS = data.company.bs;

                console.log('User data updated in component state:', {
                    userName: this.userName,
                    userUsername: this.userUsername,
                    userEmail: this.userEmail,
                    userPhone: this.userPhone,
                    userWebsite: this.userWebsite,
                    userAddress: this.userAddress,
                    userGeo: this.userGeo,
                    userCompanyName: this.userCompanyName,
                    userCompanyCatchphrase: this.userCompanyCatchphrase,
                    userCompanyBS: this.userCompanyBS
                });
            })
            .catch(error => {
                console.error('Fetch error:', error);
            });
    }
}
