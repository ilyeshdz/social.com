import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'notifications'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table
        .integer('recipient_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.integer('actor_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.string('type', 30).notNullable()
      table.integer('subject_id').nullable()
      table.timestamp('read_at').nullable()

      table.timestamp('created_at').notNullable()

      table.index(['recipient_id', 'created_at'])
      table.index(['recipient_id', 'read_at'])
      table.index(['actor_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
