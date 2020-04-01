import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom"; //je li mi ovo potrebno?
//import { PinpointEmail } from "aws-sdk";

export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: "email"
        };
    }

    handleChange({ target }) {
        this.setState({
            [target.name]: target.value
        });
    }

    submitEmail(e) {
        console.log("i clicked a button to submit email");
        console.log("this.state.email: ", this.state.email);
        e.preventDefault();
        axios
            .post("/password/reset/start", {
                email: this.state.email
            })
            .then(({ data }) => {
                console.log("data: ", data);

                if (data.success) {
                    this.setState({
                        step: "code"
                    });
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

    verifyCode(e) {
        console.log("i clicked verify button");
        e.preventDefault();
        axios
            .post("/password/reset/verify", {
                email: this.state.email,
                code: this.state.code,
                password: this.state.newPw
            })
            .then(({ data }) => {
                if (data.success) {
                    this.setState({
                        step: "success"
                    });
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
        const step = this.state.step;
        let reset;
        if (step == "email") {
            reset = (
                <form>
                    <div className="form">
                        {/* probati ovo sto se ponavlja maknuti iz onoga sto se mijenja */}
                        <p>Reset password</p>
                        {this.state.error && (
                            <div>Oops, something went wrong!</div>
                        )}
                        <p>To reset password please enter your e-mail:</p>

                        <input
                            name="email"
                            placeholder="e-mail"
                            onChange={e => this.handleChange(e)}
                        />
                        <button onClick={e => this.submitEmail(e)}>
                            Submit
                        </button>
                    </div>
                </form>
            );
        } else if (step == "code") {
            reset = (
                <div className="form">
                    <p>Reset Password</p>
                    {this.state.error && <div>Oops, something went wrong!</div>}
                    <form>
                        <p>Please enter the verification code:</p>

                        <input
                            name="code"
                            placeholder="verification code"
                            onChange={e => this.handleChange(e)}
                        />
                        <p>Please enter your new password:</p>
                        <input
                            name="newPw"
                            placeholder="new password"
                            type="password"
                            onChange={e => this.handleChange(e)}
                        />
                        <button onClick={e => this.verifyCode(e)}>
                            Submit
                        </button>
                    </form>
                </div>
            );
        } else if (step == "success") {
            reset = (
                <div className="form">
                    <p>Reset Password</p>
                    {this.state.error && <div>Oops, something went wrong!</div>}

                    <p>Success!</p>
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
