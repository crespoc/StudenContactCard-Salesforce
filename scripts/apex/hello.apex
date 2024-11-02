// Use .apex files to store anonymous Apex.
// You can execute anonymous Apex in VS Code by selecting the
//     apex text and running the command:
//     SFDX: Execute Anonymous Apex with Currently Selected Text
// You can also execute the entire file by running the command:
//     SFDX: Execute Anonymous Apex with Editor Contents


Account accObject = new Account();
accObject.Name = 'Test Account’;
accObject.Website =’www.salesforce.com’;
Insert accObject ;
List<Contact> contactList = new List<Contact>();
Contact con1 = new Contact();
con1.FirstName =’first’;
con1.LastName =’contact’;
con1.AccountId = accObject.Id;
contactList.add(con1);
Insert contactList;