# Taekwondo Pengcab Bogor Website

A comprehensive website and content management system for the Taekwondo Regional Management (Pengcab) of Bogor. This application provides information about the organization, events, training units, and members, with a fully-featured admin panel for content management.

## Features

### Public Website
- Home page with organization information and upcoming events
- About Us, Vision & Mission pages
- Organization structure and management
- Events and activities calendar
- Training units information
- Taekwondoin (practitioners) database
- Contact information with contact form

### Admin Panel
- Secure authentication system
- Dashboard with statistics and quick actions
- Content management for pages (About, Vision & Mission)
- Organization structure management
- Events and activities management
- Training units management
- Members (Taekwondoin) management
- Contact message management
- User management and settings

## Technology Stack

- **Backend**: Node.js, Express.js
- **Frontend**: EJS templates, Bootstrap 5, jQuery
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **File uploads**: Multer
- **Deployment**: Docker, Docker Compose

## Project Structure

```
taekwondo-pengcab-bogor/
├── config/               # Configuration files
├── controllers/          # Application controllers
├── db/                   # Database migration and seed files
├── middlewares/          # Custom middlewares
├── models/               # Sequelize models
├── public/               # Static files (CSS, JS, images)
├── routes/               # Route definitions
├── uploads/              # Uploaded files
└── views/                # EJS templates
    ├── admin/            # Admin panel views
    ├── pages/            # Public website pages
    └── partials/         # Reusable view components
```

## Installation

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/taekwondo-pengcab-bogor.git
cd taekwondo-pengcab-bogor
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taekwondo_db
DB_USER=postgres
DB_PASS=your_password
SESSION_SECRET=your_session_secret
JWT_SECRET=your_jwt_secret
```

4. Initialize the database and run migrations:
```bash
npm run db:init
npm run db:migrate
npm run db:seed
```

5. Start the development server:
```bash
npm run dev
```

### Docker Deployment

1. Make sure Docker and Docker Compose are installed on your server

2. Clone the repository and navigate to the project directory

3. Build and start the containers:
```bash
npm run docker:build
npm run docker:up
```

4. Access the application at http://your-server-ip:3000

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

## Database Models

- **Admin**: Admin users for the CMS
- **Content**: Static page content
- **Organization**: Organization structure
- **Event**: Events and activities
- **Unit**: Training units/clubs
- **Member**: Taekwondo practitioners
- **Contact**: Contact form submissions

## API Endpoints

### Authentication
- POST `/admin/login`: Admin login
- GET `/admin/logout`: Admin logout

### Content Management
- GET/POST `/admin/about`: About page management
- GET/POST `/admin/vision-mission`: Vision & Mission management

### Organization Management
- GET/POST `/admin/organization`: Organization structure management

### Events Management
- GET `/admin/events`: Events list
- GET/POST `/admin/events/create`: Create event
- GET/POST `/admin/events/edit/:id`: Edit event
- DELETE `/admin/events/:id`: Delete event

### Units Management
- GET `/admin/units`: Units list
- GET/POST `/admin/units/create`: Create unit
- GET/POST `/admin/units/edit/:id`: Edit unit
- DELETE `/admin/units/:id`: Delete unit

### Members Management
- GET `/admin/members`: Members list
- GET/POST `/admin/members/create`: Create member
- GET/POST `/admin/members/edit/:id`: Edit member
- DELETE `/admin/members/:id`: Delete member

### Contact Messages Management
- GET `/admin/contacts`: Contact messages list
- GET `/admin/contacts/:id`: View contact message details
- POST `/admin/contacts/:id/status`: Update message status
- DELETE `/admin/contacts/:id`: Delete message

### Public API
- POST `/api/contact/submit`: Submit contact form

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributors

- Your Name - Initial work

## Acknowledgments

- Pengcab Taekwondo Bogor for the collaboration 