document.addEventListener('DOMContentLoaded', function() {
    const PostForm = document.querySelector('#new-post-form');
    PostForm.addEventListener("submit", (event) => create_post(event, PostForm))
})

function create_post(event,PostForm){
    event.preventDefault()
    fetch('', {
        method: 'POST',
        body:JSON.stringify({
            type: 'post',
            content: `${PostForm.content.value}`
        })
    })
        .then(response => response.json())
        .then(result => console.log(result));
    PostForm.content.value = ''
}