import React, { useEffect, useState } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [users, setUsers] = useState([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        console.log("results for input");
        console.log("input: ", input);

        let cleanup = false;
        axios
            .get("/findusers", { params: { val: input } }) /////shvatiti route
            .then((response) => {
                console.log(
                    "response in useeffect matching people component: ",
                    response.data
                );

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
            <input
                onChange={handleChange}
                placeholder="type to find people"
            ></input>
            {users.map((user) => {
                return (
                    <div key={user.id}>
                        <Link to={"/user/" + user.id}>
                            <img
                                src={user.img_url}
                                onError={(e) => {
                                    e.target.src =
                                        "/images/bubbles-prof-default.png";
                                }}
                                className="prof-pic"
                            />
                            <p>
                                {user.first} {user.last}
                            </p>
                        </Link>
                    </div>
                );
            })}
        </div>
    );
}
