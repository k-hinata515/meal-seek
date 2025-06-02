import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import SearchPage from './pages/SearchPage';
import ResultsPage from './pages/ResultsPage';
function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;