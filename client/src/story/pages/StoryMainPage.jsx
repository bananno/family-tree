import React from 'react';
import { Link, useParams } from 'react-router-dom';

import PersonList from 'person/components/PersonList';
import BulletList from 'shared/BulletList';
import Checkmark from 'shared/Checkmark';
import DevOnly from 'shared/DevOnly';
import FormatContent from 'shared/FormatContent';
import FormatDate from 'shared/FormatDate';
import FormatLocation from 'shared/FormatLocation';
import LinkList from 'shared/LinkList';
import NewEntrySourceModal from 'source/components/NewEntrySourceModal';
import SourceLink from 'source/components/SourceLink';
import SourceList from 'source/components/SourceList';
import useStoryContext from 'story/hooks/useStoryContext';
import classes from 'story/story.module.scss';
import TagList from 'tag/components/TagList';

export default function StoryMainPage() {
  const { storyId } = useParams();
  const { story, isLoading } = useStoryContext();

  if (isLoading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      should look nice for guests
    </div>
  );
}
