// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from './utils/constants';

// Contexts
import { AuthProvider } from './context/AuthContext';
import { ArticlesProvider } from './context/ArticlesContext';
import { MessagingProvider } from './context/MessagingContext';

// Layout
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Browse from './pages/Browse';
import ArticlePage from './pages/ArticlePage';
import SellPage from './pages/SellPage';
// import ProfilePage from './pages/ProfilePage';
// import ArticlePage from './pages/ArticlePage';
// import ProfilePage from './pages/ProfilePage';
// import MessagesPage from './pages/MessagesPage';
// import FavoritesPage from './pages/FavoritesPage';
// import SellPage from './pages/SellPage';
// import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <ArticlesProvider>
        <MessagingProvider>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            
            <main className="flex-1">
              <Routes>
                {/* Routes principales */}
                <Route path={ROUTES.HOME} element={<Home />} />
                <Route path={ROUTES.BROWSE} element={<Browse />} />
                <Route path={ROUTES.ARTICLE} element={<ArticlePage />} />
                <Route path={ROUTES.PROFILE} element={<div className="container mx-auto py-8"><h1>Profile - À venir</h1></div>} />
                <Route path={ROUTES.MY_PROFILE} element={<div className="container mx-auto py-8"><h1>My Profile - À venir</h1></div>} />
                <Route path={ROUTES.MESSAGES} element={<div className="container mx-auto py-8"><h1>Messages - À venir</h1></div>} />
                <Route path={ROUTES.FAVORITES} element={<div className="container mx-auto py-8"><h1>Favorites - À venir</h1></div>} />
                <Route path={ROUTES.SELL} element={<SellPage />} />
                <Route path={ROUTES.LOGIN} element={<Login />} />
                <Route path={ROUTES.SIGNUP} element={<Signup />} />
                <Route path={ROUTES.SETTINGS} element={<div className="container mx-auto py-8"><h1>Settings - À venir</h1></div>} />
                
                {/* 404 */}
                <Route path="*" element={<div className="container mx-auto py-8"><h1>404 - Page non trouvée</h1></div>} />
              </Routes>
            </main>
            
            <Footer />
          </div>
        </MessagingProvider>
      </ArticlesProvider>
    </AuthProvider>
  );
}

export default App;
