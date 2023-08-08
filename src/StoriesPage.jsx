import React, {useEffect, useState} from 'react';

function StoriesPage() {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    fetch('http://localhost:9000/api/story-index')
      .then((res) => res.json())
      .then((res) => {
        setStories(res.data);
      })
      .catch((err) => {
        console.log('ERROR', err.message);
      });
  }, []);

  return (
    <div>
      <h2>stories</h2>
      <ul>
        {stories.map(story => (
          <li key={story.id}>
            {story.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StoriesPage;

