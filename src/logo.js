import React from "react";
import { Link } from "react-router-dom";

export default function Logo() {
    return (
        <Link to="/">
            <img className="small-logo" src="/images/Bubbles.png" alt="logo" />
        </Link>
    );
}
