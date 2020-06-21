module.exports.home = function(req, res){
    
    return res.render('home', {             //home is a view here ejs
        title: "Home"
    });
}

// module.exports.actionName = function(req, res){}