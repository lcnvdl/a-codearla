import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1634868805041 implements MigrationInterface {
    name = 'migration1634868805041'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_transaction" ("id" varchar(100) PRIMARY KEY NOT NULL, "walletId" varchar(100) NOT NULL, "date" datetime NOT NULL, "description" varchar NOT NULL, "from" varchar(100) NOT NULL, "to" varchar(100) NOT NULL, "amount" integer NOT NULL, "currencyId" integer, CONSTRAINT "FK_a6eb26abbedbeaeb81ff45c5490" FOREIGN KEY ("currencyId") REFERENCES "currency" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_900eb6b5efaecf57343e4c0e79d" FOREIGN KEY ("walletId") REFERENCES "wallet" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_transaction"("id", "walletId", "date", "description", "from", "to", "amount", "currencyId") SELECT "id", "walletId", "date", "description", "from", "to", "amount", "currencyId" FROM "transaction"`);
        await queryRunner.query(`DROP TABLE "transaction"`);
        await queryRunner.query(`ALTER TABLE "temporary_transaction" RENAME TO "transaction"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" RENAME TO "temporary_transaction"`);
        await queryRunner.query(`CREATE TABLE "transaction" ("id" varchar(100) PRIMARY KEY NOT NULL, "walletId" varchar(100) NOT NULL, "date" datetime NOT NULL, "description" varchar NOT NULL, "from" varchar(100) NOT NULL, "to" varchar(100) NOT NULL, "amount" integer NOT NULL, "currencyId" integer, CONSTRAINT "FK_a6eb26abbedbeaeb81ff45c5490" FOREIGN KEY ("currencyId") REFERENCES "currency" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "transaction"("id", "walletId", "date", "description", "from", "to", "amount", "currencyId") SELECT "id", "walletId", "date", "description", "from", "to", "amount", "currencyId" FROM "temporary_transaction"`);
        await queryRunner.query(`DROP TABLE "temporary_transaction"`);
    }

}
