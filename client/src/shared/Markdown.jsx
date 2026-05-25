import ReactMarkdown from 'react-markdown';

export default function Markdown({ children }) {
  return (
    <div className="markdown">
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
}
