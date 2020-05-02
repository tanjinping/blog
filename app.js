const handleBlogRouter = require('./src/router/blog');
const handleUserRouter = require('./src/router/user');
const querystring = require('querystring');
const {access} = require('./src/utils/log');
const {get, set} = require('./src/db/redis');

//获取cookie的过期时间
const getCookieExpires = () => {
    const d = new Date();
    d.setTime(d.getTime() + 60 * 1000);
    console.log(d.toGMTString());
    return d.toGMTString();
};

//用于处理 post Data
const getPostData = (req) => {
    const promise = new Promise((resolve, reject) => {
        if (req.method !== "POST") {
            resolve({});
            return;
        }
        if (req.headers['content-type'] !== "application/json") {
            resolve({});
            return;
        }
        let postData = '';
        req.on("data", chunk => {
            postData += chunk.toString();
        });
        req.on("end", () => {
            if (!postData) {
                resolve({});
                return;
            }
            resolve(JSON.parse(postData));
        })
    });
    return promise;
};

const serverHandle = (req, res) => {
    //记录access log
    access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`);

    //设置返回格式
    res.setHeader('Content-type', 'application/json');

    //获取path
    const url = req.url;
    req.path = url.split('?')[0];

    //解析query
    req.query = querystring.parse(url.split('?')[1]);

    //解析cookie
    req.cookie = {};
    const cookieStr = req.headers.cookie || '';
    cookieStr.split(';').forEach(item => {
        if (!item) {
            return;
        }
        const arr = item.split('=');
        const key = arr[0].trim();
        req.cookie[key] = arr[1].trim();
    });

    //解析session
    let needSetCookie = false;
    let {userId} = req.cookie;
    if (!userId) {
        needSetCookie = true;
        userId = `${Date.now()}_${Math.random()}`;
        set(userId, {});
        // if (!SESSION_DATA[userId]) {
        //     SESSION_DATA[userId] = {};
        // }
    }
    //获取session
    req.sessionId = userId;
    get(userId).then(sessionDate => {
        if (!sessionDate) {
            set(userId, {});
            req.session = {};
        } else {
            req.session = sessionDate;
        }
        return getPostData(req);
    }).then(postData => {
        req.body = postData;

        //处理blog路由
        const blogResult = handleBlogRouter(req, res);
        if (blogResult) {
            blogResult.then(blogData => {
                //操作cookie
                needSetCookie && res.setHeader('Set-Cookie', `userId=${userId}; path=/;httpOnly;expires=${getCookieExpires()}`);
                res.end(JSON.stringify(blogData));
            });
            return;
        }

        //处理user路由
        const userResult = handleUserRouter(req, res);
        if (userResult) {
            userResult.then(userData => {
                //操作cookie
                needSetCookie && res.setHeader('Set-Cookie', `userId=${userId}; path=/;httpOnly;expires=${getCookieExpires()}`);
                res.end(
                    JSON.stringify(userData)
                );
            });
            return;
        }

        //未命中路由
        res.writeHead(404, {"Content-type": "text/plain"});
        res.write("404 NOT Found\n");
        res.end();
    });
};

module.exports = serverHandle;

//process.env.NODE_ENV
