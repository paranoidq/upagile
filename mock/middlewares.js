// 包装响应数据的中间件
export const wrapResponseMiddleware = (req, res, next) => {
  res.render = (req, resp) => {
    // 修改返回格式
    const response = {
      code: 1,
      data: data,
      message: ''
    };
    resp.jsonp(response);
  };
  next();
}