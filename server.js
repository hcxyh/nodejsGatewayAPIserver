#!/bin/env node


import express from 'express'
import fs from 'fs'
import path from 'path'
import React from 'react'
import App from './source/Components/Application.react.js'


//local host only example
const ip_addr = '127.0.0.1';
const port = '8080';

const server = function() {

  //  Scope.
  const self = this;


  self.setupVariables = function() {
    //  Set the environment variables we need.
    self.ipaddress = ip_addr || '127.0.0.1';
    self.port = port || 8080;

    if (typeof self.ipaddress === "undefined") {
      console.warn('No IP var, using 127.0.0.1');
      self.ipaddress = "127.0.0.1";
    }
  };


  /**
   *  Populate the cache.
   */
  self.populateCache = function() {
    if (typeof self.zcache === "undefined") {
      self.zcache = {
        'index.html': ''
      };
    }

    //  Local cache for static content.
    self.zcache['index.html'] = fs.readFileSync('./views/index.html');
    self.zcache['index.ejs'] = fs.readFileSync('./views/index.ejs');
  };


  /**
   *  Retrieve entry (content) from cache.
   *  @param {string} key  Key identifying content to retrieve from cache.
   */
  self.cache_get = function(key) {
    return self.zcache[key];
  };




  /**
   *  terminator === the termination handler
   *  Terminate server on receipt of the specified signal.
   *  @param {string} sig  Signal to terminate on.
   */
  self.terminator = function(sig) {
    if (typeof sig === "string") {
      console.log('%s: Received %s - terminating sample app ...',
        Date(Date.now()), sig);
      process.exit(1);
    }
    console.log('%s: Node server stopped.', Date(Date.now()));
  };


  /**
   *  Setup termination handlers (for exit and a list of signals).
   */
  self.setupTerminationHandlers = function() {
    //  Process on exit and signals.
    process.on('exit', function() {
      self.terminator();
    });

    // Removed 'SIGPIPE' from the list - bugz 852598.
    ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
      'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
    ].forEach(function(element, index, array) {
      process.on(element, function() {
        self.terminator(element);
      });
    });
  };


  /*  ================================================================  */
  /*  App server functions (main app logic here).                       */
  /*  ================================================================  */

  /**
   *  Create the routing table entries + handlers for the application.
   */
  self.createRoutes = function () {
    self.routes = {}
    self.routes.gets = {}
    self.routes.posts = {}

    self.routes.gets['/'] = function (req, res) {
      res.setHeader('Content-Type', 'text/html')
      res.send(self.cache_get('index.html'))
    }

    self.routes.gets['/elasticProxy'] = function (req, res) {
      console.log('ES placeholder docs')
      res.setHeader('Content-Type', 'text/html')
      res.send('ES placeholder docs')
    }

    self.routes.gets['/SQLProxy'] = function (req, res) {
      console.log('SQL placeholder docs')
      res.setHeader('Content-Type', 'text/html')
      res.send('SQL placeholder docs')
    }

    self.routes.posts['/elasticProxy'] = function (req, res) {
      console.log('ES placeholder post')
      res.setHeader('Content-Type', 'text/html')
      res.send('ES placeholder post')
    }

    self.routes.posts['/SQLProxy'] = function (req, res) {
      console.log('SQL placeholder post')
      res.setHeader('Content-Type', 'text/html')
      res.send('SQL placeholder post')
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
      self.app.get(g, self.routes[g])
    }
    for (var p in self.routes.posts) {
      self.app.post(p, self.routes[p])
    }
  }

  /**
   *  Initializes the sample application.
   */
  self.initialize = function() {
    self.setupVariables();
    self.populateCache();
    self.setupTerminationHandlers();

    // Create the express server and routes.
    self.initializeServer();
  };


  /**
   *  Start the server (starts up the sample application).
   */
  self.start = function() {
    //  Start the app on the specific interface (and port).
    self.app.listen(self.port, self.ipaddress, function() {
      console.log('%s: Node server started on %s:%d ...',
        Date(Date.now()), self.ipaddress, self.port);
    });
  };

}; /*  Sample Application.  */



/**
 *  main():  Main code.
 */
let app = new server();
app.initialize();
app.start();
