module.exports.profile = function(req, res){
    return res.render('user_profile', {                //user_profile is a view here ejs
        title: 'User Profile'
    })
}