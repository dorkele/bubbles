import React from "react";

export default function ProfilePic({ first, last, imgUrl, toggleModal }) {
    imgUrl = imgUrl || "/images/bubbles-prof-default.png";

    return (
        <React.Fragment>
            <img
                className="prof-pic"
                onClick={() => toggleModal()}
                src={imgUrl}
                alt={`${first} ${last}`}
            />
        </React.Fragment>
    );
}
