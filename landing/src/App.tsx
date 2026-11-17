import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { ScrollManager } from '@/components/ScrollManager';
import { Header } from '@/sections/Header';
import { Footer } from '@/sections/Footer';
import { StickyCta } from '@/sections/StickyCta';
import { LandingPage } from '@/pages/LandingPage';
import { ServiceDetailPage } from '@/pages/ServiceDetailPage';

/** 관리자 페이지는 따로 불러옴 (일반 방문자는 내려받지 않음) */
const AdminApp = lazy(() => import('@/admin/AdminApp'));

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
        <Route
          path="admin/*"
          element={
            <Suspense fallback={<p style={{ padding: 24 }}>불러오는 중…</p>}>
              <AdminApp />
            </Suspense>
          }
        />
        <Route element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="service/:slug" element={<ServiceDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
