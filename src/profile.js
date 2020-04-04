import React from "react";
import ProfilePic from "./profile-pic";
import BioEditor from "./bioeditor";

export default function Profile({
    first,
    last,
    bio,
    setBio,
    toggleModal,
    imgUrl,
}) {
    return (
        <React.Fragment>
            <div>
                {first} {last}
            </div>
            <ProfilePic toggleModal={toggleModal} imgUrl={imgUrl} />
            <BioEditor bio={bio} setBio={setBio} />
        </React.Fragment>
    );
}
