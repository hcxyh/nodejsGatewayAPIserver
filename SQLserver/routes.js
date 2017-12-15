import sql from 'mssql'
import config from '../masterConfig.js'

let routes = {}
routes.gets = {}
routes.posts = {}

// reususble interface for passing sql the serer
const queryInterface = async (query, callback) => {
  // console.log('Connecting to ', config.mssql)
  sql.on('error', err => {
    console.error(err)
  })
  const pool = await sql.connect(config.mssql)
  const request = new sql.Request()
  request.query(query, callback)
}

// connection tests
console.log('\nTesting connection:\n')
queryInterface('select * from sys.all_objects where type = \'U\'', function (err, result) {
  console.error(err)
  for (var i = 0; i < result.recordsets[0].length; i++) {
    console.log(result.recordsets[0][i].name)
  }
  sql.close()
})

// end of connection tests

routes.gets['/currentTables'] = function (req, res) {
  // log out available tables
  queryInterface('select * from sys.all_objects where type = \'U\'', function (err, result) {
    if (err) {
      res.setHeader('Content-Type', 'text/html')
      res.send(err)
    } else {
      let finalResult = {}
      finalResult.tables = []
      for (var i = 0; i < result.recordsets[0].length; i++) {
        finalResult.tables.push(result.recordsets[0][i].name)
      }
      res.setHeader('Content-Type', 'text/json')
      res.jsonp(finalResult)
    }
  })
}

routes.gets['/SQLProxy'] = function (req, res) {
  console.log('SQLProxy docs')
  res.setHeader('Content-Type', 'text/html')
  res.send('SQL placeholder docs')
}

routes.posts['/SQLProxy'] = function (req, res) {
  console.log('SQLProxy post')
  let query = req.body.query
  console.log(query)
  queryInterface(query, function (err, result) {
    if (err) {
      res.setHeader('Content-Type', 'text/html')
      res.send(err)
    } else {
      res.setHeader('Content-Type', 'text/html')
      res.jsonp(result)
    }
  })
}

export default routes
