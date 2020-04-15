import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleChange({ target }) {
        this.setState({
            [target.name]: target.value,
        });
    }

    login() {
        console.log("button was clicked");
        axios
            .post("/login", {
                email: this.state.email,
                pass: this.state.pass,
            })
            .then(({ data }) => {
                if (data.success) {
                    location.replace("/");
                } else {
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    error: true,
                });
            });
    }

    render() {
        return (
            <div className="form">
                {this.state.error && <div>Oops, something went wrong!</div>}
                <input
                    name="email"
                    placeholder="email"
                    onChange={(e) => this.handleChange(e)}
                />
                <input
                    type="password"
                    name="pass"
                    placeholder="password"
                    onChange={(e) => this.handleChange(e)}
                />
                <button onClick={() => this.login()}>Log in</button>
                <div>
                    Not registered? <Link to="/">Register here.</Link>
                </div>
                <div className="margin">
                    Forgot your password?
                    <Link to="/reset">Click here to reset your password.</Link>
                </div>
            </div>
        );
    }
}
