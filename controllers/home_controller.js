module.exports.home = function(req, res){
    console.log(req.cookies);
    res.cookie('user_id', 25);
    return res.render('home', {             //home is a view here ejs
        title: "Home"
    });
}

// module.exports.actionName = function(req, res){}