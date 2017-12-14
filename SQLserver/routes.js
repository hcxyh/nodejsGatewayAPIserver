import sql from 'mssql'
import config from '../masterConfig.js'




const queryInterface = async (query, callback) => {
  // console.log('Connecting to ', config.mssql)
  sql.on('error', err => {
    console.error(err)
  })
  const pool = await sql.connect(config.mssql)
  const request = new sql.Request()
  request.query(query, callback)


}

console.log("\nTesting connection:\n");
queryInterface('select * from sys.all_objects where type = \'U\'', function (err, result) {

  console.error(err)
  for (var i = 0; i < result.recordsets[0].length; i++) {
    console.log(result.recordsets[0][i].name)
  }
  sql.close()
})

let routes = {}
routes.gets = {}
routes.posts = {}

routes.gets['/currentTables'] = function (req, res) {
  console.log('currentTables place holder')
  queryInterface('select * from sys.all_objects where type = \'U\'', function (err, result) {
    // console.log(err, result)
    if(err){
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
  async (query, res) => {
    try {
      console.log('Connecting to ', config.mssql)
      const pool = await sql.connect(config.mssql)
      const result = await sql.query(query)
      console.log(result)
      res.setHeader('Content-Type', 'text/html')
      res.send(result)
    } catch (err) {
      console.error(err)
      res.setHeader('Content-Type', 'text/html')
      res.send(err)
        // ... error checks
    }
  }
}

export default routes
