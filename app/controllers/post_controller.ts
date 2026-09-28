import Post from '#models/post'
import User from '#models/user'
import { createPostValidator } from '#validators/post'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * PostController handles publishing new posts.
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
}
