import React from "react";
import axios from "./axios";

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bioEditorIsVisible: false,
            bioInProgress: ""
        };
    }

    toggleTextarea() {
        this.setState({
            bioEditorIsVisible: !this.state.bioEditorIsVisible
        });
    }

    handleChange({ target }) {
        console.log("textarea.value", target.value);
        this.setState({
            bioInProgress: target.value
        });
    }

    updateBio(e) {
        e.preventDefault();
        console.log("about to make post request", this.state.bioInProgress);
        axios
            .post("/bio", { newBio: this.state.bioInProgress })
            .then(response => {
                console.log("response in post bio: ", response);
            })
            .catch(error => {
                console.log("error in post bio: ", error);
            });
    }
    //
    render() {
        console.log("this.props: ", this.props);
        console.log("this.state: ", this.state);

        let editBio;
        let txtarea = (
            <div>
                <textarea
                    name="textarea"
                    onChange={e => {
                        this.handleChange(e);
                    }}
                ></textarea>
                <button onClick={e => this.updateBio(e)}>Save</button>
            </div>
        );
        if (
            this.props.bio == undefined &&
            this.state.bioEditorIsVisible == false
        ) {
            editBio = (
                <button onClick={() => this.toggleTextarea()}>
                    Add your bio.
                </button>
            );
        } else if (
            this.props.bio != undefined &&
            this.state.bioEditorIsVisible == false
        ) {
            editBio = (
                <div>
                    this.props.bio
                    <button onClick={() => this.toggleTextarea()}>
                        Edit bio.
                    </button>
                </div>
            );
        }

        return (
            <React.Fragment>
                {editBio}
                {this.state.bioEditorIsVisible && txtarea}
            </React.Fragment>
        );
    }
}
