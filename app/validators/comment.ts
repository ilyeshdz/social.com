import vine from '@vinejs/vine'

/**
 * Validator used when publishing a new comment.
 */
export const createCommentValidator = vine.create({
  content: vine.string().trim().minLength(1).maxLength(2000),
  parentId: vine.number().optional(),
})
