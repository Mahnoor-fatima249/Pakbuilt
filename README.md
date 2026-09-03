# PakBuild Pro

**Pakistan's Smartest Construction Cost Estimator**

A full-stack web application that helps homeowners, contractors, and builders in Pakistan accurately estimate house construction costs, explore modern home designs, and track real-time material prices.

**Live Site:** [https://mahnoor-fatima249.github.io/Pakbuilt](https://mahnoor-fatima249.github.io/Pakbuilt/public/index.html)

---

## Features

### Construction Cost Calculator
- Instant cost estimation based on plot size, location, and finishing level
- Breakdown of grey structure vs finishing costs
- Material quantity calculations (cement, steel, bricks, sand, etc.)
- City-wise rate adjustments (Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad)

### Home Design Gallery
- Browse modern house designs filtered by category and plot size
- Design modal with photo view, floor plan, zoom, and reviews
- Compare multiple designs side-by-side
- Save favorite designs
- Similar design suggestions

### User Reviews & Ratings
- Read and write reviews with star ratings
- Reviews saved in localStorage for persistence
- Average rating and total review count

### Blog & Construction Tips
- Expert articles on construction costs, materials, and design trends
- Full-text blog post modal
- Categories: Cost Guide, Materials, Tips, Design

### Price Alerts & Notifications
- Real-time material price tracking (cement, steel, bricks, sand, etc.)
- Price change indicators (up/down/stable)
- Email subscription for price alerts
- Floating notification panel

### Export & Share
- Download PDF cost estimate report
- Share estimate via WhatsApp

### Contractor Inquiry
- Submit project inquiries with details
- Booking system with confirmation modal

### Multi-language Support
- English and Urdu (اردو) language toggle

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, Tailwind CSS, Alpine.js, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT (JSON Web Tokens), bcryptjs |
| Deployment | Vercel (frontend), GitHub Pages |

---

## Project Structure

```
Pakbuilt/
├── public/
│   ├── index.html          # Main frontend (deployed to GitHub Pages)
│   └── pages/
│       ├── login.html
│       ├── signup.html
│       ├── dashboard.html
│       ├── forgot-password.html
│       └── admin.html
├── backend/
│   ├── server.js           # Express server
│   ├── models/
│   │   ├── User.js
│   │   ├── Booking.js
│   │   ├── Inquiry.js
│   │   └── MaterialRate.js
│   └── routes/
│       ├── auth.js
│       ├── booking.js
│       ├── inquiry.js
│       ├── material.js
│       └── admin.js
├── index.html              # Development version
├── package.json
├── vercel.json
└── .env.example
```

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB)

### Installation

1. Clone the repository
```bash
git clone https://github.com/Mahnoor-fatima249/Pakbuilt.git
cd Pakbuilt
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

4. Start the backend server
```bash
node backend/server.js
```

5. Open `public/index.html` in your browser

---

## Environment Variables

| Variable | Description |
|----------|------------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT token signing |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/profile` | Get user profile |
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings` | Get user bookings |
| POST | `/api/inquiries` | Submit inquiry |
| GET | `/api/materials` | Get material rates |

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## Author

**Mahnoor Fatima** - [GitHub](https://github.com/Mahnoor-fatima249)

---

## License

This project is open source and available under the [MIT License](LICENSE).
