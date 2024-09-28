// This is a starter server that includes the following:
// Bun, fastify, postgreSQL, drizzle-orm, and server side sessions stored in the database.
// More info available at https://github.com/jkelkar/bun_fastify_drizzle_pg_sample
// the js code is good but the html is lacking, this is because it is only a sample to get you started with it.

import Fastify from 'fastify'
const fastify = Fastify({logger: true})
import {drizzle} from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import {eq, lt, gte, ne, sql, and, or, count} from 'drizzle-orm'

// Before using a postgres database, copy the directory config.example to example and update data in config.json
// to reflect the actual settings for the database in use.

import config from './config/config.json'
const conf = config.dev.postgres
import * as db from './models/sample_schema'
const connString = `postgres://${conf.username}:${conf.password}@${conf.host}:${conf.port}/${conf.database}`
const client = postgres(connString)
let api = drizzle(client, {logger: true})

// Nunjucks
// We suffix all nunjucks enriched files with .njk. This keep them separate from fully rendered html files.
import nunjucks from 'nunjucks'
nunjucks.configure({autoescape: true})
const render = nunjucks.render

// Copy objects
const cp = (src, src2) => {
  return Object.assign(Object.assign({}, src), src2)
}

import fastifySession from '@fastify/session'
import fastifyCookie from '@fastify/cookie'
import fastifyFormbody from '@fastify/formbody'
import pgSimple from 'connect-pg-simple'
const PGStore = pgSimple(fastifySession)
import pointOfView from '@fastify/view'
import path from 'node:path'
import fileUpload from 'fastify-file-upload'
import fp from 'fastify-plugin'
import {authlib} from './lib/userfuncs.js'
import {load_decorators} from './lib/decorators.js'
import { userctrl } from './controllers/userctrl'
import { samplectrl } from './controllers/samplectrl.js'

// register various capabiliies
fastify.register(fileUpload)
fastify.register(fastifyFormbody)
fastify.register(fastifyCookie)
// To know more about setting up a table for sessions, read about in the docs directory
// Only once, you will need to manually create a table of the name you want to use
fastify.register(fastifySession, {
  store: new PGStore({
    conString: connString,
    tableName: 'session_table' // Can use another table name instead of session_table
    // on changing the table name, update table name in the database
  }),
  cookieName: 'sessionId',
  // put in your secret here - 32 characters or longer
    secret: 'Secrets, they are everywhere! Add one of yours here, wont you?',
  // resave: true,
  // saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 0.5 * 60 * 60 * 1000 // 1/2 hour
  }
})

// register static file handler
fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, '.'),
  prefix: '/'
})

// We make the following available in fastity to use as needed
// db: the models exposed
// api: database functions
// render: function to render templates with data under nunjucks
// cp: an object copying function to create context easily
// auth: an entry into authlib which contains code used to authorize users for actions
function dbPlugin (fastify, opts, done) {
  console.log('opts:', opts)
  fastify.decorate('db', db)
  fastify.decorate('api', api)
  fastify.decorate('render', render)
  fastify.decorate('cp', cp)
  fastify.decorate('auth', authlib)
  done()
}

fastify.register(fp(dbPlugin))

// set up all decorators -  see lib/decorators.js
load_decorators(fastify)

// Add in routes
// register controllers loaded earlier
// userctrl give you the basic user functions: register, login, logout, change password
fastify.register(userctrl)
//  a controller to act as a starting point to do more. All actions are prefixed with '/sample'.
fastify.register(samplectrl, {prefix: '/sample'})

// Define the server and start it
const start = async () => {
  try {
    await fastify.listen({port: 3000})
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

// Start the server
start()
