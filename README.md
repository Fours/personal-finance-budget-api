## About
This ia the api for my finance/budgeting app Ledger. The stack is node, express, prisma, with Postgres for persistence.

<img src="https://raw.githubusercontent.com/Fours/personal-finance-budget-api/refs/heads/main/docs/ledger-dashboard-1.png">
<img src="https://raw.githubusercontent.com/Fours/personal-finance-budget-api/refs/heads/main/docs/ledger-transactions-1.png">
<img src="https://raw.githubusercontent.com/Fours/personal-finance-budget-api/refs/heads/main/docs/ledger-budget-1.png">

## Project Setup
Start database - run docker container with Postgres:
```
docker compose -f db/docker-compose.yml up -d
```
Install dependencies:
```
npm install
```
Setup db tables from a fresh db (recreate db and run all prisma migrations) then add seed data:
```
npx prisma migrate reset
npx prisma db seed
```
Run app (and watch for changes):
```
npm run dev
```

### Reference
If schemas change, create a new named prisma migration and regenerate client:
```
npx prisma migrate dev --name my_migration_name
npx prisma generate
```
Run test coverage
```
npm test -- --coverage
```


