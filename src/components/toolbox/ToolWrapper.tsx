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
      <style>{`
        .tool-top-bar {
          height: 32px;
          background-color: #000;
          color: #fff;
          display: flex;
          align-items: center;
          padding: 0 10px;
          font-size: 11px;
          font-family: monospace;
          border-bottom: 1px solid #333;
          z-index: 1000;
          user-select: none;
        }
        .tool-subtitle {
          display: inline;
          color: #666;
        }
        @media (max-width: 600px) {
          .tool-top-bar {
            height: 44px;
            font-size: 10px;
            padding: 0 8px;
          }
          .tool-subtitle {
            display: none;
          }
          .tool-nav-links {
            gap: 10px !important;
          }
        }
      `}</style>
      <div className="tool-top-bar">
        <div className="tool-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '20px', minWidth: 0 }}>
          <Link to="/toolbox" style={{ color: '#aaa', textDecoration: 'none', fontWeight: 'bold', flexShrink: 0 }}>
            TOOLBOX
          </Link>

          <div style={{ position: 'relative', minWidth: 0 }}>
            <span
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {currentTool ? currentTool.title.toUpperCase() : 'SELECT TOOL'} ▾
            </span>

            {menuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  backgroundColor: '#000',
                  border: '1px solid #333',
                  minWidth: '200px',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
                  marginTop: '1px'
                }}
              >
                {allTools.map((tool) => (
                  <div
                    key={tool.slug}
                    onClick={() => handleToolChange(tool.slug)}
                    style={{
                      padding: '10px 12px',
                      cursor: 'pointer',
                      borderBottom: '1px solid #111',
                      color: tool.slug === currentTool?.slug ? '#fff' : '#aaa',
                      backgroundColor: tool.slug === currentTool?.slug ? '#222' : 'transparent',
                      fontSize: '11px'
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

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '15px', alignItems: 'center', flexShrink: 0 }}>
          {currentTool?.subtitle && (
            <span className="tool-subtitle">{currentTool.subtitle.toUpperCase()}</span>
          )}
          <Link to="/" style={{ color: '#aaa', textDecoration: 'none', padding: '5px' }}>EXIT</Link>
        </div>
      </div>

      {/* Main Content (Iframe container) */}
      <div style={{ flex: 1, position: 'relative', backgroundColor: currentTool?.color || '#fff' }}>
        {children}
      </div>
    </div>
  );
};
