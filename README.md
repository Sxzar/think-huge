## RUN 

```bash
docker compose up -d --build
```

Visit http://localhost:8080 


## Run Composer inside PHP container:

```bash
docker compose run --rm php composer install
docker compose run --rm php composer dump-autoload
```

## Create DB Tables 

```bash
docker compose exec php php scripts/migrate.php
```

### Seed a default admin 

```bash
docker compose exec php php scripts/seed_admin.php
```

### Optional: create or update an admin in the `admins` table with the given credentials

```bash
docker compose exec php php scripts/seed_admin.php custom@email.com custompassord
```

### Verify created tables

```bash
docker compose exec mysql mysql -uapp -papp -e "USE app; SHOW TABLES;"
```

## STOP

```bash
docker compose down
```