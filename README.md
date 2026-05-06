### Project Setup
Start database: run docker container with Postgres
```
docker compose -f db/docker-compose.yml up -d
```
Install dependencies
```
npm install
```
Setup db tables from a fresh db (recreate db and run all prisma migrations):
```
npx prisma migrate reset
```
Run app:
```
npm run start
```



## About
This ia the api for my finance/budgeting app Ledger. The stack is node, express, prisma, with Postgres for persistence.

### Reference
If schemas change, create a new named prisma migration:
```
npx prisma migrate dev --name my_migration_name
```
