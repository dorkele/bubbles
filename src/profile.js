import React from "react";
import ProfilePic from "./profile-pic";
import BioEditor from "./bioeditor";

export default function Profile({ first, last, bio, setBio }) {
    return (
        <React.Fragment>
            <div>
                {first} {last}
            </div>
            <ProfilePic />
            <BioEditor bio={bio} setBio={setBio} />
        </React.Fragment>
    );
}
