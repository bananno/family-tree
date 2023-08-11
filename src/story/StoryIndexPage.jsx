import React, {useState} from 'react';
import {Link, useParams} from 'react-router-dom';

import Filter from '../Filter';
import StoryList from './StoryList';
import useStoryList from '../hooks/useStoryList';

const mainStoryTypes = [
  'book', 'cemetery', 'document', 'index',
  'newspaper', 'website', 'place', 'topic',
];

function StoryIndexPage() {
  const {storyType} = useParams();
  const {stories, isLoading} = useStoryList({storyType});
  const [filterWords, setFilterWords] = useState([]);

  const filteredStories = filterWords.length > 0
    ? stories.filter(story => !filterWords.some(word => !word.test(story.title)))
    : stories;

  return (
    <div>
      <h1>stories</h1>
      {isLoading && <p>loading...</p>}
      <ul>
        <li><Link to="/stories">all</Link></li>
        {mainStoryTypes.map(storyType => (
          <li key={storyType}>
            <Link to={`/stories/${storyType}`}>{storyType}</Link>
          </li>
        ))}
        <li>
          <Link to="/stories-non-entry-sources">stories with non-entry sources</Link>
        </li>
      </ul>
      <Filter onChange={setFilterWords}/>
      <StoryList stories={filteredStories}/>
    </div>
  );
}

export default StoryIndexPage;
