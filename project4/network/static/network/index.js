document.addEventListener('DOMContentLoaded', function() {
    const PostForm = document.querySelector('#new-post-form');
    PostForm.addEventListener("submit", () => create_post(PostForm))
})

function create_post(PostForm){
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