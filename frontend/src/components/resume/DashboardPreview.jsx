import React from 'react';
import TemplateExecutive from './templates/TemplateExecutive';
import TemplateLaTeX from './templates/TemplateLaTeX';
import TemplateModern from './templates/TemplateModern';
import TemplateMinimalist from './templates/TemplateMinimalist';
import TemplateAurora from './templates/TemplateAurora';
import TemplateHyperion from './templates/TemplateHyperion';
import TemplateLunar from './templates/TemplateLunar';

const DashboardPreview = ({ data, template }) => {
  const getTemplate = () => {
    const resumeData = data?.structuredData || data;
    const props = { data: resumeData, showGitHub: !!resumeData?.github };
    switch (template) {
      case 'modern': return <TemplateModern {...props} />;
      case 'latex': return <TemplateLaTeX {...props} />;
      case 'minimalist': return <TemplateMinimalist {...props} />;
      case 'aurora': return <TemplateAurora {...props} />;
      case 'hyperion': return <TemplateHyperion {...props} />;
      case 'lunar': return <TemplateLunar {...props} />;
      case 'executive':
      default: return <TemplateExecutive {...props} />;
    }
  };

  return (
    <div className="w-full h-full overflow-hidden bg-white relative">
      <div 
        className="origin-top-left"
        style={{ 
          width: '800px', // Fixed width to render template consistently
          transform: 'scale(0.28)', // Compact scale for h-72 dashboard cards
          pointerEvents: 'none'
        }}
      >
        {getTemplate()}
      </div>
    </div>
  );
};

export default DashboardPreview;
