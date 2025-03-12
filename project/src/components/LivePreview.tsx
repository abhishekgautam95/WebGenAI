import React from 'react';

interface LivePreviewProps {
  code: string;
}

export const LivePreview: React.FC<LivePreviewProps> = ({ code }) => {
  const sanitizedCode = code.replace(/<script>/g, '').replace(/<\/script>/g, '');
  
  return (
    <div className="w-full h-full min-h-[400px] bg-white rounded-lg shadow-lg overflow-hidden">
      <iframe
        srcDoc={`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body>
              ${sanitizedCode}
            </body>
          </html>
        `}
        className="w-full h-full border-0"
        title="Live Preview"
        sandbox="allow-scripts"
      />
    </div>
  );
};