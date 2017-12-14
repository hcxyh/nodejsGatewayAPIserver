import sql from 'mssql'
import config from '../masterConfig.js'

sql.on('error', err => {
  console.error(err)
})

const test = async () => {
  try {
    console.log('Connecting to ', config.mssql)
    const pool = await sql.connect(config.mssql)
    console.log(pool)
    const result = await sql.query`select * `
    console.log(result)
  } catch (err) {
    console.error(err)
      // ... error checks
  }
}

test()

const routes = {}
routes.gets = {}
routes.posts = {}

routes.gets['/SQLProxy'] = function (req, res) {
  console.log('SQL placeholder docs')
  res.setHeader('Content-Type', 'text/html')
  res.send('SQL placeholder docs')
}

routes.posts['/SQLProxy'] = function (req, res) {
  console.log('SQL placeholder post')
  res.setHeader('Content-Type', 'text/html')
  res.send('SQL placeholder post')
}

export default routes
