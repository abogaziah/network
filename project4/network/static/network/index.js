document.addEventListener('DOMContentLoaded', function () {
    const homeButton = document.querySelector("#homeButton");
    homeButton.addEventListener('click', fetch_posts);
});

function fetch_posts(){
    event.preventDefault()
    fetch('/posts',{
        method:'GET'
    }).then(response => response.json()).then(posts => {
        posts.forEach(show_post);
    });
}

function show_post(post){
    const div = document.createElement('div');
    div.className = 'post';
    div.innerHTML = (
        `<p>${post.author}</p> 
        <p>${post.time_stamp}</p>
        <h4>${post.content}</h4>
        <p>likes: ${post.likes}</p>`
    );
    div.style.border = "thin solid black";
    div.style.padding = "20px 10px 20px 30px";
    div.style.margin = "20px 0px 20px 0px";
    div.style.borderRadius= "5px";
    document.querySelector('#feed').append(div);
}
