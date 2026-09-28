import { CommentSchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Post from '#models/post'
import User from '#models/user'

export default class Comment extends CommentSchema {
  @belongsTo(() => Post)
  declare post: BelongsTo<typeof Post>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Comment)
  declare parent: BelongsTo<typeof Comment>

  @hasMany(() => Comment, { foreignKey: 'parentId' })
  declare replies: HasMany<typeof Comment>
}
