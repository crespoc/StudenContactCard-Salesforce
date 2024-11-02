public with sharing class ContactImageController {
    public class ContactInfo {
        @AuraEnabled public String profilePhotoUrl;
        @AuraEnabled public String firstName;
        @AuraEnabled public String lastName;
        @AuraEnabled public String email;
        @AuraEnabled public String phone;
        @AuraEnabled public String accountName; // Agregado para el nombre de la cuenta
    }

    @AuraEnabled(cacheable=true)
    public static ContactInfo getContactInfo(Id contactId) {
        ContactInfo contactInfo = new ContactInfo();
        try {
            // Consulta de información básica del Contacto incluyendo la cuenta relacionada
            Contact contact = [
                SELECT FirstName, LastName, Email, Phone, Account.Name
                FROM Contact
                WHERE Id = :contactId
                LIMIT 1
            ];
            contactInfo.firstName = contact.FirstName;
            contactInfo.lastName = contact.LastName;
            contactInfo.email = contact.Email;
            contactInfo.phone = contact.Phone;
            contactInfo.accountName = contact.Account != null ? contact.Account.Name : 'No Account'; // Manejar caso sin cuenta

            // Consulta para obtener la URL de la foto de perfil
            List<ContentDocumentLink> links = [
                SELECT ContentDocumentId 
                FROM ContentDocumentLink 
                WHERE LinkedEntityId = :contactId
            ];

            if (!links.isEmpty()) {
                List<Id> documentIds = new List<Id>();
                for (ContentDocumentLink link : links) {
                    documentIds.add(link.ContentDocumentId);
                }

                ContentDocument doc = [
                    SELECT LatestPublishedVersionId 
                    FROM ContentDocument 
                    WHERE Id IN :documentIds 
                    AND Title = 'profile photo' 
                    LIMIT 1
                ];

                if (doc != null) {
                    contactInfo.profilePhotoUrl = '/sfc/servlet.shepherd/version/download/' + doc.LatestPublishedVersionId;
                }
            }
            return contactInfo;
        } catch (Exception e) {
            throw new AuraHandledException('Error retrieving contact information');
        }
    }
}