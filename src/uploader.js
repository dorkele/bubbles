import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
        };
    }

    handleChange(e) {
        this.setState({
            file: e.target.files[0],
        });
    }

    uploadImage(e) {
        e.preventDefault();
        var formData = new FormData();
        formData.append("file", this.state.file);
        axios
            .post("/upload", formData)
            .then(({ data }) => {
                let imgUrl = data.imgUrl;
                this.props.setImgUrl(imgUrl);
            })
            .catch(() => {
                this.setState({
                    error: true,
                });
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
                    {this.state.error && (
                        <p className="error">
                            OOps, something went wrong! Make sure the size of
                            your image is less than 2MB and try again!
                        </p>
                    )}

                    <input
                        className="file-input"
                        onChange={(e) => this.handleChange(e)}
                        type="file"
                        name="file"
                        accept="image/*"
                    />

                    <button onClick={(e) => this.uploadImage(e)}>
                        Change profile picture
                    </button>
                </div>
            </div>
        );
    }
}
