# Nahupay Admin Dashboard

This is the admin dashboard for Nahupay, built with Next.js, TypeScript, Tailwind CSS, and Radix UI. It provides business management features, subaccount handling, and more.

## Features

- Business management (add, edit, delete businesses)
- Subaccount management
- Dashboard analytics
- Responsive UI with Tailwind CSS
- Custom dialogs, forms, charts, and tables
- Context-based state management
- Toast notifications

## Project Structure

```
app/                # Next.js app directory (pages, layouts)
components/         # Reusable UI and feature components
context/            # React context providers
hooks/              # Custom React hooks
lib/                # Utilities and API logic
public/             # Static assets
styles/             # Global styles
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- pnpm (or npm/yarn)

### Installation

```sh
pnpm install
```

### Development

```sh
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### Build

```sh
pnpm build
```

### Lint

```sh
pnpm lint
```

## Configuration

- Environment variables can be set in `.env.local`
- Tailwind config: [`tailwind.config.ts`](tailwind.config.ts)
- Next.js config: [`next.config.mjs`](next.config.mjs)

## License

MIT

---

For more details, see the source code
