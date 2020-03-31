import React from "react";
import axios from "axios";

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleChange({ target }) {
        this.setState({
            [target.name]: target.value
        });
    }

    register() {
        console.log("button was clicked");
        axios
            .post("/register", {
                first: this.state.first,
                last: this.state.last,
                email: this.state.email,
                pass: this.state.pass
            })
            .then(({ data }) => {
                if (data.success) {
                    location.replace("/");
                } else {
                    this.setState({
                        error: true
                    });
                }
            })
            .catch(error => {
                console.log(error);
                this.setState({
                    error: true
                });
            });
    }

    render() {
        return (
            <div>
                {this.state.error && <div>Oops, something went wrong!</div>}
                <input
                    name="first"
                    placeholder="first"
                    onChange={e => {
                        this.handleChange(e);
                    }}
                />
                <input
                    name="last"
                    placeholder="last"
                    onChange={e => this.handleChange(e)}
                />
                <input
                    name="email"
                    placeholder="email"
                    onChange={e => this.handleChange(e)}
                />
                <input
                    type="password"
                    name="pass"
                    placeholder="pass"
                    onChange={e => this.handleChange(e)}
                />
                <button onClick={() => this.register()}>Register</button>
                <div>
                    Already registered? <a href="/login">Log in</a>
                </div>
            </div>
        );
    }
}