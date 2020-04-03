import React from "react";
import axios from "./axios";
import ProfilePic from "./profile-pic";
import Uploader from "./uploader";
import Logo from "./logo";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            uploaderIsVisible: false
        };
    }

    componentDidMount() {
        console.log("my app component has mounted!");
        axios
            .get("/user")
            .then(({ data }) => {
                console.log("result in cdm app: ", data[0]);
                this.setState({
                    id: data[0].id,
                    first: data[0].first,
                    last: data[0].last,
                    email: data[0].email,
                    password: data[0].password,
                    bio: data[0].bio,
                    imgUrl: data[0].img_url,
                    timestamp: data[0].created_at
                });
                console.log("this.state: ", this.state);
            })
            .catch(error => {
                console.log("error in cdm in app: ", error);
            });
    }

    toggleModal() {
        console.log("toggleModal is running");
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible
        });
    }

    setImgUrl(url) {
        console.log("reached the parent with imgUrl:  ", url);
        this.setState({
            imgUrl: url,
            uploaderIsVisible: false
        });
    }

    render() {
        console.log("this.state u render: ", this.state);

        return (
            <div className="app">
                <Logo />
                <ProfilePic
                    first={this.state.first}
                    imgUrl={this.state.imgUrl}
                    last={this.state.last}
                    toggleModal={() => this.toggleModal()}
                />
                {this.state.uploaderIsVisible && (
                    <Uploader setImgUrl={imgUrl => this.setImgUrl(imgUrl)} />
                )}
            </div>
        );
    }
}
