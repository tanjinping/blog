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
    const sql = `select * from blogs where id='${id}'`;
    return exec(sql).then(rows => {
        return rows[0];
    })
};

const newBlog = (blogData = {}) => {
    const {title, content, author} = blogData;
    const createTime = Date.now();
    const sql = `insert into blogs (title,content,createtime,author) values ('${title}','${content}',${createTime},'${author}')`;

    return exec(sql).then(insertDate => {
        return {
            id: insertDate.insertId
        }
    });
};

const updateBlog = (id, blogData = {}) => {
    const {title, content} = blogData;
    const sql = `update blogs set title='${title}',content='${content}' where id=${id}`;
    return exec(sql).then(updateDate => {
        return updateDate.affectedRows > 0;
    })
};

const deleteBlog = (id, author) => {
    const sql = `delete from blogs where id=${id} and author='${author}'`;
    return exec(sql).then(deleteData => {
        return deleteData.affectedRows > 0;
    })
};

module.exports = {
    getList, getDetail, newBlog, updateBlog, deleteBlog
};
