import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@shopify/polaris/build/esm/styles.css'
import enTranslations from '@shopify/polaris/locales/en.json'
import { AppProvider } from '@shopify/polaris'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { Home } from './pages/Home'
import { TopBar } from './components/core/TopBar'
import { StrapiProvider } from './context/StrapiContext'
import { Blog } from './pages/Blog'
import { BlogPost } from './pages/BlogPost'
import { ToolboxHome } from './pages/ToolboxHome'
import { ToolPage } from './pages/ToolPage'
import { HelmetProvider } from 'react-helmet-async'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={
        <TopBar>
          <Home />
          <div style={{ height: '64px' }}>&nbsp;</div>
        </TopBar>
      } />
      <Route path="/blog" element={
        <TopBar>
          <Blog />
          <div style={{ height: '64px' }}>&nbsp;</div>
        </TopBar>
      } />
      <Route path="/blog/:handle" element={
        <TopBar>
          <BlogPost />
          <div style={{ height: '64px' }}>&nbsp;</div>
        </TopBar>
      } />
      <Route path="/toolbox" element={
        <TopBar>
          <ToolboxHome />
          <div style={{ height: '64px' }}>&nbsp;</div>
        </TopBar>
      } />
      <Route path="/toolbox/:slug" element={
        <ToolPage />
      } />
    </Routes>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <StrapiProvider>
        <AppProvider i18n={enTranslations}>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AppProvider>
      </StrapiProvider>
    </HelmetProvider>
  </StrictMode>,
)
