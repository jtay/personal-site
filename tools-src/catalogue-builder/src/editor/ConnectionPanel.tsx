import { useEffect, useRef, useState } from 'react';
import { useCatalogueStore } from '../state/store';
import { fetchAllCollections, verifyConnection, ShopifyStorefrontError } from '../shopify/client';
import { loadDefaultConnection, saveDefaultConnection, clearDefaultConnection } from '../persistence/connectionStorage';
import type { ShopConnection } from '../domain/project';
import { input, buttonPrimary } from './panelStyles';

export const ConnectionPanel: React.FC = () => {
  const connection = useCatalogueStore((s) => s.project.connection);
  const isConnecting = useCatalogueStore((s) => s.isConnecting);
  const connectionError = useCatalogueStore((s) => s.connectionError);
  const setConnection = useCatalogueStore((s) => s.setConnection);
  const setConnectionStatus = useCatalogueStore((s) => s.setConnectionStatus);
  const setCollections = useCatalogueStore((s) => s.setCollections);

  const [shopDomain, setShopDomain] = useState('');
  const [token, setToken] = useState('');
  const [rememberDefault, setRememberDefault] = useState(true);
  const [hasSavedDefault, setHasSavedDefault] = useState(false);
  const autoConnectAttempted = useRef(false);

  const connect = async (candidate: ShopConnection, remember: boolean) => {
    setConnectionStatus(true, null);
    try {
      await verifyConnection(candidate);
      const collections = await fetchAllCollections(candidate);
      setConnection(candidate);
      setCollections(collections);
      setConnectionStatus(false, null);
      if (remember) {
        saveDefaultConnection(candidate);
        setHasSavedDefault(true);
      } else {
        clearDefaultConnection();
        setHasSavedDefault(false);
      }
    } catch (err) {
      const message = err instanceof ShopifyStorefrontError ? err.message : 'Could not connect to that store.';
      setConnectionStatus(false, message);
    }
  };

  useEffect(() => {
    const saved = loadDefaultConnection();
    if (!saved) return;
    setShopDomain(saved.shopDomain);
    setToken(saved.storefrontAccessToken);
    setHasSavedDefault(true);
    if (!autoConnectAttempted.current) {
      autoConnectAttempted.current = true;
      connect(saved, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleForget = () => {
    clearDefaultConnection();
    setHasSavedDefault(false);
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <input
          style={input}
          placeholder="my-shop.myshopify.com"
          value={shopDomain}
          onChange={(e) => setShopDomain(e.target.value)}
        />
        <input
          style={input}
          placeholder="Storefront access token"
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--cb-color-muted)' }}>
          <input type="checkbox" checked={rememberDefault} onChange={(e) => setRememberDefault(e.target.checked)} />
          Remember as default (this browser)
        </label>
        <button
          style={buttonPrimary}
          disabled={isConnecting || !shopDomain || !token}
          onClick={() => connect({ shopDomain, storefrontAccessToken: token }, rememberDefault)}
        >
          {isConnecting ? 'Connecting…' : connection ? 'Reconnect' : 'Connect'}
        </button>
        {connectionError && <div style={{ color: '#dc2626', fontSize: 12 }}>{connectionError}</div>}
        {connection && !connectionError && (
          <div style={{ color: '#16a34a', fontSize: 12 }}>Connected to {connection.shopDomain}</div>
        )}
        {hasSavedDefault && (
          <button
            style={{ background: 'none', border: 'none', color: 'var(--cb-color-muted)', fontSize: 11, textAlign: 'left', padding: 0, cursor: 'pointer' }}
            onClick={handleForget}
          >
            Forget saved connection
          </button>
        )}
      </div>
    </>
  );
};
