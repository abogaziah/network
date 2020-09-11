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
    div.innerHTML = (`<p >${post.author}</p> 
  <p>${post.time_stamp}</p>
  <h6>${post.content}</h6>`);
    div.style.border = "thin solid black";
    div.style.padding = "20px 10px 20px 30px";
    div.style.margin = "20px 10px 20px 30px";
    document.querySelector('#feed').append(div);
}
