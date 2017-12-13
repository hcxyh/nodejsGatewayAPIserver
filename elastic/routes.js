const routes = {}
routes.gets = {}
routes.posts = {}

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
