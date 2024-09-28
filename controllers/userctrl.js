// This is the user controller including login and register
import {eq, lt, gte, ne, sql, and, or, count} from 'drizzle-orm'
const {loginPage, defaultPage, mainPage} = require('../views/userHtml')
import {authlib} from '../lib/userfuncs'

let base = {
  title: 'This is a title'
}
const debug = 1
function userctrl (fastify, options, next) {

  const api = fastify.api
  const db = fastify.db
  const render = fastify.render
  const cp = fastify.cp
  // const authlib = fastify.authlib
/*
  fastify.route({
    method: 'GET',
    url: '/',
    schema: {
    },
    preHandler: fastify.requires_login,
    handler: (req, reply) => {
      reply.type('application/text')
      reply.send('This is a default URL')
    }
  })
*/
  
  // add a login route that returns a login page
  fastify.route({
    method: 'GET',
    url: '/login',
    schema: {
    },
    handler: (req, reply) => {
      let hv = {flash: ''}
      reply.type('text/html')
      if (req.session.auth && req.session.auth.user && req.session.auth.user.id) {
        reply.send(defaultPage(true))
      }
      if (req.session && req.session.flash) {
        hv.flash = req.session.flash
        req.session.flash = ''
      }
      let en = cp(base, {title: 'Login Page', flash: hv.flash})
      return render('./views/user/login.njk', en)
    }
  })

  // add a login route that handles the actual login
  fastify.route({
    method: 'POST',
    url: '/login',
    schema: {
      body: {
        email: {type: 'string'},
        password: {type: 'string'}
      }
    },
    handler: async (req, reply) => {
      const {email, password} = req.body
      if (debug)
        console.log(email, password)
      let flash = ''
      let rows = await api.select({
        id: db.users.id,
        email: db.users.email,
        password: db.users.password,
        fname: db.users.fname,
        lname: db.users.lname
      })
      .from(db.users)
      .where(eq(db.users.email, email))
      if (debug)
        console.log('rows:', rows, rows.length)
      if (rows.length == 0) {
        req.session.flash = 'Email or password incorrect, please try again.'
        return reply.redirect('/login')
      }
      let row = rows[ 0 ]
      const matched = await authlib.validatePW(fastify, row.password, password)
      if (matched) {
        req.session.auth = {}
        req.session.auth = {
          fname: row.fname, lname: row.lname, email: row.email, id: row.id,
          companyid: row.companyid, utype: row.utype
        }
        reply.type('text/html')
        if (debug)
          console.log('logged in')
        return render('./views/user/loggedin.njk', {loggedin: true})
      } else {
        req.session.auth = {}
        req.session.flash = 'Email or password incorrect, please try again.'
        reply.redirect('/login')
      }
    }
  })

  // add a logout route
  fastify.route({
    method: 'GET',
    url: '/logout',
    schema: {
    },
    handler: (req, reply) => {
      if (req.session.auth && req.session.auth.id) {
        req.session.destroy((err) => {
          if (err) {
            reply.status(500)
            reply.send('Something went wrong. You do not have to do anything.') //Internal Server Error')
          } else {
            reply.redirect('/login')
          }
        })
      } else {
        reply.redirect('/')
      }
    }
  })

  // fastify.get('register', 
  fastify.route({
    method: 'GET',
    url: '/register',
    handler: function (req, reply) {
      // This is the page for registration just a email + userid + password
      reply.type('text/html')
      if (req.session && req.session.auth && req.session.auth.user && req.session.auth.user.id) {
        return reply.send('You are already logged in. Log out to register another user.')
      }
      console.log(render('./views/user/register.njk', {}))
      return render('./views/user/register.njk', {})
    }
  })

  // fastify.post('register', async (req, reply) => {
  fastify.route({
    method: 'POST',
    url: '/register',
    schema: {
      body: {
        fname: {type: 'string'},
        lname: {type: 'string'},
        email: {type: 'string'},
        password: {type: 'string'}
      }
    },
    handler: async function (req, reply) {
      // const session = req.session
      const out = await authlib.registerUser(fastify, req)
      console.log('==> out:', out)
      switch (out.rc.err) {
        case 0:
          reply.redirect('/login')
          break
        case 1:
          req.session.flash = 'User Already Exists'
          reply.redirect('/register')
          break
        default:
          reply.send('Should not get here')
      }
    }
  })
    
  next()
}

export {userctrl}
