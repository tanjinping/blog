const getList = (author, keyword) => {
    //假数据
    return [
        {
            id: 1,
            title: '标题1',
            createTime: 1586599211553,
            content: "内容1",
            author: "张三"
        },
        {
            id: 2,
            title: '标题2',
            createTime: 1586599275160,
            content: "内容2",
            author: "李四"
        },
        {
            id: 3,
            title: '标题3',
            createTime: 1586599281260,
            content: "内容3",
            author: "王武"
        },
        {
            id: 4,
            title: '标题4',
            createTime: 1586599287160,
            content: "内容4",
            author: "黎明"
        }
    ]
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

module.exports = {
    getList, getDetail
};
