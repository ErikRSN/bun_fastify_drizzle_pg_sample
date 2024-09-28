// add functions that make life easier here

let utils = {
  cl: console.log,
  logit: error => {utils.cl('Error:', error)},
  getData: (req, xtype, name) => {
    if (xtype in req && name in req[ xtype ]) {
      return req[ xtype ][ name ]
    } else {
      return false
    }
  },
  isarray: (x) => {
    return Array.isArray(x)
  }
}

export { utils }
