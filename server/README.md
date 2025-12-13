# Donation Backend

This is a simple Express.js backend intended to pair with a front-end donation site.
It uses SQLite for storage and provides simple endpoints for:

- User registration and login (JWT)
- Campaign CRUD (basic)
- Create donation (mock payment)
- Image uploads (multer)
- Admin stats

## Quick start

1. Install dependencies:
   ```
   npm install
   ```

2. Run migrations (creates SQLite DB and tables):
   ```
   npm run migrate
   ```

3. Start the server:
   ```
   npm start
   ```

The server runs on port `4000` by default.

## API overview

- `POST /api/auth/register` {name, email, password}
- `POST /api/auth/login` {email, password}
- `GET /api/campaigns`
- `POST /api/campaigns` {title, description, goal, image}
- `GET /api/campaigns/:id`
- `POST /api/donations` {campaign_id, user_id, amount, currency}
- `POST /api/uploads/image` (multipart/form-data, field name `image`)
- `GET /api/admin/stats`

Feel free to adapt or ask me to add real payment integration (Stripe / PayPal) or authentication middleware.
