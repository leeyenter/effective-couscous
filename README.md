## Database

```shell
docker run --rm --name ghostdb -e POSTGRES_PASSWORD=mysecretpassword -d -p 5432:5432 postgres
```

## Backend

To run:

```shell
npx knex migrate:latest
npx knex seed:run
npx nodemon
```

To test:

```
npm test
```

## Frontend

```shell
npm start
```
