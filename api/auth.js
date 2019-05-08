import express from 'express'
import Debug from 'debug'
import config from './config.js'
const log = Debug('api:auth')

const router = express.Router()

// Parse JSON payloads
router.use(express.json())

/**
 * Check credentials and create session
 */
router.post('/login', function(req, res, next) {
  const { username, password } = req.body

  if (
    config.auth.admin.username &&
    config.auth.admin.password &&
    config.auth.admin.username !== '' &&
    config.auth.admin.password !== '' &&
    username === config.auth.admin.username &&
    password === config.auth.admin.password
  ) {
    log(`Creating session for '${username}'`)

    const user = { username }

    // Store user in session
    req.session.user = user

    // Return user back to client
    res.json(user)
  } else {
    const err = new Error('Unauthorized')
    err.statusCode = 401
    return next(err)
  }
})

/**
 * Express middleware function to protect api requests from unauthenticated access
 */
export const authRequired = (req, res, next) => {
  // If the user is not authenticated
  if (!req.session || !req.session.user) {
    const err = new Error('Unauthorized')
    err.statusCode = 401
    return next(err)
  }
  next()
}

/**
 * Show details about the user from the session
 */
router.get('/me', authRequired, function(req, res) {
  return res.json(req.session.user)
})

/**
 * Destroy session
 */
router.post('/logout', authRequired, function(req, res, next) {
  log(`Destroying session for '${req.session.user.username}'`)

  // Remove the session
  delete req.session

  res.json({ status: 'ok' })
})

/**
 * List all sessions, session IDs are sensitive!
 */
router.get('/sessions', authRequired, async (req, res) => {
  const sessions = await req.sessionStore.sessionModel.findAll()
  sessions.map(e => {
    e.data = JSON.parse(e.dataValues.data)
    return e
  })

  res.json(sessions)
})

export default router
