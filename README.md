# DigiPlot Classic - Property Management System

A comprehensive multi-tenant web-based property management platform that enables landlords to efficiently manage their properties, tenants, payments (via M-Pesa), and maintenance requests while providing tenants with a dedicated portal for payments and service requests.

## 🏢 Overview

The Property Management System (PMS) is designed as a multi-tenant platform where each landlord operates independently with unique credentials and isolated data. The system facilitates seamless property management workflows including tenant onboarding, rent collection via M-Pesa integration, maintenance request handling, and comprehensive reporting.

## 👥 User Roles

### System Administrator

- Full system control and monitoring
- Manage landlord accounts activation/deactivation
- View system-wide analytics and audit trails

### Landlord

- Property and unit management
- Tenant registration and assignment
- Payment tracking and receipt generation
- Maintenance request management
- Financial reporting and analytics
- M-Pesa integration configuration

### Tenant

- Secure portal access after landlord registration
- Profile and contact information management
- Unit details and lease information viewing
- M-Pesa payment processing
- Maintenance request submission and tracking
- Payment history and receipt downloads

## ✨ Key Features

### 🔐 Authentication & Security

- JWT-based authentication system
- Role-based access control (RBAC)
- Secure password management with auto-generated defaults
- Email verification and password reset functionality
- Account status management (Active/Suspended/Deactivated)

### 🏠 Property Management

- Multi-property portfolio management
- Detailed unit specifications (bedrooms, bathrooms, size, amenities)
- Unit availability and occupancy tracking
- Property image and document management
- Rental pricing and lease term configuration

### 👤 Tenant Management

- Streamlined tenant onboarding process
- Automated credential distribution via email
- Comprehensive tenant profiles with contact information
- Lease agreement tracking and renewal reminders
- Tenant assignment and reassignment capabilities

### 💰 Payment Processing

- Integrated M-Pesa Daraja API v2 (STK Push)
- Real-time payment confirmation and processing
- Automatic receipt generation and distribution
- Payment history tracking and analytics
- Multiple payment method support (M-Pesa, Card)

### 🔧 Maintenance Management

- Digital maintenance request submission
- Photo attachment support for issue documentation
- Request categorization (Plumbing, Electrical, HVAC, etc.)
- Priority level assignment (Low, Medium, High, Emergency)
- Status tracking (Pending, In Progress, Resolved)
- Landlord response and communication system

### 📊 Reporting & Analytics

- Financial performance dashboards
- Occupancy rate tracking and trends
- Maintenance request analytics
- Revenue growth analysis
- Exportable reports (PDF, Excel)

### 📧 Communication System

- Automated email notifications
- Payment confirmation alerts
- Maintenance status updates
- Tenant account creation notifications
- Receipt delivery via email

## 🛠 Technology Stack

### Frontend

- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS with custom design system
- **Routing**: React Router DOM
- **Icons**: Tabler Icons (react-icons/tb)
- **State Management**: React Context API
- **Authentication**: JWT tokens with localStorage persistence

### Backend (Planned)

- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT with bcrypt password hashing
- **Payment Integration**: M-Pesa Daraja API v2
- **File Storage**: AWS S3 for documents and receipts

### Development Tools

- **Build Tool**: Vite
- **CSS Framework**: Tailwind CSS with PostCSS
- **Linting**: ESLint
- **Code Formatting**: Prettier (recommended)
- **Version Control**: Git with GitHub

## 📱 Current Implementation Status

### ✅ Completed Features

- **Frontend Architecture**: Complete React application with routing
- **Authentication System**: Login, logout, and protected routes
- **Tenant Interface**:
  - Dashboard with stats and quick actions
  - Unit information and amenities display
  - Payment processing with M-Pesa and card options
  - Payment history and receipt generation
  - Maintenance request submission and tracking
  - Profile management with notification preferences
- **Landlord Interface**:
  - Comprehensive dashboard with analytics
  - Property and unit management
  - Tenant directory and management
  - Payment tracking and financial reporting
  - Maintenance request handling
  - Settings and configuration panels
- **Demo Data**: Comprehensive demo data following database schema
- **Responsive Design**: Mobile-first approach with full responsiveness
- **Custom Theme**: Professional design with primary color #01818d

### 🚧 In Development

- Backend API development
- Database schema implementation
- M-Pesa integration
- Email notification system
- File upload and storage

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/digiplotClassic.git
   cd digiplotClassic/digiplot
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Access the application**
   - Open your browser and navigate to `http://localhost:5173`
   - Use demo credentials:
     - **Tenant**: `tenant@example.com` / `password`
     - **Landlord**: `landlord@example.com` / `password`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Design System

### Color Palette

- **Primary**: #01818d (Teal)
- **Secondary**: #64748B (Slate)
- **Success**: #16A34A (Green)
- **Warning**: #EAB308 (Yellow)
- **Danger**: #DC2626 (Red)

### Typography

- **Primary Font**: Lexend (Google Fonts)
- **Secondary Font**: Outfit (Google Fonts)

### Components

- Custom button and input implementations per page
- Consistent spacing and sizing using Tailwind utilities
- Professional animations and transitions
- Mobile-responsive layouts

## 📋 Database Schema

The system uses a PostgreSQL database with the following main entities:

- **Users**: Base user information and authentication
- **Landlords**: Landlord-specific data and M-Pesa credentials
- **Tenants**: Tenant profiles and lease information
- **Properties**: Property details and specifications
- **Units**: Individual rental units within properties
- **Payments**: Payment transactions and M-Pesa records
- **Maintenance Requests**: Service requests and status tracking

_Detailed schema documentation available in `DbSchema.md`_

## 🔒 Security Features

- **Authentication**: JWT-based with secure token management
- **Authorization**: Role-based access control (RBAC)
- **Data Isolation**: Multi-tenant architecture with landlord-specific data
- **Input Validation**: Frontend and backend validation
- **Credential Security**: Encrypted M-Pesa API credentials
- **Audit Logging**: Activity tracking for compliance

## 🌐 Deployment

### Frontend Deployment (Vercel - Recommended)

1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Root Directory: `digiplot`
3. Deploy automatically on every push to main branch

### Backend Deployment (Planned)

- AWS Lightsail or VPS with Docker
- Nginx reverse proxy with SSL/TLS
- PostgreSQL database hosting
- Environment variable configuration

## 📚 Documentation

- [Product Requirements Document](../PropertyMgtPRD.md)
- [Database Schema](../DbSchema.md)
- [Implementation Guide](../IMPLEMENTATION_GUIDE.md)
- API Documentation (Coming soon)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the established component structure
- Use Tailwind CSS for styling
- Implement responsive design for all components
- Add proper error handling and loading states
- Write meaningful commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:

- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation for common solutions

## 🗺 Roadmap

### Phase 1 (Current)

- ✅ Frontend application with full UI/UX
- ✅ Demo data and authentication system
- 🚧 Backend API development

### Phase 2 (Next)

- M-Pesa payment integration
- Email notification system
- File upload and document management
- Production deployment

### Phase 3 (Future)

- Mobile application (React Native)
- SMS notifications
- Advanced analytics and reporting
- Multi-currency support
- Lease agreement management

---

**Built with ❤️ for efficient property management**
