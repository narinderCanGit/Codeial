const User = require('../models/user');


module.exports.profile = function(req, res){
    User.findById(req.params.id, function(err, user){
        return res.render('user_profile', {
            title: 'User Profile',
            profile_user: user
        });
    });

}


module.exports.update = function(req, res){
    if(req.user.id == req.params.id){
        User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
            req.flash('success', 'Updated!');
            return res.redirect('back');
        });
    }else{
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
}



// render the sign up page
module.exports.signUp = function(req, res){
    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }


    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    })
}


// render the sign in page
module.exports.signIn = function(req, res){

    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    })
}

// get the sign up data
module.exports.create = async function(req, res){

    try{

        if (req.body.password != req.body.confirm_password){
            req.flash('error', 'Passwords do not match');
            return res.redirect('back');
        }
    
        let user = await User.findOne({email: req.body.email});
           
        if (!user){
            User.create(req.body);

            req.flash('success', 'Sign-up succesful!');
            return res.redirect('/users/sign-in');

            } else{
                req.flash('error', 'This email is already registered, use another email!');
                return res.redirect('back');
        }
            
    
    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
    
}


// sign in and create a session for the user
module.exports.createSession = function(req, res){
    req.flash('success', 'Logged in Successfully!');
    return res.redirect('/');
}

module.exports.destroySession = function(req, res){
    req.logout();
    req.flash('success', 'You have logged out!');

    return res.redirect('/users/sign-in');
}