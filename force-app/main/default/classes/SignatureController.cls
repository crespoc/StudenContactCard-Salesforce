public with sharing class SignatureController {
    @AuraEnabled
    public static void createFile(String base64Data, String fileName, Id contactId) {
        // Verifica que se pase un ID de contacto válido
        if (contactId == null) {
            throw new AuraHandledException('El ID de contacto no puede ser nulo.');
        }

        // Crea el archivo
        ContentVersion contentVersion = new ContentVersion();
        contentVersion.Title = fileName;
        contentVersion.PathOnClient = fileName;
        contentVersion.VersionData = EncodingUtil.base64Decode(base64Data);
        contentVersion.IsMajorVersion = true;
        insert contentVersion;

        // Relaciona el archivo al contacto
        ContentDocumentLink cdl = new ContentDocumentLink();
        cdl.ContentDocumentId = [SELECT Id FROM ContentDocument WHERE Id = :contentVersion.ContentDocumentId].Id;
        cdl.LinkedEntityId = contactId; // Relaciona el archivo al contacto
        cdl.ShareType = 'V';
        insert cdl;
    }
}
