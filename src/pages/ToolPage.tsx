import React from 'react';
import { useParams } from 'react-router';
import { useToolboxItems } from '../hooks/useToolboxItems';
import { ToolWrapper } from '../components/toolbox/ToolWrapper';
import { SEO } from '../components/SEO';

export const ToolPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { items, isLoading, error } = useToolboxItems();

  const currentTool = items.find((item) => item.slug === slug);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#000', color: '#fff' }}>
        LOADING TOOL...
      </div>
    );
  }

  if (error || !currentTool) {
    return (
      <div style={{ padding: '20px', backgroundColor: '#000', color: '#fff', height: '100vh' }}>
        <h2>Error: {error ? error.message : 'Tool not found'}</h2>
        <a href="/toolbox" style={{ color: '#aaa' }}>Return to Toolbox</a>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={currentTool.title}
        description={currentTool.subtitle || `View ${currentTool.title} in the toolbox.`}
        type="website"
      />
      <ToolWrapper currentTool={currentTool} allTools={items}>
        <iframe
          src={`/${currentTool.htmlPath}`}
          title={currentTool.title}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block'
          }}
        />
      </ToolWrapper>
    </>
  );
};
