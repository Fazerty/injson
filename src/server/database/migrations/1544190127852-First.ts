import { MigrationInterface, QueryRunner } from 'typeorm';

export class First1544190127852 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE "project" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "icon" varchar NOT NULL, "title" varchar NOT NULL, "folder" varchar NOT NULL, "translations_folder" varchar NOT NULL, "key_search_regx" varchar NOT NULL, "files_filter" varchar NOT NULL)`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "project"`);
    }
}
