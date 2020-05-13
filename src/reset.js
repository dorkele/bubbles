import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: "email",
        };
    }

    handleChange({ target }) {
        this.setState({
            [target.name]: target.value,
        });
    }

    submitEmail(e) {
        e.preventDefault();
        axios
            .post("/password/reset/start", {
                email: this.state.email,
            })
            .then(({ data }) => {
                if (data.success) {
                    this.setState({
                        step: "code",
                        error: false,
                    });
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

    verifyCode(e) {
        e.preventDefault();
        axios
            .post("/password/reset/verify", {
                email: this.state.email,
                code: this.state.code,
                password: this.state.newPw,
            })
            .then(({ data }) => {
                if (data.success) {
                    this.setState({
                        step: "success",
                    });
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
        const step = this.state.step;
        let reset;

        if (step == "email") {
            reset = (
                <div className="form">
                    <p className="reset-pass">Reset Password</p>
                    {this.state.error && (
                        <div className="error">Oops, something went wrong!</div>
                    )}
                    <p>To reset password please enter your e-mail:</p>
                    <input
                        name="email"
                        placeholder="e-mail"
                        key="email"
                        onChange={(e) => this.handleChange(e)}
                    />
                    <button onClick={(e) => this.submitEmail(e)}>Submit</button>
                </div>
            );
        } else if (step == "code") {
            reset = (
                <div className="form">
                    <p className="reset-pass">Reset Password</p>
                    {this.state.error && (
                        <div className="error">Oops, something went wrong!</div>
                    )}
                    <p>Please enter the verification code:</p>
                    <input
                        name="code"
                        key="code"
                        placeholder="verification code"
                        onChange={(e) => this.handleChange(e)}
                    />
                    <p>Please enter your new password:</p>
                    <input
                        name="newPw"
                        key="newPw"
                        placeholder="new password"
                        type="password"
                        onChange={(e) => this.handleChange(e)}
                    />
                    <button onClick={(e) => this.verifyCode(e)}>Submit</button>
                </div>
            );
        } else if (step == "success") {
            reset = (
                <div className="form">
                    <p className="reset-pass black-font">Success!</p>
                    <p>
                        You can now <Link to="/login">log in</Link> with your
                        new password.
                    </p>
                </div>
            );
        }
        return <div>{reset}</div>;
    }
}
