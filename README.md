```shell
docker run --name mysqldb -e MYSQL_ROOT_PASSWORD=my-secret-pw -d -p 3306:3306 mysql

docker run --name ghostdb -e POSTGRES_PASSWORD=mysecretpassword -d -p 5432:5432 postgres
```
