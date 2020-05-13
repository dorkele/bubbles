import React, { useEffect, useState } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [users, setUsers] = useState([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        let cleanup = false;
        axios
            .get("/findusers", { params: { val: input } })
            .then((response) => {
                if (!cleanup) {
                    setUsers(response.data);
                }
            })
            .catch((error) => {
                console.log(
                    "error in useeffect matching people component: ",
                    error
                );
            });

        return () => {
            cleanup = true;
        };
    }, [input]);

    const handleChange = (e) => {
        setInput(e.target.value);
    };

    return (
        <div className="find-friends-container">
            <input onChange={handleChange} placeholder="find people"></input>
            <div className="grid-container">
                {users.map((user) => {
                    return (
                        <div
                            key={user.id}
                            className="big-pic find-people-container"
                        >
                            <img
                                src={
                                    user.img_url ||
                                    "/images/bubbles-prof-default.png"
                                }
                                className="prof-pic"
                            />
                            <Link to={"/user/" + user.id}>
                                {user.first} {user.last}
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
