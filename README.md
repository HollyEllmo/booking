## Booking API (NestJS + Prisma + PostgreSQL)

Простой сервис бронирований:

- Auth: регистрация/логин по email+password с выдачей JWT
- Bookings: резерв места на событие (один пользователь не может бронировать одно событие дважды)
- Prisma ORM, PostgreSQL в Docker, Swagger-документация

### Стек

- NestJS 11, TypeScript
- Prisma 6, PostgreSQL 16 (docker-compose)
- JWT (passport-jwt, @nestjs/jwt), argon2 (хэш паролей)
- Swagger (`@nestjs/swagger`, `swagger-ui-express`)

---

## Быстрый старт

Требования:

- Node.js 18+ и npm
- Docker + Docker Compose

1. Установить зависимости:

```bash
npm install
```

2. Настроить переменные окружения (`.env`):

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5435/booking?schema=public"
JWT_SECRET="dev_jwt_secret"
```

3. Поднять БД (Docker):

```bash
npm run db:up
```

4. Применить миграции и сгенерировать клиент:

```bash
npx prisma migrate deploy
# или для разработки (создаёт новую миграцию при изменении схемы):
npx prisma migrate dev --name init
```

5. Засидить тестовые события:

```bash
npm run seed
```

6. Запустить приложение:

```bash
npm run start:dev
# по умолчанию http://localhost:3000
```

Swagger UI:

```text
http://localhost:3000/api-docs
```

---

## Основные возможности

Auth

- `POST /auth`
  - Body: `{ "email": "user@example.com", "password": "secret123" }`
  - Response: `{ "access_token": "<jwt>" }`

Bookings (требуется Bearer JWT)

- `POST /api/bookings/reserve`
  - Body: `{ "event_id": 1 }`
  - Response: `{ "id": 1, "event_id": 1, "user_id": "<userId>", "created_at": "..." }`
  - Ограничение: один пользователь не может забронировать одно событие дважды

---

## Полезные команды

```bash
# База
npm run db:up             # поднять postgres (docker compose)
npm run db:down           # остановить и удалить volume

# Prisma
npm run prisma:generate   # сгенерировать prisma client
npm run prisma:migrate    # prisma migrate dev
npx prisma studio         # визуальный просмотр БД

# Посев тестовых данных
npm run seed

# Запуск сервера
npm run start             # обычный запуск
npm run start:dev         # с перезапуском
npm run start:prod        # из dist/
```

---

## Тестовый сценарий вручную (curl)

1. Получить токен:

```bash
curl -s -X POST http://localhost:3000/auth \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@example.com","password":"secret123"}'
```

Сохраните `access_token` из ответа.

2. Забронировать событие (например, ID=1):

```bash
curl -s -X POST http://localhost:3000/api/bookings/reserve \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '{"event_id":1}'
```

Повторный вызов с тем же пользователем и `event_id` вернёт 409 (уже забронировано).
