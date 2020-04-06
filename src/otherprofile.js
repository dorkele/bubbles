import React from "react";
import axios from "./axios";

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        const id = this.props.match.params.id;
        console.log("this.props.match.params.id: ", this.props.match.params.id);

        axios
            .get(`/user/${id}.json`)
            .then((data) => {
                console.log("data in GET user id json: ", data);

                if (data.redirect) {
                    this.props.history.push("/");
                } else {
                    this.setState(data);
                }
            })
            .catch((error) => console.log("error in cdm otherprofile", error));
    }

    render() {
        return (
            <React.Fragment>
                <div>
                    {this.state.first} {this.state.last}
                </div>
                <img src={this.state.imgUrl} />
                <div> {this.state.bio} </div>
            </React.Fragment>
        );
    }
}
