import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@shopify/polaris/build/esm/styles.css'
import enTranslations from '@shopify/polaris/locales/en.json'
import { AppProvider } from '@shopify/polaris'
import { BrowserRouter, Routes, Route } from 'react-router'
import { Home } from './pages/Home'
import { TopBar } from './components/core/TopBar'
import { StrapiProvider } from './context/StrapiContext'
import { Blog } from './pages/Blog'
import { BlogPost } from './pages/BlogPost'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StrapiProvider>
      <AppProvider i18n={enTranslations}>
        <TopBar>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:handle" element={<BlogPost />} />
            </Routes>
          </BrowserRouter>
          <div
            style={{
              height: '64px'
            }}
          >&nbsp;</div>
        </TopBar>
      </AppProvider>
    </StrapiProvider>
  </StrictMode>,
)
