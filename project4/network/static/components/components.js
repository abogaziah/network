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

    handleSubmit(event) {
        this.create_post(event)
    }

    create_post(event){
        event.preventDefault()
        fetch('', {
            method: 'POST',
            body:JSON.stringify({
                type: 'post',
                content: `${this.state.value}`
            })
        })
            .then(response => response.json())
            .then(result => console.log(result));
        this.setState({value : ''})
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input class="form-control" type="text" placeholder="What's up?" value={this.state.value} onChange={this.handleChange} />
                <input class="btn btn-primary" type="submit" value="Post" />
            </form>
        );
    }

}

ReactDOM.render(
    <PostForm />,
    document.getElementById('postForm')
);