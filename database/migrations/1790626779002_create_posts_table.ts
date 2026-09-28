import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'posts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.integer('parent_id').nullable().references('id').inTable('posts').onDelete('CASCADE')
      table.text('content').notNullable()
      table.string('media_url', 504).nullable()
      table.integer('likes_count').notNullable().defaultTo(0)
      table.integer('comments_count').notNullable().defaultTo(0)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.index(['user_id'])
      table.index(['parent_id'])
      table.index(['created_at'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
