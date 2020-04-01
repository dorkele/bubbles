DELETE TABLE IF EXISTS pw_reset_codes;

CREATE TABLE pw_reset_codes(
      id SERIAL PRIMARY KEY,
      code VARCHAR(255),
      email VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );