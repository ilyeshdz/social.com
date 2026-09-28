import { test } from '@japa/runner'
import db from '@adonisjs/lucid/services/db'
import Bookmark from '#models/bookmark'
import Comment from '#models/comment'
import Follow from '#models/follow'
import Like from '#models/like'
import Notification from '#models/notification'
import Post from '#models/post'
import User from '#models/user'

test.group('Database foundation', (group) => {
  let seed = 0

  const createUser = () => {
    seed++
    return User.create({
      fullName: `Test User ${seed}`,
      email: `db-foundation-${seed}@test.dev`,
      password: 'secret1234',
      username: `db_foundation_${seed}`,
    })
  }

  group.each.teardown(async () => {
    await db.from('users').delete()
  })

  test('follows reject duplicates and self follows', async ({ assert }) => {
    const alice = await createUser()
    const bob = await createUser()

    await Follow.create({ followerId: alice.id, followingId: bob.id })

    await assert.rejects(() => Follow.create({ followerId: alice.id, followingId: bob.id }))
    await assert.rejects(() => Follow.create({ followerId: alice.id, followingId: alice.id }))
    await assert.rejects(() => Follow.create({ followerId: 999999, followingId: bob.id }))
  })

  test('likes are unique per user and post', async ({ assert }) => {
    const author = await createUser()
    const liker = await createUser()
    const post = await Post.create({ userId: author.id, content: 'Un post' })

    await Like.create({ userId: liker.id, postId: post.id })

    await assert.rejects(() => Like.create({ userId: liker.id, postId: post.id }))
    await assert.rejects(() => Like.create({ userId: liker.id, postId: 999999 }))
  })

  test('posts support replies and comments support threads', async ({ assert }) => {
    const author = await createUser()
    const reader = await createUser()
    const post = await Post.create({ userId: author.id, content: 'Un post' })
    const reply = await Post.create({ userId: reader.id, parentId: post.id, content: 'Réponse' })
    const comment = await Comment.create({
      userId: author.id,
      postId: post.id,
      content: 'Un commentaire',
    })
    const nested = await Comment.create({
      userId: reader.id,
      postId: post.id,
      parentId: comment.id,
      content: 'Une réponse',
    })

    assert.isTrue(reply.parentId === post.id)
    assert.isTrue(nested.parentId === comment.id)
    await assert.rejects(() =>
      Post.create({ userId: author.id, parentId: 999999, content: 'Orphelin' })
    )
    await assert.rejects(() =>
      Comment.create({ userId: author.id, postId: 999999, content: 'Orphelin' })
    )
  })

  test('bookmarks are unique per user and post', async ({ assert }) => {
    const author = await createUser()
    const saver = await createUser()
    const post = await Post.create({ userId: author.id, content: 'Un post' })

    await Bookmark.create({ userId: saver.id, postId: post.id })

    await assert.rejects(() => Bookmark.create({ userId: saver.id, postId: post.id }))
  })

  test('notifications link an actor to a recipient', async ({ assert }) => {
    const recipient = await createUser()
    const actor = await createUser()
    const post = await Post.create({ userId: recipient.id, content: 'Un post' })

    const notification = await Notification.create({
      recipientId: recipient.id,
      actorId: actor.id,
      type: 'like',
      subjectId: post.id,
    })

    assert.isNull(notification.readAt)
    await notification.related('actor').fetch()
    assert.equal(notification.actor.id, actor.id)
    await assert.rejects(() =>
      Notification.create({ recipientId: 999999, actorId: actor.id, type: 'follow' })
    )
  })

  test('deleting a user cascades to their content', async ({ assert }) => {
    const alice = await createUser()
    const bob = await createUser()
    const post = await Post.create({ userId: alice.id, content: 'Un post' })
    await Like.create({ userId: bob.id, postId: post.id })
    await Comment.create({ userId: bob.id, postId: post.id, content: 'Nice' })
    await Bookmark.create({ userId: bob.id, postId: post.id })
    await Follow.create({ followerId: bob.id, followingId: alice.id })
    await Notification.create({
      recipientId: alice.id,
      actorId: bob.id,
      type: 'follow',
    })

    await alice.delete()

    const count = async (table: string, column: string, value: number) => {
      const row = await db.from(table).where(column, value).count('* as total').first()
      return row?.total
    }

    assert.equal(await count('posts', 'user_id', alice.id), 0)
    assert.equal(await count('likes', 'post_id', post.id), 0)
    assert.equal(await count('comments', 'post_id', post.id), 0)
    assert.equal(await count('bookmarks', 'user_id', bob.id), 0)
    assert.equal(await count('follows', 'following_id', alice.id), 0)
    assert.equal(await count('notifications', 'recipient_id', alice.id), 0)
  })
})
