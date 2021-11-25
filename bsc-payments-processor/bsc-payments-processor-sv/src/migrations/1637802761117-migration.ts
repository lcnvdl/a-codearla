import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1637802761117 implements MigrationInterface {
    name = 'migration1637802761117'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "receiving_wallet" ("id" varchar PRIMARY KEY NOT NULL, "lastBlock" varchar NOT NULL)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "receiving_wallet"`);
    }

}
