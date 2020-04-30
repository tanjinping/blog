const {login} = require('../controller/user');
const {SuccessModel, ErrorModel} = require('../model/resModel');
const {get, set} = require('../db/redis');

const handleUserRouter = (req, res) => {
    const method = req.method; //GET POST

    //登陆
    if (method === 'POST' && req.path === "/api/user/login") {
        const {username, password} = req.body;
        const result = login(username, password);
        return result.then(data => {
            if (data.username) {
                //设置session
                req.session.username = data.username;
                req.session.realname = data.realname;
                set(req.sessionId, req.session);
                return new SuccessModel();
            }
            return new ErrorModel("登录失败");
        });
    }
};

module.exports = handleUserRouter;
