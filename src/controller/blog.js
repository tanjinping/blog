const {exec} = require('../db/mysql');

const getList = (author, keyword) => {
    let sql = `select * from blogs where 1=1 `;
    if (author) {
        sql += `and author='${author}' `;
    }
    if (keyword) {
        sql += `and title like '%${keyword}%' `;
    }
    sql += `order by createtime desc;`;

    //返回 promise
    return exec(sql);
};

const getDetail = (id) => {
    return {
        id: 1,
        title: '标题1',
        createTime: 1586599211553,
        content: "内容1",
        author: "张三"
    }
};

const newBlog = (blogData = {}) => {
    //blogData 是一个博客对象，包含title content属性
    return {
        id: 3 //新建博客插入到数据表 id
    }
};

const updateBlog = (id, blogData = {}) => {
    //id 更新博客ID
    //blogData 是一个博客对象，包含title content属性
    return false;
};

const deleteBlog = (id) => {
    return true;
};

module.exports = {
    getList, getDetail, newBlog, updateBlog, deleteBlog
};
