import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1634868519530 implements MigrationInterface {
    name = 'migration1634868519530'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "wallet" ("id" varchar(100) PRIMARY KEY NOT NULL, "balance" integer NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "transaction" ("id" varchar(100) PRIMARY KEY NOT NULL, "walletId" varchar(100) NOT NULL, "date" datetime NOT NULL, "description" varchar NOT NULL, "from" varchar(100) NOT NULL, "to" varchar(100) NOT NULL, "amount" integer NOT NULL, "currencyId" integer)`);
        await queryRunner.query(`CREATE TABLE "currency" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "symbol" varchar(20) NOT NULL, "decimals" integer NOT NULL, "contract" varchar(100) NOT NULL, "url" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "temporary_transaction" ("id" varchar(100) PRIMARY KEY NOT NULL, "walletId" varchar(100) NOT NULL, "date" datetime NOT NULL, "description" varchar NOT NULL, "from" varchar(100) NOT NULL, "to" varchar(100) NOT NULL, "amount" integer NOT NULL, "currencyId" integer, CONSTRAINT "FK_a6eb26abbedbeaeb81ff45c5490" FOREIGN KEY ("currencyId") REFERENCES "currency" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_transaction"("id", "walletId", "date", "description", "from", "to", "amount", "currencyId") SELECT "id", "walletId", "date", "description", "from", "to", "amount", "currencyId" FROM "transaction"`);
        await queryRunner.query(`DROP TABLE "transaction"`);
        await queryRunner.query(`ALTER TABLE "temporary_transaction" RENAME TO "transaction"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" RENAME TO "temporary_transaction"`);
        await queryRunner.query(`CREATE TABLE "transaction" ("id" varchar(100) PRIMARY KEY NOT NULL, "walletId" varchar(100) NOT NULL, "date" datetime NOT NULL, "description" varchar NOT NULL, "from" varchar(100) NOT NULL, "to" varchar(100) NOT NULL, "amount" integer NOT NULL, "currencyId" integer)`);
        await queryRunner.query(`INSERT INTO "transaction"("id", "walletId", "date", "description", "from", "to", "amount", "currencyId") SELECT "id", "walletId", "date", "description", "from", "to", "amount", "currencyId" FROM "temporary_transaction"`);
        await queryRunner.query(`DROP TABLE "temporary_transaction"`);
        await queryRunner.query(`DROP TABLE "currency"`);
        await queryRunner.query(`DROP TABLE "transaction"`);
        await queryRunner.query(`DROP TABLE "wallet"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
