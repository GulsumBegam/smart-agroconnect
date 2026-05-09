# 🌾 Smart AgroConnect

Minimal full-stack scaffold for an agricultural marketplace + ML-powered crop/soil advisor.

## Architecture
┌─────────────┐   ┌──────────────┐   ┌─────────────┐
│  Expo Mobile │──▶│ Node Backend │──▶│  FastAPI ML │
│  (React Nav) │   │  (Express)   │   │  (Predict)  │
└─────────────┘   └──────┬───────┘   └─────────────┘
│
┌────────┴────────┐
│                 │
┌────▼────┐     ┌─────▼────┐
│Postgres │     │  Mongo   │
│(Users,  │     │(Listings,│
│ Auth)   │     │ Bids)    │
└─────────┘     └──────────┘

## Quick Start

```bash
# 1. Start infra + backend + ML
docker compose up --build

# 2. In another terminal, start mobile
cd mobile
npm install
npm start
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login, returns JWT |
| GET | /api/auth/me | Current user profile |
| GET | /api/listings | All marketplace listings |
| POST | /api/listings | Create listing (auth) |
| GET | /api/listings/:id | Single listing + bids |
| POST | /api/listings/:id/bids | Place bid (auth) |
| POST | /api/predict/crop | Crop recommendation |
| POST | /api/predict/price | Price prediction |
| POST | /api/soil/analyze | Soil image analysis (stub) |
