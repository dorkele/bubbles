import React from "react";
import Registration from "./register";
import Login from "./login";
import ResetPassword from "./reset";
import { HashRouter, Route } from "react-router-dom";

export default function Welcome() {
    return (
        <HashRouter>
            <div>
                <img
                    className="banner"
                    src="/images/Bubbles-banner.png"
                    alt="logo"
                />
                <div className="subtitle">
                    Hang out with people who have nothing in common with you.
                </div>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route path="/reset" component={ResetPassword} />
                </div>
            </div>
        </HashRouter>
    );
}
