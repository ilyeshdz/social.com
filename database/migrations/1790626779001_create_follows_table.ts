import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'follows'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table
        .integer('follower_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table
        .integer('following_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.timestamp('created_at').notNullable()

      table.unique(['follower_id', 'following_id'])
      table.check('follower_id <> following_id')
      table.index(['follower_id'])
      table.index(['following_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
