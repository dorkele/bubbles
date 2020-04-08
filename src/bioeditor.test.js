import React from "react";
import BioEditor from "./bioeditor";
import { render, fireEvent } from "@testing-library/react";

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
    expect(container.querySelector("button").innerHTML).toBe("Save");
    expect(container.querySelector("textarea").getAttribute("name")).toBe(
        "textarea"
    );
});

// 4. Clicking the "Save" button causes an ajax request. The request should not actually happen during your test.
//To prevent it from actually happening, you should mock axios.

// 5. When the mock request is successful, the function that was passed as a prop to the component gets called.
