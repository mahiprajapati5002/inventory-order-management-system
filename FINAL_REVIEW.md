# Final Review

## Requirement Compliance

- FastAPI backend: implemented in `backend/app`.
- React + Vite frontend: implemented in `frontend`.
- PostgreSQL storage: configured through SQLAlchemy and Docker Compose.
- Products, customers, orders, and inventory tracking: implemented.
- Unique product SKUs: enforced by database constraint and service validation.
- Unique customer emails: enforced by database constraint and service validation.
- Product price greater than zero: enforced by Pydantic and database constraint.
- Stock quantity cannot be negative: enforced by Pydantic and database constraint.
- Order quantity greater than zero: enforced by Pydantic.
- Insufficient stock prevention: enforced before order creation.
- Automatic stock reduction: implemented inside order creation transaction.
- Order total calculation: calculated from product prices on the backend.
- Environment variables: `.env.example` files provided for backend and frontend.
- Docker containerization: backend, frontend, and PostgreSQL services configured.
- Deployment preparation: `render.yaml`, Vercel config, and README deployment guide added.
- Automated tests: backend pytest suite added.
- Test verification: `6 passed`.

## Local Verification Limits

- Frontend build could not be run because `npm`/`pnpm`/`yarn` were unavailable and `node.exe` returned access denied.
- Docker Compose could not be run because Docker CLI was unavailable in this shell.
- GitHub, Docker Hub, Render, Neon, and Vercel publication require the user's account access.

## Submission Checklist

- [ ] GitHub repository link
- [ ] Backend Docker Hub image link
- [ ] Frontend live URL
- [ ] Backend live URL

These final public links require account access for GitHub, Docker Hub, Render, Neon, and Vercel.
