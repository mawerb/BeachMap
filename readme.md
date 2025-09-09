# BeachMap.org 🦈

A full-stack web application for discovering and mapping events and landmarks in California State University, Long Beach. Built with React and Django to provide an interactive mapping experience.

## 🌊 Features

- **Interactive Map**: Browse events and landmarks on a dynamic, user-friendly map interface built with leaflet
- **Event Discovery**: Find upcoming club meetings, workshops, and fundraisers
- **Landmark Database**: Explore notable CSULB locations, facilities, and points of interest  
- **Admin Panel**: Secure JWT-authenticated administration system for content management
- **Real-time Updates**: Dynamic content updates through RESTful API integration
- **Responsive Design**: Optimized for desktop and mobile devices

## 🛠️ Tech Stack

**Frontend:**
- React.js
- Leaflet.js

**Backend:**  
- Django REST Framework
- JWT Authentication
- RESTful API architecture

**Database:**
- PostgreSQL

## Live Demo

Visit the live application: [https://beachmap.org](https://beachmap.org)

## How to run locally.

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- pip
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/beachmap.git
   cd beachmap
   ```

2. **Set up the backend**
   ```bash
   cd backend
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py createsuperuser
   python manage.py runserver
   ```

3. **Set up the frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Visit the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - Admin Panel: http://localhost:8000/admin/login

## Usage

### For Visitors
- Browse the interactive map to discover events and landmarks on campus
- Click on map markers to view detailed information

### For Administrators  
- Access the admin panel with your credentials
- Add, edit, or remove landmarks

## 🔧 API Endpoints

```
GET   /api/options/                   # List all landmarks (admin)
PUT   /api/update_nodes/              # Create/update Landmarks (admin)
POST  /api/upload_image/              # Create/update Landmark Image (admin)
GET   /api/get_image/{id}/            # Get image of specific landmark (admin)
GET   /api/get_nodes_with_events/     # Show all landmarks with events (admin)
GET   /api/get_events/                # List all events for a landmark (admin)

POST  /api/auth/login/                # Admin authentication
GET   /api/auth/verify/               # Verify admin authentication 
```

## 🌐 Deployment

The application is deployed and accessible at https://beachmap.org

### Environment Variables
```
DJANGO_SECRET_KEY=your_secret_key
DATABASE_URL=your_database_url
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

- Website: [https://beachmap.org](https://beachmap.org)
- Email: maorbarzilay8@gmail.com

---

Built with ❤️ for CSULB