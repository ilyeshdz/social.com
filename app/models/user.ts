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
   * Get the user's initials from their full name or email.
   * Returns the first letter of first and last name if available,
   * otherwise returns the first two characters of the email username.
   */
  get initials() {
    const [first, last] = this.fullName ? this.fullName.split(' ') : this.email.split('@')
    if (first && last) {
      return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
    }
    return `${first.slice(0, 2)}`.toUpperCase()
  }
}
