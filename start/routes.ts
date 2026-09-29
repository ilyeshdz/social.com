/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

router.get('/', [controllers.Home, 'index']).as('home')

router
  .group(() => {
    router.post('posts', [controllers.Post, 'store']).as('posts.store')
    router.get('settings', [controllers.Settings, 'index']).as('settings')
    router.post('logout', [controllers.Session, 'destroy'])
    router.post('posts/:id/comments', [controllers.Comment, 'store']).as('comments.store')
  })
  .use(middleware.auth())

router.get('posts/:id', [controllers.Post, 'show']).as('posts.show')

router
  .group(() => {
    router.get('signup', [controllers.NewAccount, 'create'])
    router.post('signup', [controllers.NewAccount, 'store'])

    router.get('login', [controllers.Session, 'create'])
    router.post('login', [controllers.Session, 'store'])
  })
  .use(middleware.guest())
