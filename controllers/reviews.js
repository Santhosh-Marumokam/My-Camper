const Campground = require('../models/campground');
const Review = require('../models/review');



module.exports.createReview = async(req,res,next)=>{
    const campground =await Campground.findById(req.params.id);
    const r = new Review (req.body.review);
    r.author = req.user._id;
    campground.reviews.push(r);
    await campground.save();
    await r.save();
    req.flash('success','successfully created a review');
    res.redirect(`/campgrounds/${campground._id}`);
}


module.exports.deleteReview = async(req,res,next)=>{
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id,{$pull : {reviews: reviewId}});
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success','successfully deleted review')
    res.redirect(`/campgrounds/${id}`);
}

