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
            <div className="profile">
                <div className="big-pic">
                    <ProfilePic
                        toggleModal={toggleModal}
                        imgUrl={imgUrl}
                        onError={(e) => {
                            e.target.src = "/images/bubbles-prof-default.png";
                        }}
                    />
                </div>
                <p>
                    <strong>
                        {first} {last}
                    </strong>
                </p>
            </div>
            <BioEditor bio={bio} setBio={setBio} />
        </React.Fragment>
    );
}
