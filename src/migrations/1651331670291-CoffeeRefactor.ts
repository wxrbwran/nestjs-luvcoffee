import { MigrationInterface, QueryRunner } from 'typeorm';

export class CoffeeRefactor1651331670291 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "coffee" RENAME COLUME "name" TO "title"`,
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "coffee" RENAME COLUME "title" TO "name"`,
    );
  }
}
