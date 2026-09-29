import Comment from '#models/comment'
import Post from '#models/post'
import { createCommentValidator } from '#validators/comment'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * CommentController handles publishing new comments on posts.
 */
export default class CommentController {
  /**
   * Persist a new comment and redirect back to the post
   */
  async store({ request, auth, response, params }: HttpContext) {
    const user = await auth.use('web').authenticate()
    const { content, parentId } = await request.validateUsing(createCommentValidator)
    const postId = params.id

    const post = await Post.findOrFail(postId)

    await Comment.create({
      userId: user.id,
      postId: post.id,
      content,
      parentId: parentId ?? null,
    })

    await Post.query().where('id', post.id).increment('comments_count', 1)

    return response.redirect().toRoute('posts.show', { id: post.id })
  }
}
