import React from "react";
import axios from "./axios";
import ProfilePic from "./profile-pic";
import Uploader from "./uploader";
import Logo from "./logo";
import Profile from "./profile";
import { BrowserRouter, Route, Link } from "react-router-dom";
import OtherProfile from "./otherprofile.js";
import FindPeople from "./findpeople";
import Friends from "./friends";
import Chat from "./chat";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            uploaderIsVisible: false,
        };
    }

    componentDidMount() {
        //console.log("my app component has mounted!");
        axios
            .get("/user")
            .then(({ data }) => {
                //console.log("result in cdm app: ", data[0]);
                this.setState({
                    id: data[0].id,
                    first: data[0].first,
                    last: data[0].last,
                    bio: data[0].bio,
                    imgUrl: data[0].img_url,
                    timestamp: data[0].created_at,
                });
                //console.log("this.state: ", this.state);
            })
            .catch((error) => {
                console.log("error in cdm in app: ", error);
            });
    }

    toggleModal() {
        //console.log("toggleModal is running");
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    setImgUrl(url) {
        //console.log("reached the parent with imgUrl:  ", url);
        this.setState({
            imgUrl: url,
            uploaderIsVisible: false,
        });
    }

    setBio(newBio) {
        this.setState({
            bio: newBio,
        });
    }

    render() {
        //console.log("this.state u render: ", this.state);

        return (
            <BrowserRouter>
                <div className="app">
                    <div className="header">
                        <Logo />
                        <div className="right-nav">
                            <Link to="/chat">Chat</Link>
                            <Link to="/users">Find People</Link>
                            <Link to="/friends">Friends</Link>
                            {/* <div className="prof-log-out"> */}
                            <div className="small-pic">
                                <ProfilePic
                                    first={this.state.first}
                                    last={this.state.last}
                                    imgUrl={this.state.imgUrl}
                                    toggleModal={() => this.toggleModal()}
                                />
                            </div>
                            {/* <Link to="/logout">Log Out</Link> */}
                            {/* </div> */}
                        </div>
                    </div>

                    <Route
                        path="/user/:id"
                        render={(props) => (
                            <OtherProfile
                                key={props.match.url}
                                match={props.match}
                                history={props.history}
                            />
                        )}
                    />
                    <Route
                        exact
                        path="/"
                        render={() => (
                            <Profile
                                first={this.state.first}
                                last={this.state.last}
                                bio={this.state.bio}
                                imgUrl={this.state.imgUrl}
                                toggleModal={() => this.toggleModal()}
                                setBio={(newBio) => this.setBio(newBio)}
                            />
                        )}
                    />
                    <Route path="/users" component={FindPeople} />
                    <Route path="/friends" component={Friends} />
                    <Route path="/chat" component={Chat} />
                    {this.state.uploaderIsVisible && (
                        <Uploader
                            setImgUrl={(imgUrl) => this.setImgUrl(imgUrl)}
                        />
                    )}
                </div>
            </BrowserRouter>
        );
    }
}
