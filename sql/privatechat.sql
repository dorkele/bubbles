DELETE TABLE IF EXISTS privatechat;

CREATE TABLE privatechat (
    id SERIAL PRIMARY KEY,
    text VARCHAR NOT NULL CHECK (text != ''),
    sender_id INT NOT NULL REFERENCES users(id),
    receiver_id INT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO privatechat(text, sender_id, receiver_id) VALUES (
    'Hey M., how are you?',
    1,
    83
);

INSERT INTO privatechat(text, sender_id, receiver_id) VALUES (
    'Hey D., fine, thank you. What about you?',
    83,
    1
);

INSERT INTO privatechat(text, sender_id, receiver_id) VALUES (
    'Holding on.',
    1,
    83
);

INSERT INTO privatechat(text, sender_id, receiver_id) VALUES (
    'It was great hearing from you.',
    83,
    1
);

INSERT INTO privatechat(text, sender_id, receiver_id) VALUES (
    'You too!',
    1,
    83
);
