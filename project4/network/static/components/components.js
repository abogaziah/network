class App extends React.Component{
    constructor(props) {
        super(props);
        this.state = {page:"feed"};
        this.determinePage()
    }

    determinePage(){
        let homeButton = document.getElementById('homeButton');
        homeButton.addEventListener('click', ()=>{
            this.setState({page:"feed"});
        })
        let profileButton = document.getElementById("ProfileButton");
        profileButton.addEventListener('click', ()=>{
            this.setState({page:"profile"});
        })
    }

    render(){
        return(
            <div>
                <PostForm />
                {(this.state.page === "feed")
                    ?<Feed/>
                    :null
                }
                {(this.state.page === "profile")
                    ?<ProfilePage/>
                    :null
                }
            </div>
        )
    }

}

class PostForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fileChangedHandler = this.fileChangedHandler.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    fileChangedHandler = event => {
        this.setState({ selectedFile: event.target.files[0] })
    }

    handleSubmit() {
        this.create_post()
    }

    create_post(){
        if (this.state.value.length> 0){
            event.preventDefault()
            let formData = new FormData();
            formData.append("content", this.state.value);
            formData.append('media', this.state.selectedFile);
            fetch('/submitPost', {
                method: 'POST',
                body: formData
            }).then(response => response.json())
                .then(response => { console.log(response) });
            this.setState({value : ''})
        }
    }

    render() {
        return (
            <form className="postForm" onSubmit={this.handleSubmit} encType="multipart/form-data">
                <input className="form-control" type="text" placeholder="What's up, dog?" value={this.state.value} onChange={this.handleChange} />
                <input className="btn btn-primary postButton" type="submit" value="Post"/>
                <label htmlFor={"file"} className={"btn btn-primary imageButton"}>
                    <i className="fa fa-image"></i>
                </label>
                <span>
                    {this.state.selectedFile?this.state.selectedFile.name:null}
                </span>
                <input style={{display:'none'}} type="file" id={"file"} onChange={this.fileChangedHandler}/>
            </form>
        );
    }

}

class Feed extends React.Component{
    constructor(props) {
        super(props);
        this.state = {posts:[]};
        this.fetchPosts = this.fetchPosts.bind(this);
        this.fetchPosts()
    }
    fetchPosts(){
        event.preventDefault()
        fetch('/getPosts',{
            method:'GET'
        }).then(response => response.json())
            .then(posts => {
            this.setState({posts:posts});
        });
    }
    render(){
        const posts = this.state.posts;
        const FeedPosts = posts.map((post) => {
            let props = {
                username:post.author,
                timestamp: post.time_stamp,
                content:post.content,
                likes:post.likes,
                id:post.id,
                liked: post.liked,
                image: post.image}
            return <Post key={post.id} {...props}/>
        }
        );
        return(
            <div>
                {FeedPosts}
            </div>
        )
    }


}

class ProfilePage extends React.Component{
    constructor(props) {
        super(props);
        const app = document.getElementById('app');
        this.state = {posts:[], user: app.dataset.user};
        this.fetchPosts = this.fetchPosts.bind(this);
        this.fetchPosts()
    }
    fetchPosts(){
        event.preventDefault()
        fetch('/getProfile/'+this.state.user,{
            method:'GET'
        }).then(response => response.json()).then(posts => {
            this.setState({posts:posts});
        });
    }
    render() {
        const posts = this.state.posts;
        const ProfilePosts = posts.map((post) => {
                let props = {
                    username: post.author,
                    timestamp: post.time_stamp,
                    content: post.content,
                    likes: post.likes,
                    id: post.id,
                    liked: post.liked
                }
                return <Post key={post.id} {...props}/>
            }
        );
        return (
            <div>
                {ProfilePosts}
            </div>)
    }
}

