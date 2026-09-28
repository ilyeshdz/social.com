import { NotificationSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class Notification extends NotificationSchema {
  @belongsTo(() => User, { foreignKey: 'recipientId' })
  declare recipient: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'actorId' })
  declare actor: BelongsTo<typeof User>
}
