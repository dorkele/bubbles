import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
        };
    }
    componentDidMount() {
        console.log("my uploader component mounted");
        console.log("props: ", this.props);
    }

    handleChange(e) {
        console.log("changeee");
        console.log("file: ", e.target.files[0]);
        this.setState({
            file: e.target.files[0],
        });
    }
    uploadImage(e) {
        console.log("I am upload image in uploader");
        e.preventDefault();
        // console.log(this.state.file);
        var formData = new FormData();

        formData.append("file", this.state.file);
        axios
            .post("/upload", formData)
            .then(({ data }) => {
                console.log("response from post upload. ", data.imgUrl);
                //console.log("this.props: ", this.props);
                let imgUrl = data.imgUrl;
                this.props.setImgUrl(imgUrl);
            })
            .catch(function (error) {
                console.log("error in post upload: ", error);
                //wrong = <p>OOps, something went wrong!</p>;
                // this.setState({
                //     error: true,
                // });
            });
    }

    render() {
        return (
            <div className="uploader-overlay">
                <div className="uploader">
                    <h1
                        onClick={() => this.props.toggleModal()}
                        className="close-uploader"
                    >
                        X
                    </h1>
                    <label htmlFor="file">
                        <input
                            className="file-input"
                            onChange={(e) => this.handleChange(e)}
                            type="file"
                            name="file"
                            accept="image/*"
                        />
                    </label>

                    <button onClick={(e) => this.uploadImage(e)}>
                        Change profile picture
                    </button>

                    {/* {this.state.error && (
                        <div className="error">Oops, something went wrong!</div>
                    )} */}
                </div>
            </div>
        );
    }
}
