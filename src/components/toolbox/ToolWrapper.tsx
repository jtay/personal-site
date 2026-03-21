import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import type { ToolboxItem } from '../../types/toolbox';

interface ToolWrapperProps {
  children: React.ReactNode;
  currentTool?: ToolboxItem;
  allTools: ToolboxItem[];
}

export const ToolWrapper: React.FC<ToolWrapperProps> = ({ children, currentTool, allTools }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleToolChange = (slug: string) => {
    navigate(`/toolbox/${slug}`);
    setMenuOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Mr Doob Style Top Bar */}
      <div
        style={{
          height: '32px',
          backgroundColor: '#000',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          padding: '0 10px',
          fontSize: '12px',
          fontFamily: 'monospace',
          borderBottom: '1px solid #333',
          zIndex: 1000,
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link to="/toolbox" style={{ color: '#aaa', textDecoration: 'none', fontWeight: 'bold' }}>
            TOOLBOX
          </Link>
          
          <div style={{ position: 'relative' }}>
            <span 
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              {currentTool ? currentTool.title.toUpperCase() : 'SELECT TOOL'} ▾
            </span>
            
            {menuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '24px',
                  left: 0,
                  backgroundColor: '#000',
                  border: '1px solid #333',
                  minWidth: '200px',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
                }}
              >
                {allTools.map((tool) => (
                  <div
                    key={tool.id}
                    onClick={() => handleToolChange(tool.slug)}
                    style={{
                      padding: '8px 12px',
                      cursor: 'pointer',
                      borderBottom: '1px solid #111',
                      color: tool.slug === currentTool?.slug ? '#fff' : '#aaa',
                      backgroundColor: tool.slug === currentTool?.slug ? '#222' : 'transparent'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#222')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = tool.slug === currentTool?.slug ? '#222' : 'transparent')}
                  >
                    {tool.title.toUpperCase()}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '15px' }}>
           {currentTool?.subtitle && (
             <span style={{ color: '#666' }}>{currentTool.subtitle.toUpperCase()}</span>
           )}
           <Link to="/" style={{ color: '#aaa', textDecoration: 'none' }}>EXIT</Link>
        </div>
      </div>

      {/* Main Content (Iframe container) */}
      <div style={{ flex: 1, position: 'relative', backgroundColor: currentTool?.color || '#fff' }}>
        {children}
      </div>
    </div>
  );
};
