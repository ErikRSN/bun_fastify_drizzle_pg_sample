// these are utility functions to help with encrypt/decrypt and validation of passwords
// Contains a lot of debug code, remove it once well tested and ready for production

import {eq, lt, gte, ne, sql, and, or, count} from 'drizzle-orm'
import crypto from 'node:crypto'
import Promise from 'bluebird'

const debug = 0
let iterations = 1000
let keylen = 20
let digest = 'sha512'
let saltLength = 16

export const authlib = {
  encryptPW: async (salt, pw) => {
    let useSalt = ''
    if (salt === true) {
      useSalt = crypto.randomUUID().replace(/-/g, '').substring(saltLength)
    } else if (typeof salt === 'string') {
      useSalt = salt
    }
    return new Promise(function (resolve, reject) {
      if (debug)
        console.log(pw, useSalt, iterations, keylen, digest)
      crypto.pbkdf2(pw, useSalt, iterations, keylen, digest, (err, derivedKey) => {
        if (err) {
          reject(err)
        } else {
          resolve({salt: useSalt, hash: derivedKey.toString('hex')})
        }
      })
    })
  },
  validatePW: async (fastify, oldencpw, newpw) => {
    // let ex = 'pbkdf2(1000, 20, sha512)$a37e337645a20452$fa523da7834189941e4c550ea5fd6f3dcd286e68'
    if (debug) 
      console.log(oldencpw, newpw)
    let salt, hash
    const part = oldencpw.split('$')
    salt = part[ 1 ]
    hash = part[ 2 ]
    // console.log('going in:', salt, newpw)
    const out = await fastify.auth.encryptPW(salt, newpw)
    // console.log('gen hash:', out)
    return (hash === out.hash)
  },
  registerUser: async (fastify, req) => {
    // enter this user in the system
    
    const rc = {err: 0, msg: ''}
    let rows = []
    if (debug) {
      console.log('body:', req.body)
    }

    const {fname, lname, email, password} = req.body
    let hv = {
      fname: fname,
      lname: lname,
      email: email,
      password: password
    }
    if (debug) {
      console.log('Register Info:', fname, lname, email, password)
    }
    const db = fastify.db
    rows = await fastify.api.select().from(db.users).where(eq(db.users.email, email))
    if (rows.length > 0) {
      rc.err = 1
      rc.msg = 'Email exists'
      return {rc: rc, rows: []}
    } else {
      if (debug) 
        console.log('Body:', req.body)
      const out = await fastify.auth.encryptPW(true, password)
      if (debug) 
        console.log(`iter: ${iterations}, keylen: ${keylen}, digest:${digest}), salt: ${out.salt}, hash: ${out.hash}`)
      hv.password = `pbkdf2(${iterations}, ${keylen}, ${digest})$${out.salt}$${out.hash}`
      if (debug) 
        console.log(hv.password.length, hv.password)

      rows = await fastify.api.insert(db.users).values(hv).returning({newid: db.users.id})

      if (debug) {
        console.log('====> rows:', rows)
      }
      if (rows && rows.length > 0) {
        rc.err = 0
        rc.msg = 'Good registeration'
        return {rc: rc, rows: rows[ 0 ]}
      }
    }
  }
}
