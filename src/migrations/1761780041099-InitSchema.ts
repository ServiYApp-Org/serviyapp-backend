import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1761780041099 implements MigrationInterface {
    name = 'InitSchema1761780041099'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "description" text, "status" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "services" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(150) NOT NULL, "description" text NOT NULL, "photo" character varying, "status" boolean NOT NULL DEFAULT true, "duration" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "providerId" uuid, "categoryId" uuid, CONSTRAINT "PK_ba2d347a3168a296416c6c5ccb2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "providers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying(100) NOT NULL, "lastName" character varying(100) NOT NULL, "userName" character varying(50) NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "profilePicture" character varying, "country" character varying, "city" character varying, "address" character varying, "role" character varying NOT NULL DEFAULT 'provider', "status" character varying NOT NULL DEFAULT 'pending', "registrationDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_cc81a3d6d5af7f5a552df03e20f" UNIQUE ("userName"), CONSTRAINT "UQ_32fe6bfe82d8e4959ba9d9fad42" UNIQUE ("email"), CONSTRAINT "PK_af13fc2ebf382fe0dad2e4793aa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "service_orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(150) NOT NULL, "description" text NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "providerId" uuid, CONSTRAINT "PK_914aa74962ee83b10614ea2095d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying(100) NOT NULL, "lastName" character varying(100) NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "phone" character varying(20), "role" character varying NOT NULL DEFAULT 'user', "status" character varying NOT NULL DEFAULT 'active', "profilePicture" character varying, "registrationDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "services" ADD CONSTRAINT "FK_8b619ef0a4fe392dbde07eee1e2" FOREIGN KEY ("providerId") REFERENCES "providers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "services" ADD CONSTRAINT "FK_034b52310c2d211bc979c3cc4e8" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "service_orders" ADD CONSTRAINT "FK_d9e28ea28bfeab7044f58f5c8ec" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "service_orders" ADD CONSTRAINT "FK_78cf014bc0e2c582f6af0443589" FOREIGN KEY ("providerId") REFERENCES "providers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "service_orders" DROP CONSTRAINT "FK_78cf014bc0e2c582f6af0443589"`);
        await queryRunner.query(`ALTER TABLE "service_orders" DROP CONSTRAINT "FK_d9e28ea28bfeab7044f58f5c8ec"`);
        await queryRunner.query(`ALTER TABLE "services" DROP CONSTRAINT "FK_034b52310c2d211bc979c3cc4e8"`);
        await queryRunner.query(`ALTER TABLE "services" DROP CONSTRAINT "FK_8b619ef0a4fe392dbde07eee1e2"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "service_orders"`);
        await queryRunner.query(`DROP TABLE "providers"`);
        await queryRunner.query(`DROP TABLE "services"`);
        await queryRunner.query(`DROP TABLE "categories"`);
    }

}
