# Nepal eGovernance Polling System

This project is a polling system designed for the Government of Nepal, built using Next.js, TypeScript, MySQL, and ShadCN. It allows users to participate in polls and provides an admin interface for managing polls and viewing statistics.

## Features

- User authentication using NextAuth
- Dashboard for users to view their polls
- Poll creation and management for administrators
- Responsive UI components built with ShadCN
- MySQL database for storing poll data

## Tech Stack

- **Frontend**: Next.js, TypeScript, ShadCN
- **Backend**: Next.js API routes
- **Database**: MySQL
- **Authentication**: NextAuth

## Project Structure

```
nepal-egovernance-polling
├── src
│   ├── app
│   │   ├── api
│   │   │   └── auth
│   │   │       └── [...nextauth]
│   │   │           └── route.ts
│   │   ├── dashboard
│   │   │   └── page.tsx
│   │   ├── polls
│   │   │   ├── [id]
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── admin
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components
│   │   ├── ui
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── form.tsx
│   │   ├── auth
│   │   │   └── login-form.tsx
│   │   ├── polls
│   │   │   ├── poll-card.tsx
│   │   │   └── poll-form.tsx
│   │   └── layout
│   │       ├── header.tsx
│   │       ├── footer.tsx
│   │       └── sidebar.tsx
│   ├── lib
│   │   ├── db.ts
│   │   └── utils.ts
│   ├── types
│   │   └── index.ts
│   └── config
│       └── site.ts
├── public
│   └── assets
├── prisma
│   └── schema.prisma
├── .env
├── .env.example
├── next.config.js
├── package.json
├── tsconfig.json
└── README.md
```

## Setup Instructions

1. Clone the repository:
   ```
   git clone https://github.com/your-repo/nepal-egovernance-polling.git
   cd nepal-egovernance-polling
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure the environment variables:
   - Copy `.env.example` to `.env` and update the values as needed.

4. Set up the database:
   - Create a MySQL database and update the connection string in the `.env` file.

5. Run the development server:
   ```
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:3000` to view the application.

## Usage

- Users can log in and participate in polls.
- Administrators can manage polls and view statistics through the admin interface.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.