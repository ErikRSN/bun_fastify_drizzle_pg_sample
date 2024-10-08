'use strict'

function loginPage () {
  return `<html> 
    <head><title>Login</title></head> 
    <body> 
    <h1>Login</h1> 
    <form action="http://localhost:3000/login" method="post"> 
    <h2>Email</h2> 
    <input type="email" name="email"> 
    <h2>Password</h2> 
    <input type="password" name="password"> 
    <br><br><button type="submit">Login</button> 
    </form> 
    </body> 
    </html>`
}

function defaultPage (loggedIn) {
  if (loggedIn) {
    console.log('logged in')
    return 'logged in<br><br><a href="/logout">Logout</a>'
  } else {
    return 'please login<br><br><a href="/login">Login</a>'
  }
}

// function mainPage () {
//   return `
//   <head><title>Login</title></head> 
//   <body> 
//   <h1>Status Good</h1>
//   <p> You are logged in</p>
//   </body> 
//   </html>
//   `
// }
module.exports = {
  loginPage,
  defaultPage,
  // mainPage
}
