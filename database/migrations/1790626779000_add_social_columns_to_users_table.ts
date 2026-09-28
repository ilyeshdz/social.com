import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('username', 30).notNullable().defaultTo('').unique()
      table.text('bio').nullable()
      table.string('avatar_url', 504).nullable()
      table.string('website', 254).nullable()
      table.integer('followers_count').notNullable().defaultTo(0)
      table.integer('following_count').notNullable().defaultTo(0)
      table.integer('posts_count').notNullable().defaultTo(0)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('username')
      table.dropColumn('bio')
      table.dropColumn('avatar_url')
      table.dropColumn('website')
      table.dropColumn('followers_count')
      table.dropColumn('following_count')
      table.dropColumn('posts_count')
    })
  }
}
