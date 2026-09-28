import type { HttpContext } from '@adonisjs/core/http'

/**
 * SettingsController displays the settings area.
 */
export default class SettingsController {
  async index({ view }: HttpContext) {
    return view.render('pages/settings')
  }
}
