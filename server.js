#!/bin/env node
import express from 'express'
import fs from 'fs'
import path from 'path'
import esRoutes from './elastic/routes'
import sqlRoutes from './SQLserver/routes'

const Server = function () {
  //  Scope.
  const self = this

  self.setupVariables = function () {
    //  Set the environment variables we need.
    // self.ipaddress = ipAddr || '127.0.0.1'
    // self.port = port || 8080
    //
    // if (typeof self.ipaddress === "undefined") {
    //   console.warn('No IP var, using 127.0.0.1');
    //   self.ipaddress = "127.0.0.1";
    // }
  }

  /**
   *  Populate the cache.
   */
  self.populateCache = function () {
    if (typeof self.zcache === 'undefined') {
      self.zcache = {
        'index.html': ''
      }
    }

    //  Local cache for static content.
    self.zcache['index.html'] = fs.readFileSync('./views/index.html')
    // self.zcache['index.ejs'] = fs.readFileSync('./views/index.ejs')
  }

  /**
   *  Retrieve entry (content) from cache.
   *  @param {string} key  Key identifying content to retrieve from cache.
   */
  self.cache_get = function (key) {
    return self.zcache[key]
  }

  /**
   *  terminator === the termination handler
   *  Terminate server on receipt of the specified signal.
   *  @param {string} sig  Signal to terminate on.
   */
  self.terminator = function (sig) {
    if (typeof sig === 'string') {
      console.log('%s: Received %s - terminating sample app ...',
        Date(Date.now()), sig)
      process.exit(1)
    }
    console.log('%s: Node server stopped.', Date(Date.now()))
  }
  /**
   *  Setup termination handlers (for exit and a list of signals).
   */
  self.setupTerminationHandlers = function () {
    //  Process on exit and signals.
    process.on('exit', function () {
      self.terminator()
    })

    const terminators = ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT', 'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM']

    terminators.forEach(function (element, index, array) {
      process.on(element, function () {
        self.terminator(element)
      })
    })
  }

  /*  ================================================================  */
  /*  App server functions (main app logic here).                       */
  /*  ================================================================  */

  /**
   *  Create the routing table entries + handlers for the application.
   */
  self.createRoutes = function () {
    // local routes
    self.routes = {}
    self.routes.gets = {}
    self.routes.posts = {}

    self.routes.gets['/'] = function (req, res) {
      res.setHeader('Content-Type', 'text/html')
      res.send(self.cache_get('index.html'))
    }
  } // end of createRoutes

  /**
   *  Initialize the server (express) and create the routes and register
   *  the handlers.
   */
  self.initializeServer = function () {
    self.createRoutes()
    self.app = express()
    self.app.use(express.static('public'))
    self.app.use('/', express.static(path.join(__dirname, '/build')))
    self.app.use('/stylesheets', express.static(path.join(__dirname, '/public/stylesheets')))

    self.app.set('view engine', 'ejs')

    //  Add handlers for the app (from the routes).
    for (var g in self.routes.gets) {
      self.app.get(g, self.routes.gets[g])
    }
    for (var p in self.routes.posts) {
      self.app.post(p, self.routes.posts[p])
    }
    for (var eg in esRoutes.gets) {
      self.app.get(eg, esRoutes.gets[eg])
    }
    for (var ep in esRoutes.gets) {
      self.app.post(ep, esRoutes.posts[ep])
    }
    for (var sg in sqlRoutes.gets) {
      self.app.get(sg, sqlRoutes.gets[sg])
    }
    for (var sp in sqlRoutes.gets) {
      self.app.post(sp, sqlRoutes.posts[sp])
    }
  }

  /**
   *  Initializes the sample application.
   */
  self.initialize = function () {
    self.setupVariables()
    self.populateCache()
    self.setupTerminationHandlers()

    // Create the express server and routes.
    self.initializeServer()
  }

  /**
   *  Start the server (starts up the sample application).
   */
  self.start = function () {
    //  Start the app on the specific interface (and port).
    self.app.listen(8080, function () {
      console.log('%s: Node server started...',
        Date(Date.now()))
    })
  }
}
/**
 *  launch function calls
 */
let app = new Server()
app.initialize()
app.start()
