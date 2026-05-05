### Project Setup
Start database: run docker container with Postgres
```
docker compose -f db/docker-compose.yml up -d
```
Install and run app
```
npm install
npm run start
```

## About
This ia the api for my finance/budgeting app Ledger. The stack is node, express, prisma, with Postgres for persistence.