class App extends React.Component{
    constructor(props) {
        super(props);
        this.state = {page:""};
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
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit() {
        this.create_post()
    }

    create_post(){
        if (this.state.value.length> 0){
            fetch('/submitPost', {
                method: 'POST',
                body:JSON.stringify({
                    content: `${this.state.value}`
                })
            })//.then(response => response.json())
                //.then(response => { console.log(response) });
            this.setState({value : ''})
        }
    }

    render() {
        return (
            <form className="postForm" onSubmit={this.handleSubmit}>
                <input className="form-control" type="text" placeholder="What's up?" value={this.state.value} onChange={this.handleChange} />
                <input className="btn btn-primary" type="submit" value="Post" />
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
        }).then(response => response.json()).then(posts => {
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
                id:post.id}
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
        this.state = {posts:[]};
        this.fetchPosts = this.fetchPosts.bind(this);
        this.fetchPosts()
    }
    fetchPosts(){
        event.preventDefault()
        fetch('/getProfile/abogazia',{
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
                    id: post.id
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
    }

    render(){
        return(
            <div className='post'>
                {this.props.username}
                <br/>
                {this.props.timestamp}
                <hr/>
                <h5>{this.props.content}</h5>
                <hr/>
                <LikeButton id={this.props.id} likes={this.props.likes}/>
            </div>

        )
    }
}

class LikeButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            liked: false,
            likes: this.props.likes,
            class:'LikeButton'
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




ReactDOM.render(
    <App/>,
    document.getElementById('app')
);