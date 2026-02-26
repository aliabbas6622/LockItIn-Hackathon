import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Questions from './pages/Questions';
import Invite from './pages/Invite';
import Respond from './pages/Respond';
import Report from './pages/Report';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/decision/:id/questions" element={<Questions />} />
        <Route path="/decision/:id/invite" element={<Invite />} />
        <Route path="/decision/:id/respond" element={<Respond />} />
        <Route path="/decision/:id/report" element={<Report />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}
