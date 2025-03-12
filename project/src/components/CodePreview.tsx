import React from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

SyntaxHighlighter.registerLanguage('jsx', jsx);

interface CodePreviewProps {
  code: string;
  showLineNumbers?: boolean;
}

export const CodePreview: React.FC<CodePreviewProps> = ({ code, showLineNumbers = true }) => {
  return (
    <SyntaxHighlighter
      language="jsx"
      style={atomDark}
      showLineNumbers={showLineNumbers}
      customStyle={{
        margin: 0,
        borderRadius: '0.5rem',
        fontSize: '0.875rem',
      }}
    >
      {code}
    </SyntaxHighlighter>
  );
};