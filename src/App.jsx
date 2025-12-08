// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from './utils/constants';

// Contexts (à créer)
// import { AuthProvider } from './context/AuthContext';
// import { ArticlesProvider } from './context/ArticlesContext';
// import { MessagingProvider } from './context/MessagingContext';

// Layout (à créer)
// import Header from './components/layout/Header';
// import Footer from './components/layout/Footer';

// Pages (à créer)
// import Home from './pages/Home';
// import Browse from './pages/Browse';
// import ArticlePage from './pages/ArticlePage';
// import ProfilePage from './pages/ProfilePage';
// import MessagesPage from './pages/MessagesPage';
// import FavoritesPage from './pages/FavoritesPage';
// import SellPage from './pages/SellPage';
// import NotFound from './pages/NotFound';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header sera ajouté ici */}
      {/* <Header /> */}
      
      <main className="flex-1">
        <Routes>
          {/* Routes principales */}
          <Route path={ROUTES.HOME} element={<div className="container mx-auto py-8"><h1>Home - À venir</h1></div>} />
          <Route path={ROUTES.BROWSE} element={<div className="container mx-auto py-8"><h1>Browse - À venir</h1></div>} />
          <Route path={ROUTES.ARTICLE} element={<div className="container mx-auto py-8"><h1>Article Detail - À venir</h1></div>} />
          <Route path={ROUTES.PROFILE} element={<div className="container mx-auto py-8"><h1>Profile - À venir</h1></div>} />
          <Route path={ROUTES.MY_PROFILE} element={<div className="container mx-auto py-8"><h1>My Profile - À venir</h1></div>} />
          <Route path={ROUTES.MESSAGES} element={<div className="container mx-auto py-8"><h1>Messages - À venir</h1></div>} />
          <Route path={ROUTES.FAVORITES} element={<div className="container mx-auto py-8"><h1>Favorites - À venir</h1></div>} />
          <Route path={ROUTES.SELL} element={<div className="container mx-auto py-8"><h1>Sell - À venir</h1></div>} />
          <Route path={ROUTES.LOGIN} element={<div className="container mx-auto py-8"><h1>Login - À venir</h1></div>} />
          <Route path={ROUTES.SIGNUP} element={<div className="container mx-auto py-8"><h1>Signup - À venir</h1></div>} />
          <Route path={ROUTES.SETTINGS} element={<div className="container mx-auto py-8"><h1>Settings - À venir</h1></div>} />
          
          {/* 404 */}
          <Route path="*" element={<div className="container mx-auto py-8"><h1>404 - Page non trouvée</h1></div>} />
        </Routes>
      </main>
      
      {/* Footer sera ajouté ici */}
      {/* <Footer /> */}
    </div>
  );
}

export default App;
