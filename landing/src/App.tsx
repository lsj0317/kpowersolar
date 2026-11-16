import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { ScrollManager } from '@/components/ScrollManager';
import { Header } from '@/sections/Header';
import { Footer } from '@/sections/Footer';
import { StickyCta } from '@/sections/StickyCta';
import { LandingPage } from '@/pages/LandingPage';
import { ServiceDetailPage } from '@/pages/ServiceDetailPage';

function Layout() {
  return (
    <>
      <a className="skip-link" href="#main">
        본문 바로가기
      </a>
      <ScrollManager />
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <StickyCta />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="service/:slug" element={<ServiceDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
