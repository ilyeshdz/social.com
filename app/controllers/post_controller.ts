import Post from '#models/post'
import User from '#models/user'
import { createPostValidator } from '#validators/post'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * PostController handles publishing new posts and displaying posts.
 */
export default class PostController {
  /**
   * Persist a new post and redirect back to the timeline
   */
  async store({ request, auth, response }: HttpContext) {
    const user = await auth.use('web').authenticate()
    const { content } = await request.validateUsing(createPostValidator)

    await Post.create({ userId: user.id, content })
    await User.query().where('id', user.id).increment('posts_count', 1)

    response.redirect().toRoute('home')
  }

  /**
   * Display a single post with its comments
   */
  async show({ view, params }: HttpContext) {
    const post = await Post.query()
      .where('id', params.id)
      .preload('user')
      .preload('comments', (query) => {
        query
          .preload('user')
          .whereNull('parent_id')
          .orderBy('created_at', 'asc')
          .preload('replies', (repliesQuery) => {
            repliesQuery.preload('user').orderBy('created_at', 'asc')
          })
      })
      .firstOrFail()

    return view.render('pages/posts/show', { post })
  }
}
