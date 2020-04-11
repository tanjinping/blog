const serverHandle = (req,res) => {
    //设置返回格式
    res.setHeader('Content-type','application/json');

    const resData = {
        name:"shuangyue",
        site:"imooc"
    };

    res.end(
        JSON.stringify(resData)
    )
};

module.exports = serverHandle;
