import React from "react";
import axios from "./axios";

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bioEditorIsVisible: false,
            bioInProgress: "",
        };
    }

    toggleTextarea() {
        this.setState({
            bioEditorIsVisible: !this.state.bioEditorIsVisible,
        });
    }

    handleChange({ target }) {
        this.setState({
            bioInProgress: target.value,
        });
    }

    updateBio(e) {
        e.preventDefault();
        axios
            .post("/bio", { newBio: this.state.bioInProgress })
            .then(({ data }) => {
                let newBio = data.newBio;
                this.props.setBio(newBio);
                this.setState({
                    bioEditorIsVisible: false,
                });
            })
            .catch((error) => {
                console.log("error in post bio: ", error);
            });
    }

    render() {
        let editBio;
        let txtarea = (
            <div className="profile">
                <textarea
                    name="textarea"
                    onChange={(e) => {
                        this.handleChange(e);
                    }}
                    placeholder="Tell us something about yourself..."
                    defaultValue={this.props.bio}
                />
                <button
                    className="save inside-btn"
                    onClick={(e) => this.updateBio(e)}
                >
                    Save
                </button>
            </div>
        );

        if (
            (this.props.bio == undefined || this.props.bio == "") &&
            this.state.bioEditorIsVisible == false
        ) {
            editBio = (
                <div className="profile">
                    <button
                        className="add inside-btn"
                        onClick={() => this.toggleTextarea()}
                    >
                        Add bio
                    </button>
                </div>
            );
        } else if (
            this.props.bio != undefined &&
            this.state.bioEditorIsVisible == false
        ) {
            editBio = (
                <div className="profile ">
                    {this.props.bio}
                    <button
                        className="edit inside-btn"
                        onClick={() => this.toggleTextarea()}
                    >
                        Edit bio
                    </button>
                </div>
            );
        }

        return (
            <div className="bio-editor">
                {editBio}
                {this.state.bioEditorIsVisible && txtarea}
            </div>
        );
    }
}
