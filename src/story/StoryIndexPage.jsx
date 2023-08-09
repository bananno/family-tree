import React, {useState} from 'react';

import Filter from '../Filter';
import StoryList from './StoryList';
import useStoryList from '../hooks/useStoryList';

function StoryIndexPage() {
  const {stories, isLoading} = useStoryList();
  const [filterWords, setFilterWords] = useState([]);

  const filteredStories = filterWords.length > 0
    ? stories.filter(story => !filterWords.some(word => !word.test(story.title)))
    : stories;

  return (
    <div>
      <h1>stories</h1>
      {isLoading && <p>loading...</p>}
      <Filter onChange={setFilterWords}/>
      <StoryList stories={filteredStories}/>
    </div>
  );
}

export default StoryIndexPage;
