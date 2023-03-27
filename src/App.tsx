import './App.css';
import { Routes, Route } from 'react-router-dom';
import Homepage from './pages/homepage';
import NotFoundPage from './pages/notfoundpage';
import About from './pages/about';
import Upload from './pages/upload';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage/>} />
        <Route path="about" element={<About/>} />
        <Route path="dashboard" element={<h1>Dashboard</h1>} />
        <Route path="upload" element={<Upload/>} />
        <Route path="*" element={<NotFoundPage/>} />
      </Routes>
    </>
  );
}

export default App;
