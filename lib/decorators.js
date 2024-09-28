// Decorators added in here are used to simply the flow of the code in controllers


function load_decorators (fastify) {

  // Allows progress ONLY if user is logged in
  fastify.decorate('requires_login', function (req, reply, done) {
    // console.log('requires_login')
    // console.log(req.session.auth)
    if (req.session && req.session.auth && req.session.auth.id) {
      if (typeof done === 'undefined') {
        return
      } else {
        done()
      }
    } else {
      console.log('Not logged in')
      reply.redirect('/login')
    }
  })

    // Allows forward progress ONLY if the user has the required authorization
    // this is only used when actions have required authorizations and users have been assigned
    //  authorization levels 
  fastify.decorate('hasAuth', function (level) {
    console.log('hasAuth')
    // console.log(req.session.auth)
    if (req.session && req.session.auth && req.session.auth.id) {
      // get auth for this user and compare with required auth
    } else {
      console.log('Not Authorized')
      reply.redirect('/main')
    }
  })

  // Error handler 
  process.on('unhandledRejection', (e) => {
    console.log(e.message, e.stack)
  })

}

export {load_decorators}

