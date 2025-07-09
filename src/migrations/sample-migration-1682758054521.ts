import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
  TableUnique,
} from 'typeorm';

export class SampleMigration1682758054521 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sample',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'status',
            type: 'varchar',
            default: `'ACTIVE'`,
          },
          {
            name: 'isMarried',
            type: 'boolean',
            isNullable: true,
            default: `'false'`,
          },
          {
            name: 'nationalCode',
            type: 'varchar',
          },
          {
            name: 'mobileNumber',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'birthday',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'profileImg',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'location',
            type: 'geometry',
            spatialFeatureType: 'Point',
            srid: 4326,
            isNullable: true,
          },
          {
            name: 'path',
            type: 'geometry',
            spatialFeatureType: 'LINESTRING',
            srid: 4326,
            isNullable: true,
          },
          {
            name: 'parentId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    // Add Foreign Keys
    await queryRunner.createForeignKey(
      'sample',
      new TableForeignKey({
        columnNames: ['parentId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'sample',
        onDelete: 'CASCADE',
      }),
    );

    // Add Unique Index
    await queryRunner.createUniqueConstraint(
      'sample',
      new TableUnique({
        columnNames: ['nationalCode'],
      }),
    );

    // Add other types Index
    await queryRunner.createIndices('sample', [
      new TableIndex({
        columnNames: ['location'],
        isSpatial: true,
      }),
      new TableIndex({
        columnNames: ['path'],
        isSpatial: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