class Post extends React.Component{
    constructor() {
        super();
        this.state = {showCommentForm:false}
        this.handler = this.handler.bind(this)
    }
    handler() {
        this.setState({
            showCommentForm: !this.state.showCommentForm
        })
    }
    render(){
        const showCommentForm = this.state.showCommentForm
        return(
            <div className='post'>
                {this.props.username}
                <br/>
                {this.props.timestamp}
                <hr/>
                <p>
                    <span>{this.props.content}</span>
                </p>
                <img src={this.props.image}/>
                <hr/>
                <div className="navbar">
                        <LikeButton id={this.props.id} likes={this.props.likes} liked = {this.props.liked}/>
                        <CommentButton handler={this.handler} id={this.props.id}/>
                </div>
                {showCommentForm? (
                    <div>
                        <CommentForm id={this.props.id}/>
                        <CommentFeed id={this.props.id}/>
                    </div>
                ): null }
            </div>

        )
    }
}

class LikeButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            liked: this.props.liked,
            likes: this.props.likes,
            class: (this.props.liked? 'UnlikeButton': 'LikeButton')
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.fetchAPI()
        this.setState({
            liked: !this.state.liked
        });
    }

    fetchAPI(){
        this.state.liked ? this.fetchLike() : this.fetchUnlike()
    }

    fetchUnlike(){
        this.setState({likes:this.state.likes+1, class:'UnlikeButton'})
        fetch('/submitPostLike', {
            method: 'POST',
            body:JSON.stringify({
                type: 'like',
                id: `${this.props.id}`
            })
        }).then(response => response.json())
        .then(response => { console.log(response) });
    }

    fetchLike(){
        this.setState({likes:this.state.likes-1, class:'LikeButton'})
        fetch('/submitPostLike', {
            method: 'POST',
            body:JSON.stringify({
                type: 'unlike',
                id: `${this.props.id}`
            })
        }).then(response => response.json())
        .then(response => { console.log(response) });
    }


    render() {
        return (
            <div >
                <button className={this.state.class} onClick={this.handleClick}>
                    <i className="fa fa-heart"></i>
                </button>
                {this.state.likes}
            </div>
        );
    }
}

class CommentButton extends React.Component{
    constructor(props) {
        super(props);
        this.state = {isClicked:false};
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(){
        this.setState({isClicked:!this.state.isClicked})
    }
    render(){
        return(
            <div className={"navbar"}>
                    <button className={"CommentButton"} onClick={this.props.handler}>
                        <i className="fa fa-comment"></i>
                    </button>
            </div>

        )
    }

}

class CommentForm extends React.Component{
    constructor(props) {
        super(props);
        this.state = {value: ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(){
        if (this.state.value.length> 0){
            event.preventDefault()
            fetch('/submitComment', {
                method: 'POST',
                body:JSON.stringify({
                    content: `${this.state.value}`,
                    postId: `${this.props.id}`
                })
            }).then(response => response.json())
            .then(response => { console.log(response) });
            this.setState({value : ''})
        }
    }

    render() {
        return (
            <form className="commentForm" onSubmit={this.handleSubmit}>
                <input className="form-control" type="text" placeholder="Add a comment" value={this.state.value} onChange={this.handleChange} />
                <label htmlFor={"subComment"} className={"btn btn-primary commentButton"}>
                    <i className="fa fa-paper-plane"></i>
                </label>
                <input style={{display:'none'}} className="btn btn-primary" id={"subComment"} type="submit" value="Post" />
            </form>
        );
    }

}

class CommentFeed extends React.Component{
    constructor(props) {
        super(props);
        this.state = {comments:[]};
        this.fetchComments = this.fetchComments.bind(this);
        this.fetchComments()
    }
    fetchComments(){
        event.preventDefault()
        fetch('/getComments?' + new URLSearchParams({
            id:`${this.props.id}`
        })).then(response => response.json()).then(comments => {
            this.setState({comments:comments});
        });
    }
    render(){
        const comments = this.state.comments;
        const FeedComments = comments.map((comment) => {
                let props = {
                    username:comment.author,
                    timestamp: comment.time_stamp,
                    content:comment.content,
                    likes:comment.likes,
                    id:comment.id,
                    liked: comment.liked}
                return <Comment key={comment.id} {...props}/>
            }
        );
        return(
            <div>
                {FeedComments}
            </div>
        )
    }
}

class Comment extends React.Component{
    constructor() {
        super();
    }
    render(){
        return(
            <div className='comment'>
                {this.props.username}
                <br/>
                {this.props.timestamp}
                <hr/>
                <p>{this.props.content}</p>
            </div>

        )
    }

}

ReactDOM.render(
    <App/>,
    document.getElementById('app')
);