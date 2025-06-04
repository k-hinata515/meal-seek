import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import SearchPage from './pages/SearchPage';
import ResultsPage from './pages/ResultsPage';
import DetailPage from './pages/ShopDetailPage';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/shop/:shopId" element={<DetailPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;