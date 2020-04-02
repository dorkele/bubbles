import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {
        console.log("my uploader component mounted");
    }

    handleChange(e) {
        console.log("changeee");
        console.log("file: ", e.target.files[0]);
        this.setState({
            file: e.target.files[0]
        });
    }

    uploadImage() {
        console.log("I am upload image in uploader");
        // e.preventDefault();
        // console.log(this.state.file);
        var formData = new FormData();

        formData.append("file", this.state.file);
        axios
            .post("/upload", formData)
            .then(({ data }) => {
                console.log("response from post upload. ", data.imgUrl);
                console.log("this.props: ", this.props);
                let imgUrl = data.imgUrl;
                this.props.setImgUrl(imgUrl);
            })
            .catch(function(error) {
                console.log("error in post upload: ", error);
            });
    }

    render() {
        console.log("this.props: ", this.props);
        return (
            <React.Fragment>
                <h3>Set new profile picture!</h3>
                <input
                    onChange={e => this.handleChange(e)}
                    type="file"
                    name="file"
                    accept="image/*"
                />
                <label htmlFor="file">Choose a file</label>

                <button onClick={() => this.uploadImage()}>Click me!</button>
            </React.Fragment>
        );
    }
}
