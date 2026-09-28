import { PostSchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Comment from '#models/comment'
import Like from '#models/like'
import User from '#models/user'

export default class Post extends PostSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Post)
  declare parent: BelongsTo<typeof Post>

  @hasMany(() => Comment)
  declare comments: HasMany<typeof Comment>

  @hasMany(() => Like)
  declare likes: HasMany<typeof Like>
}
