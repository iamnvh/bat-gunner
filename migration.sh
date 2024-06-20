rm -rf src/database/migrations/
npm run migration:generate -- src/database/migrations/CreateNameTable 
docker restart postgres_1
npm run migration:run