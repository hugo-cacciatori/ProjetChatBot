# To run project  : 

- `cd backend`
- `npm install`
- `cd ../frontend`
- `npm install`
- `cp .env.sample .env`
- `docker compose up`

# Migrations 

- `docker compose exec backend /bin/sh`
- `npm run typeorm:generate-migration --name=db-change`
- `npm run typeorm migration:run -- -d ./src/config/dataSource.ts`
