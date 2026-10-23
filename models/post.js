const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "post title/content is requiured"],
        trim: true,
        maxlength: [280, "Post cannot exceed 280 characters"],
    },
    medias: [
        {
            mediaUrl: {
                type: String, //cloudinary se milne wala secure url
                required: false
            },
            mediaType:{
                type: String,
                enum: ['image', 'video'],
                required: true

            }
        }
    ]
    // mediaUrls: {
    //     type: [String], //cloudinary se milne wala secure url
    //     required: false
    // },

    //future ke liye
    /*author:{
        type: mongoose.Types.Schema.Objectid,
        ref: 'user',
        required: true 
    }*/

}, { timestamps: true });
postSchema.methods.getTimeAgo = function(){
    const now = new Date();
    const created = new Date(this.createdAt);
    const diffInSeconds = Math.floor((now - created) / 1000);

    if(diffInSeconds < 60) return `${diffInSeconds}s`;
    if(diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if(diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if(diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
    return created.toLocaleDateString('en-US', {
month:'short',
day:'numeric'});
}
module.exports = mongoose.model('Post', postSchema);