/**
 * Apex sample: annotations, sharing, inner classes, SOQL, DML, maps, exceptions, and tests.
 */
public with sharing class ThemePreviewController {
    private static final Integer MAX_LIMIT = 50;
    private static final Pattern STAGE_PATTERN = Pattern.compile('^(Draft|Review|Published)$');

    public class PreviewRecord {
        @AuraEnabled public Id id { get; set; }
        @AuraEnabled public String name { get; set; }
        @AuraEnabled public String stage { get; set; }
        @AuraEnabled public Decimal score { get; set; }

        public PreviewRecord(Id id, String name, String stage, Decimal score) {
            this.id = id;
            this.name = name;
            this.stage = stage;
            this.score = score;
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<PreviewRecord> getPreviewRecords(Id parentId) {
        if (parentId == null) {
            throw new AuraHandledException('parentId is required');
        }

        List<Account> accounts = [
            SELECT Id, Name, Rating, AnnualRevenue
            FROM Account
            WHERE ParentId = :parentId OR Id = :parentId
            ORDER BY LastModifiedDate DESC
            LIMIT :MAX_LIMIT
        ];

        List<PreviewRecord> results = new List<PreviewRecord>();
        for (Account accountRecord : accounts) {
            String stage = normalizeStage(accountRecord.Rating);
            Decimal score = accountRecord.AnnualRevenue == null ? 0 : accountRecord.AnnualRevenue / 1000;
            results.add(new PreviewRecord(accountRecord.Id, accountRecord.Name, stage, score.setScale(2)));
        }
        return results;
    }

    @AuraEnabled
    public static Map<String, Object> publishPreview(Id parentId, List<String> tags) {
        Savepoint checkpoint = Database.setSavepoint();
        try {
            Task taskRecord = new Task(
                WhatId = parentId,
                Subject = 'Publish theme preview',
                Status = 'Completed',
                Priority = tags != null && tags.contains('urgent') ? 'High' : 'Normal'
            );
            insert taskRecord;

            return new Map<String, Object>{
                'taskId' => taskRecord.Id,
                'published' => true,
                'tagCount' => tags == null ? 0 : tags.size()
            };
        } catch (DmlException error) {
            Database.rollback(checkpoint);
            throw new AuraHandledException('Could not publish preview: ' + error.getMessage());
        }
    }

    private static String normalizeStage(String rating) {
        String candidate = String.isBlank(rating) ? 'Draft' : rating.trim();
        return STAGE_PATTERN.matcher(candidate).matches() ? candidate : 'Review';
    }

    @IsTest
    private class ThemePreviewControllerTest {
        @TestSetup
        static void setupData() {
            insert new Account(Name = 'Klang Parent', Rating = 'Published');
        }

        @IsTest
        static void getsPreviewRecords() {
            Account parent = [SELECT Id FROM Account LIMIT 1];

            Test.startTest();
            List<PreviewRecord> records = ThemePreviewController.getPreviewRecords(parent.Id);
            Test.stopTest();

            System.assertEquals(1, records.size(), 'Expected one preview record');
            System.assertEquals('Published', records[0].stage);
        }
    }
}
