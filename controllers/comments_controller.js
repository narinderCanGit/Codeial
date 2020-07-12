const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comments_mailer');

module.exports.create = async function(req, res){

    try{

       let post = await Post.findById(req.body.post);

       if (post){
        let comment = await Comment.create({
            content: req.body.content,
            post: req.body.post,
            user: req.user._id
        });

            post.comments.push(comment);
            post.save();

            comment = await comment.populate('user', 'name email').execPopulate();
            commentsMailer.newComment(comment);

            if (req.xhr){
                // Similar for comments to fetch the user's id!
                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Comment created!"
                });
            }

            req.flash('success', 'Comment published!');
            res.redirect('/');
        }

    }
    catch(err){
        req.flash('error', err);
        res.redirect('back');
    }

}


module.exports.destroy = async function(req, res){

    try{

        let comment = await Comment.findById(req.params.id);
        if (comment.user == req.user.id){
    
            let postId = comment.post;    
            //postId will be used to delete comment from the comment array in the post model

            comment.remove();

            let post = await Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}});
            //$pull: {comments: req.params.id}} delete 1 comment by this id and update the post model(db)

             // send the comment id which was deleted back to the views
             if (req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Comment deleted"
                });
            }

            req.flash('success', 'Comment deleted!');
                return res.redirect('back');
            }
        else{
            req.flash('error', 'You cannot delete this comment!');
            return res.redirect('back');
        }

    }catch(err){
        req.flash('error', err);
        res.redirect('back');
    }
    
}