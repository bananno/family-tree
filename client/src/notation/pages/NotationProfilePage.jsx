import React from 'react';
import { useParams } from 'react-router-dom';

import useNotationProfile from 'notation/hooks/useNotationProfile';
import PersonList from 'person/components/PersonList';
import StoryList from 'story/components/StoryList';
import TagList from 'tag/components/TagList';

export default function NotationProfilePage() {
  const { notationId } = useParams();
  const { notation, isLoading } = useNotationProfile({ notationId });

  if (isLoading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <h2>notation:</h2>
      <h2>{notation.title || '(no title)'}</h2>
      <hr />
      <h2>sharing</h2>
      <p>{String(notation.sharing)}</p>
      <h2>pinned to stories</h2>
      <StoryList stories={notation.stories} />
      <h2>people</h2>
      <PersonList people={notation.people} />
      <h2>tags</h2>
      <TagList tags={notation.tags} />
      <h2>text</h2>
      <p>{notation.text}</p>
    </div>
  );
}
