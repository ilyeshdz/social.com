import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'bookmarks'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.integer('post_id').notNullable().references('id').inTable('posts').onDelete('CASCADE')
      table.timestamp('created_at').notNullable()

      table.unique(['user_id', 'post_id'])
      table.index(['post_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
