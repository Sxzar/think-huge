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

## STOP

```bash
docker compose down
```