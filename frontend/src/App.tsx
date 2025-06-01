import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import SearchPage from './pages/SearchInputPage';
function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<SearchPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;