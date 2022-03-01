const http = require('http');
const slice = Array.prototype.slice;

class LikeExpress {
    constructor() {
        // 存放中间件列表
        this.routes = {
            all: [],
            get: [],
            post: []
        }
    }

    register(path) {
        const info = {};
        if (typeof path === 'string') {
            info.path = path;
            // 路由后面的参数放在一个stack里
            info.stack = slice.call(arguments, 1);
        } else {
            info.path = '/';
            info.stack = slice.call(arguments, 0);
        }
        return info;
    }

    use(...args) {
        const info = this.register(...args);
        this.routes.all.push(info);
    }

    get(...args) {
        const info = this.register(...args);
        this.routes.get.push(info);
    }

    post(...args) {
        const info = this.register(...args);
        this.routes.post.push(info);
    }

    match(method, url) {
        let stack = [];
        if (url === 'favicon.ico') {
            return stack;
        }
        // 获取routes
        let curRoutes = [];
        curRoutes = curRoutes.concat(this.routes.all);
        curRoutes = curRoutes.concat(this.routes[method]);

        curRoutes.forEach(routeInfo => {
            if (url.includes(routeInfo.path)) {
                stack = stack.concat(routeInfo.stack);
            }
        });
        return stack;
    }

    // 核心next机制
    handle(req, res, list) {
        const next = () => {
            // 拿到第一个匹配中间件
            const firstMiddleware = list.shift();
            if (firstMiddleware) {
                // 一个个执行中间件函数
                firstMiddleware(req, res, next);
            }
        };
        next();
    }

    callback() {
        return (req, res) => {
            res.json = (data) => {
                res.setHeader('Content-type', 'application/json');
                res.end(
                    JSON.stringify(data)
                );
            };
            const url = req.url,
                method = req.method.toLowerCase();
            const resultList = this.match(method, url);
            this.handle(req, res, resultList);
        }
    }

    listen(...args) {
        const server = http.createServer(this.callback())
        server.listen(...args);
    }
}

// 工厂函数
module.exports = () => {
    return new LikeExpress();
}