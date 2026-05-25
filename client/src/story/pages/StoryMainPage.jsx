import React from 'react';

import useStoryContext from 'story/hooks/useStoryContext';

export default function StoryMainPage() {
  const { story, isLoading } = useStoryContext();

  if (isLoading) {
    return <div>loading...</div>;
  }

  const summaryParts = story.summary
    ? story.summary
        .split('\n')
        .filter(Boolean)
        .map((text, i) => ({ key: i, text: text }))
    : [];

  return (
    <>
      {summaryParts.length > 0 &&
        summaryParts.map(part => (
          <p key={part.key} className="mb-4">
            {part.text}
          </p>
        ))}
      {story.citationText && (
        <>
          <h2 className="text-lg font-bold mb-2">Citation</h2>
          <p className="mb-4 italic">{story.citationText}</p>
        </>
      )}
    </>
  );
}
