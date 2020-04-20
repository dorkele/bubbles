import React from "react";
import axios from "./axios";
import FriendButton from "./friendbutton.js";
//import PrivateChat from "./privatechat";

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        const id = this.props.match.params.id;
        console.log("this.props.match.params: ", this.props.match.params);

        axios
            .get(`/user/${id}.json`)
            .then(({ data }) => {
                console.log("data in GET user id json: ", data[0]);

                if (data.redirect) {
                    console.log("REDIRECT!!!!!!!!");

                    this.props.history.push("/");
                } else {
                    this.setState({
                        id: data[0].id,
                        first: data[0].first,
                        last: data[0].last,
                        imgUrl: data[0].img_url,
                        bio: data[0].bio,
                    });
                }
            })
            .catch((error) => console.log("error in cdm otherprofile", error));
    }

    render() {
        return (
            <React.Fragment>
                <div className="profile">
                    <div className="big-pic">
                        <img
                            className="big-pic"
                            src={this.state.imgUrl}
                            onError={(e) => {
                                e.target.src =
                                    "/images/bubbles-prof-default.png";
                            }}
                        />
                    </div>
                    <p>
                        <strong>
                            {this.state.first} {this.state.last}
                        </strong>
                    </p>

                    {this.state.bio}
                    <FriendButton
                        id={this.props.match.params.id}
                        className="inside-btn"
                    />
                </div>
            </React.Fragment>
        );
    }
}
