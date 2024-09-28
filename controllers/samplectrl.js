// This file should be treated as a template for creating the appropriate kind of route
// get, put, post, delete, options

// Using Drizzle and also using 
import {eq, lt, gte, ne, sql, and, or, count, ilike} from 'drizzle-orm'
const clist = [ 'title', 'url', 'note', 'tags', 'id', 'userid' ]

let base = {
  title: 'This is a title'
}

const fastifyFormbody = require('@fastify/formbody')
const debug = 0

function samplectrl (fastify, options, next) {
  const api = fastify.api
  const db = fastify.db
  const render = fastify.render
  const cp = fastify.cp

  fastify.route({
    method: 'GET',
    url: '/get/:id',
    schema: {
      params: {
        id: {type: 'number'}
      }
    },
    preHandler: fastify.requires_login,
    handler: async function (req, reply) {
      let id = req.params.id
      let rows = await api.select().from(db.users).where(eq(db.users.id, id))
      console.log('Rows:', rows)
      reply.send({data: rows})
    }
  })

  // create an action to add a sample entry
  fastify.route({
    method: 'GET',
    url: '/addone',
    schema: {

    },
    preHandler: fastify.requires_login,
    handler: async function (req, reply) {
      // send out the page
      reply.type('text/html')
      const rows = await api.select().from(db.sample)
      let en = cp(base, {title: 'All Sample data'})
      return render('views/sample/addone.njk', en)
    }
  })

  fastify.route({
    method: 'POST',
    url: '/addone',
    schema: {
      body: {
        title: {type: 'string'},
        body: {type: 'string'},
        data: {type: 'string'},
      }
    },
    preHandler: fastify.requires_login,
    handler: async function (req, reply) {
      let { title, body, data } = req.body
      console.log('Incoming:', title, body, data)
      const userid = req.session.auth.id
      const ts = new Date()
      try {
        let out = await api.insert(db.sample).values({
          title: title, body: body, data: data, userid: userid, ts: ts
        })
          .returning({newid: db.sample.id})
        return ({output: out})
      } catch (e) {
        console.log('Error:', e)
      }
    }
  })
  // create an action to search sample entry

  // create an action to show the list
  fastify.route({
    method: 'GET',
    url: '/getall',
    schema: {
     
    },
    preHandler: fastify.requires_login,
    handler: async function (req, reply) {
      // send out the page
      reply.type('text/html')
      const rows = await api.select().from(db.sample)
      let en = cp(base, {title: 'All Sample data', items: rows})
      return render('views/sample/getall.njk', en)
    }
  })

  fastify.route({
    method: 'POST',
    url: '/search',
    schema: {
      body: {
        sterm: {type: 'string'}
      }
    },
    preHandler: fastify.requires_login,
    handler: async function (req, reply) {

    }
  })


  next()
}

export {samplectrl}
