import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'comments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('post_id').notNullable().references('id').inTable('posts').onDelete('CASCADE')
      table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.integer('parent_id').nullable().references('id').inTable('comments').onDelete('CASCADE')
      table.text('content').notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.index(['post_id'])
      table.index(['user_id'])
      table.index(['parent_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
