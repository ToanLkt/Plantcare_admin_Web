# PlantCare Hub Admin Web

Standalone Vite + React + TypeScript admin dashboard for PlantCare Hub.

## Setup

```bash
npm install
npm run typecheck
npm run build
```

## Environment

Copy `.env.example` to `.env` for local configuration.

```env
VITE_API_BASE_URL=https://api.plantcarehub.id.vn
VITE_ADMIN_APP_NAME=PlantCare Hub Admin
```

The app reads the API base URL from `VITE_API_BASE_URL`, normalizes trailing slashes, and attaches `Authorization: Bearer <token>` for protected requests.

## Routes

- `/login`
- `/dashboard`
- `/users`
- `/users/:userId`
- `/users/:userId/subscriptions`
- `/users/:userId/payments`
- `/payments`
- `/payments/:paymentTransactionId`
- `/subscription-plans`
- `/background-jobs/care-task-generation`
- `/settings`

Deploy as a static SPA and configure all route rewrites to `index.html`.
