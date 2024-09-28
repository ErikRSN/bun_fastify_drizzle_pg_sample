# code

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run app.js
```

This project was created using `bun init` in bun v1.1.2. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

This project is a starter for using bun with Fastify, PostgreSQL, Drizzle-orm in a easy to use complete solution to quickly launch a server that already works.

By default it uses pdkf2 for hashing passwords with iteration count=1000. This also matches with the way passwords are saved in web2py and py4web. This started as a migration project.

I have included a sample database dump to get you started. To use it set up PostgreSQL server, create a database named "sample". Then run the following command:

pg_restore -h <hostname> -p <port, default is 5432> -U <userid> -W --verbose --dbname=<sample or whatever name you have used> <dumpfile>

Once loaded confirm that there are 3 tables and data is in users and sample. That should get you started.

To start use the email testuser@example.com, password: testpass to log in.

Actions available:

localhost:3000/login
localhost:3000/register
localhost:3000/logout

localhost:3000/sample/getall
localhost:3000?sample/addone

