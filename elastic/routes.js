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

routes.gets['/esindices'] = function (req, res) {
  console.log('ES placeholder docs')
  res.setHeader('Content-Type', 'text/html')
  res.send('ES placeholder docs')
}

routes.gets['/elasticProxy'] = function (req, res) {
  console.log('ES placeholder docs')
  res.setHeader('Content-Type', 'text/html')
  res.send('ES placeholder docs')
}

routes.posts['/elasticProxy'] = function (req, res) {
  console.log('ES placeholder post')
  res.setHeader('Content-Type', 'text/html')
  res.send('ES placeholder post')
}

export default routes
