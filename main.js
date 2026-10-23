require('dotenv').config(); // .env फाइल की चाबियों को लोड करने के लिए
const express = require('express');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const Post = require('./models/post'); // तुम्हारा Mongoose मॉडल (फाइल का नाम post.js है)

const app = express();
const port = 3000;

// 1. 🗄️ MongoDB Connection (डेटाबेस का नाम: twitter_clone)
mongoose.connect('mongodb://localhost:27017/twitter_clone')
    .then(() => console.log("✅ MongoDB से सफलतापूर्वक कनेक्ट हो गया!"))
    .catch(err => console.error("❌ MongoDB कनेक्शन एरर:", err));

// 2. ☁️ Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 3. 📂 Multer-Cloudinary Storage Setup (फाइलें सीधे Cloudinary पर जाएंगी)
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'twitter_clone_uploads', // Cloudinary पर इस नाम का फोल्डर बनेगा
        resource_type: 'auto',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'mp4', 'mov']
    }
});
const upload = multer({ storage: storage }); 

// 4. Middlewares
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');

//5. Functions
async function GetPostsFromDB(){
    try {
       const AllPosts = await Post.find();
        // console.log("All Posts", AllPosts)
        return AllPosts;
    } catch (error) {
        console.error("Error aa gaya bhai: ",error)
    }
};

// 6. Routes
app.get('/', async (req, res) => {
    const PostData = await GetPostsFromDB();
    // console.log("welcome stark!",PostData[10])
    console.log("koi aaya hai!")
    res.render('index2', {PostDatas: PostData});
});

app.get('/home', async (req,res)=>{
    const PostData = await GetPostsFromDB();
    console.log("welcome stark!",PostData[3].title)
    res.render('indexv1backup')
});

// ⚡ 7. CREATE POST ROUTE (FormData -> Multer/Cloudinary -> Mongoose -> MongoDB)
app.post('/create-post', upload.array('postMedia', 10), async (req, res) => {
    try {
        const { title } = req.body;
        console.log("kuchh post kiya gaya! ",)
        // वैलिडेट करना कि टाइटल खाली न हो
        if (!title || title.trim() === "") {
            return res.status(400).json({ success: false, message: "Post content cannot be empty!" });
        }

        // अगर यूजर ने फाइलें चुनी हैं, तो Cloudinary से मिले सिक्योर URLs का एरे बनाना
        let medias = [];
        if (req.files && req.files.length > 0) {
            medias = req.files.map(file => {
                let mType = "";
                if (file.mimetype.startsWith('image/')) {
                    mType = "image";
                }
                else if(file.mimetype.startsWith('video/')){
                    mType = "video";
                }
                else {
                    throw new Error("only video and image files are allowed!");
                    
                }
                return{
                    mediaUrl: file.path,
                    mediaType: mType
                }
            }); // file.path में Cloudinary का URL होता है
            
        }

        // Mongoose मॉडल के ज़रिए MongoDB डेटाबेस में पोस्ट सेव करना
        const newPost = await Post.create({
            title: title,
            medias: medias
        });

        console.log("🎉 नया पोस्ट सफलतापूर्वक डेटाबेस में सेव हो गया:", newPost);

        // फ्रंटएंड को सक्सेस रिस्पॉन्स भेजना
        res.status(201).json({
            success: true,
            message: "Post created and saved successfully!",
            post: newPost
        });

    } catch (error) {
        console.error("❌ पोस्ट सेव करते वक्त एरर आया:", error);
       return res.status(500).json({
         success: false,
         message: error.message || "Internal Server Error" 
        });
    }
});

// 8. Server Listener
app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
});