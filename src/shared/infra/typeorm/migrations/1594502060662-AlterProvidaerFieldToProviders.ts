import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export default class AlterProvidaerFieldToProviders1594502060662 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropColumn('appointments', 'provider');
      await queryRunner.addColumn(
       'appointments',
       new TableColumn({
        name: 'provider_id',
        type: 'uuid',
        isNullable: true,
       })
      );

      await queryRunner.createForeignKey('appointments', new TableForeignKey({
        name: 'AppintmentProvider',
        columnNames: ['provider_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL', // Quando o usurio for deletado seta NULL na minha tabela de appointments
        onUpdate: 'CASCADE' // Quando o usurio for atualizado atualiza o id do usuario na tabela appointments
      }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropForeignKey('apointments', 'AppointmentProvider');
      await queryRunner.dropColumn('appointments', 'provider_id');

      await queryRunner.addColumn('appointments', new TableColumn({
          name: 'provider',
          type: 'varchar',
      })
    )

    }

}
