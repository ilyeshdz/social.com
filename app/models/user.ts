import { UserSchema } from '#database/schema'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Bookmark from '#models/bookmark'
import Comment from '#models/comment'
import Follow from '#models/follow'
import Like from '#models/like'
import Notification from '#models/notification'
import Post from '#models/post'

/**
 * User model represents a user in the application.
 * It extends UserSchema and includes authentication capabilities
 * through the withAuthFinder mixin.
 */
export default class User extends compose(UserSchema, withAuthFinder(hash)) {
  @hasMany(() => Post)
  declare posts: HasMany<typeof Post>

  @hasMany(() => Comment)
  declare comments: HasMany<typeof Comment>

  @hasMany(() => Like)
  declare likes: HasMany<typeof Like>

  @hasMany(() => Bookmark)
  declare bookmarks: HasMany<typeof Bookmark>

  @hasMany(() => Notification, { foreignKey: 'recipientId' })
  declare notifications: HasMany<typeof Notification>

  @hasMany(() => Follow, { foreignKey: 'followerId' })
  declare followings: HasMany<typeof Follow>

  @hasMany(() => Follow, { foreignKey: 'followingId' })
  declare followers: HasMany<typeof Follow>

  /**
   * Get the user's initials from their username,
   * falling back to the email when it is empty.
   */
  get initials() {
    const source = this.username || this.email
    return source.slice(0, 2).toUpperCase()
  }
}
