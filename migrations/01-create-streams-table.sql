
CREATE DATABASE streams;

-- BEGIN: streams
CREATE TABLE streams (
  id serial PRIMARY KEY,
  stream_id VARCHAR(255) NOT NULL,
  version SMALLINT,
  event JSONB
);
-- END: streams
