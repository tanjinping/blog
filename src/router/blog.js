const {getList, getDetail, newBlog, updateBlog, deleteBlog} = require('../controller/blog');
const {SuccessModel, ErrorModel} = require('../model/resModel');

//统一的登陆验证函数
const loginCheck = (req) => {
    if (!req.session.username) {
        return Promise.resolve(
            new ErrorModel('尚未登陆')
        )
    }
};

const handleBlogRouter = (req, res) => {
    const method = req.method; //GET POST
    const id = req.query.id;

    //获取博客列表
    if (method === "GET" && req.path === "/api/blog/list") {
        const keyword = req.query.keyword || "";
        const loginCheckResult = loginCheck(req);
        if (loginCheckResult) {
            return loginCheckResult
        }
        const author = req.session.username || "";
        const result = getList(author, keyword);
        return result.then(listData => {
            return new SuccessModel(listData);
        })
    }

    //获取博客详情
    if (method === "GET" && req.path === "/api/blog/detail") {
        const result = getDetail(id);
        return result.then(data => {
            return new SuccessModel(data);
        })
    }

    //新建一篇博客
    if (method === "POST" && req.path === "/api/blog/new") {
        const loginCheckResult = loginCheck(req);
        if (loginCheckResult) {
            return loginCheckResult
        }
        req.body.author = req.session.username;
        const blogData = req.body;
        const result = newBlog(blogData);
        return result.then(data => {
            return new SuccessModel(data);
        });
    }

    //更新一篇博客
    if (method === "POST" && req.path === "/api/blog/update") {
        const loginCheckResult = loginCheck(req);
        if (loginCheckResult) {
            return loginCheckResult
        }
        const result = updateBlog(id, req.body);
        return result.then(val => {
            if (val) {
                return new SuccessModel();
            } else {
                return new ErrorModel("更新博客失败");
            }
        });
    }

    //删除一篇博客
    if (method === "POST" && req.path === "/api/blog/del") {
        const loginCheckResult = loginCheck(req);
        if (loginCheckResult) {
            return loginCheckResult
        }
        const author = req.session.username;
        const result = deleteBlog(id, author);
        return result.then(value => {
            if (value) {
                return new SuccessModel();
            }
            return new ErrorModel("删除博客失败");
        })
    }
};

module.exports = handleBlogRouter;
