const Post_box_fomo = document.getElementById('post-box-fomo');
const Post_btn_fomo = document.getElementById('post-btn_fomo');
const cross_btn_fomo = document.getElementById('cross_btn_fomo');
Post_btn_fomo.addEventListener('click', () => {
Post_box_fomo.classList.remove('hidden'); 
Post_box_fomo.classList.add('overflow-hidden', 'block'); 
});

cross_btn_fomo.addEventListener('click', () => {
Post_box_fomo.classList.remove('overflow-hidden', 'block'); 
Post_box_fomo.classList.add('hidden'); 
});

function showPostContent(myContent) {

   const show_post_content_box = document.querySelector('.show-post-content');
   const show_post_content_box_fomo = document.querySelector('#show-post-content_fomo');
   if(Post_box_fomo.classList.contains('block')){
        show_post_content_box_fomo.appendChild(myContent);
   }else{
        show_post_content_box.appendChild(myContent);
   }
   
}

const allMediaFiles = [];
const postMedia = document.getElementById("postMedia");
postMedia.addEventListener("change", (e) => {

    for (let i = 0; i < e.target.files.length; i++) {
        const mediafile = e.target.files[i];  //targeting mediafile
        if (mediafile && mediafile.type) {
            allMediaFiles.push(mediafile); //Pushing all media files in allMediaFiles (global variable hai) variable
            const medifileURL = URL.createObjectURL(mediafile); //creating mediafile ka URL
            const mediafile_type = mediafile.type.split('/')[0].toLowerCase();
            
            if (mediafile_type === "video") {
                let myVideo = document.createElement('video');
                Object.assign(myVideo, {
                    src: medifileURL,
                    controls: true,
                    className: 'show-post-content-value'
                });
                showPostContent(myVideo);

            } else if (mediafile_type === "image") {
                let mypic = document.createElement('img');
                Object.assign(mypic, {
                    src: medifileURL,
                    controls: true,
                    className: 'show-post-content-value'
                });
                showPostContent(mypic);

            }
        } else {
            mediafile.value = "";
        }
        // console.log("selected media file!")
        // console.log(mediafile)
        // console.log(mediafile.name)
        // console.log(mediafile.size)
        // console.log(mediafile.lastModified)
        // console.log(mediafile.lastModifiedDate)
        // console.log(mediafile.type)

    }

})

// --------------FORM tag se data nikalna-------------------
const myForm = document.getElementById("myForm");
myForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const postbtn = document.getElementById('post-btn');
    postbtn.style.color = "red";
    const formData = new FormData();

    // post ki title uthaya
    let title = document.getElementById("post-title").value; //title ki value nikala
    if(title.trim() === ""){
        title = document.getElementById("post-title_fomo").value;
    }
    alert("post title: " + title)
    formData.append('title', title);
    // post ki allMediaFiles uthaya
    allMediaFiles.forEach((file, index) => {
        formData.append('postMedia', file); //sabhi selected files ko append kiya
    });

    for (let [key, value] of formData.entries()) {
        console.log(key, value);
    }

    // ab Data ko API call ke jariye Backend(Server ko bhejna)
    try {
        //1. API calling se Server ko data bhejna
        const response = await fetch('/create-post',{
            method: "POST",
            body: formData
        });
        //2. Server ka response check karna (error handling)
        if(!response.ok){
            throw new Error("Server se Data save karne me koi error aayi hai! fffffffaaaaaa!!!..")
        }
        const result = await response.json(); 
        console.log("Your Post Saved Successfully!", result)
        console.log("chalo ab garibon me Mithaiyan batwao!!!")
        //3. kaam pura hote hi page ko reload kar do
        window.location.reload();
    } catch (error) { 
        //agar internet kata ho ya server band ho to vo error yahan sambhali jayegi
        console.error("Server Error: ", error.massage);
        alert("Post did not uploaded, please try again.")
    }

    //     const formValue = Object.fromEntries(formData.entries()) //ye sirf formData ko dekhne layak banata hai

    // console.log("postTitle", postTitle)
    // console.log("formData",formValue)

    // const allFiles = formData.getAll('postMedia');
    // const fileInput = document.getElementById("postMedia");
    // console.log("real All files", fileInput.files.length)
    // console.log("now real All files", allMediaFiles)
    // console.log('allFiles:', allFiles)
    // console.log('formData:',formData)
    // console.log('formValue:',formValue)
})