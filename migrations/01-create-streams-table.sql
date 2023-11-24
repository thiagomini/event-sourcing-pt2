
CREATE DATABASE streams;

-- BEGIN: streams
CREATE TABLE streams (
  id VARCHAR(255) PRIMARY KEY,
  version SMALLINT,
  event JSONB
);
-- END: streams
