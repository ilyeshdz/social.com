import vine from '@vinejs/vine'

/**
 * Validator used when publishing a new post.
 */
export const createPostValidator = vine.create({
  content: vine.string().trim().minLength(1).maxLength(280),
})
