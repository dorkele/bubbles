DELETE TABLE IF EXISTS chat;

CREATE TABLE chat (
    id SERIAL PRIMARY KEY,
    text VARCHAR NOT NULL CHECK (text != ''),
    user_id INT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO chat(text, user_id) VALUES (
    'What is up people?',
    1
);

INSERT INTO chat(text, user_id) VALUES (
    'Not much...',
    111
);

INSERT INTO chat(text, user_id) VALUES (
    'I am bored.',
    167
);

INSERT INTO chat(text, user_id) VALUES (
    'Only boring people are bored',
    13
);

