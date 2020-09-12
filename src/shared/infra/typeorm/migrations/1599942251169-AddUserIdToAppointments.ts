import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AddUserIdToAppointments1599942251169
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'appointments',
      new TableColumn({
        name: 'user_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'appointments',
      new TableForeignKey({
        name: 'AppintmentUser',
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL', // Quando o usurio for deletado seta NULL na minha tabela de appointments
        onUpdate: 'CASCADE', // Quando o usurio for atualizado atualiza o id do usuario na tabela appointments
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('appointments', 'AppintmentUser');
    await queryRunner.dropColumn('appointments', 'user_id');
  }
}
