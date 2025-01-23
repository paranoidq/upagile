// @ts-nocheck
import jsonServer from 'json-server'

const server = jsonServer.create()
const router = jsonServer.router('mock/db.json')
const defaultMiddlewares = jsonServer.defaults()

// 重写路径，必须写在 server.use(router) 之前
server.use(
  jsonServer.rewriter({
    '/api/*': '/$1',
    // '/blog/:resource/:id/show': '/:resource/:id'
  })
)

// 要处理 POST、PUT 和 PATCH，需要使用 body-parser
server.use(jsonServer.bodyParser)
// 设置默认中间件（记录器、静态、cors 和无缓存）
server.use(defaultMiddlewares)
server.use(router)

// 包装响应报文
router.render = (req, res) => {
  if (!!res.locals.data.code) {
    res.jsonp(res.locals.data)
  } else {
    res.jsonp({
      code: 1,
      data: res.locals.data,
      message: '',
    })
  }
}

// 启动服务器
server.listen(3000, () => {
  console.log('JSON Server is running at http://localhost:3000')
})
