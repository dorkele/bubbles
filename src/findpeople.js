import React, { useEffect, useState } from "react";
import axios from "./axios";

export default function FindPeople() {
    const [users, setUsers] = useState([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        console.log("component has mounted");

        axios
            .get("/users.json") /////shvatiti route
            .then((response) => {
                console.log(
                    "response in useeffect find people component: ",
                    response.data
                );
                setUsers(response.data);
            })
            .catch((error) => {
                console.log(
                    "error in useeffect find people component: ",
                    error
                );
            });
    }, []);

    useEffect(() => {
        console.log("results for input");
        console.log("input: ", input);

        axios
            .get("/findusers", { params: { val: input } }) /////shvatiti route
            .then((response) => {
                console.log(
                    "response in useeffect matching people component: ",
                    response.data
                );
                setUsers(response.data);
            })
            .catch((error) => {
                console.log(
                    "error in useeffect matching people component: ",
                    error
                );
            });
        // return () => {
        //     cleanup;
        // };
    }, [input]);

    const handleChange = (e) => {
        setInput(e.target.value);
    };

    return (
        <React.Fragment>
            <input
                onChange={handleChange}
                placeholder="type to find people"
            ></input>
            {users.map((user) => {
                return (
                    <div key={user.id}>
                        <img src={user.img_url} />
                        <p>
                            {user.first} {user.last}
                        </p>
                    </div>
                );
            })}
        </React.Fragment>
    );
}
