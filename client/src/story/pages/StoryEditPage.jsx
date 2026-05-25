import StoryForm from 'story/components/StoryForm';
import useStoryContext from 'story/hooks/useStoryContext';

export default function StoryEditPage() {
  const { story, refetch } = useStoryContext();

  return <StoryForm story={story} afterSave={refetch} />;
}
