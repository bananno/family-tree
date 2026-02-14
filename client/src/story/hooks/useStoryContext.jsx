import { useContext } from 'react';

import { StoryContext } from '../layout/StoryContext';

export default function useStoryContext() {
  return useContext(StoryContext);
}
