import React from "react";
import BioEditor from "./bioeditor";
import { render, fireEvent } from "@testing-library/react";
import axios from "./axios";

test("When no bio is passed to it, an 'Add' button is rendered.", () => {
    const { container } = render(<BioEditor />);
    expect(container.querySelector("button").innerHTML).toBe("Add your bio.");
});

test("When a bio is passed to it, an 'Edit' button is rendered.", () => {
    const { container } = render(<BioEditor bio="My Bio" />);
    expect(container.querySelector("button").innerHTML).toBe("Edit bio.");
});

test("Clicking either the 'Add' or 'Edit' button causes a textarea and a 'Save' button to be rendered.", () => {
    const { container } = render(<BioEditor /> || <BioEditor bio="My Bio" />);
    fireEvent.click(container.querySelector("button"));
    expect(container.querySelector("textarea").getAttribute("name")).toBe(
        "textarea"
    );
    expect(container.querySelector("button").innerHTML).toBe("Save");
});

jest.mock("./axios");

test("Clicking the 'Save' button causes an ajax request.", async () => {
    const { container } = render(<BioEditor bio="My Bio" />);
    fireEvent.click(container.querySelector(".edit"));
    axios.post.mockResolvedValue({
        data: {
            newBio: true,
        },
    });
    fireEvent.click(container.querySelector(".save"));

    return axios.post().then((response) => {
        expect(response.data.newBio).toBe(true);
    });
});

test(" When the mock request is successful, the function that was passed as a prop to the component gets called.", async () => {
    const myMockOnClick = jest.fn();
    const { container } = render(
        <BioEditor bio="My Bio" setBio={myMockOnClick} />
    );
    await fireEvent.click(container.querySelector(".edit"));
    await fireEvent.click(container.querySelector(".save"));
    expect(myMockOnClick.mock.calls.length).toBe(1);
});
