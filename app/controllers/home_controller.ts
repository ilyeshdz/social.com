import Post from '#models/post'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * HomeController renders the timeline with the most recent posts.
 */
export default class HomeController {
  async index({ view }: HttpContext) {
    const posts = await Post.query().preload('user').orderBy('created_at', 'desc').limit(50)

    return view.render('pages/home', { posts })
  }
}
