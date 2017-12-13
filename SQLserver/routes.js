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
