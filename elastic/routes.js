import elasticsearch from 'elasticsearch'
import config from '../masterConfig.js'

let client = new elasticsearch.Client(config.es);

client.ping({
  // ping usually has a 3000ms timeout
  requestTimeout: 1000
}, function (error) {
  if (error) {
    console.trace('elasticsearch cluster is down!')
  } else {
    console.log('All is well with elasticsearch')
  }
})

const routes = {}
routes.gets = {}
routes.posts = {}



routes.gets['/elasticProxy'] = function (req, res) {
  console.log('ES placeholder docs')
  res.setHeader('Content-Type', 'text/html')
  res.send('ES placeholder docs')
}

routes.posts['/elasticProxy'] = function (req, res) {
  const query = req.body
  client.search(query)
  .then(function (result) {
    var hits = result.hits.hits
    res.setHeader('Content-Type', 'text/html')
    res.send(hits)
  }, function (error) {
    console.trace(error.message)
    res.setHeader('Content-Type', 'text/html')
    res.send(error)
  })
}

export default routes
