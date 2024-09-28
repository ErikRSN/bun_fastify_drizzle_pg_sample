*This creates the table that is used to store sessions*

#### This is code for creating the table and setting up indexes

##### Table name - session_table
Replace the table name is you want to use another table name - remember to change it in app.js also.

    CREATE TABLE "session_table" (
      "sid" varchar NOT NULL COLLATE "default",
      "sess" json NOT NULL,
      "expire" timestamp(6) NOT NULL
    )
    WITH (OIDS=FALSE);

    ALTER TABLE "session_table" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

    CREATE INDEX "IDX_session_expire" ON "session_table" ("expire");

