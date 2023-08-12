import React from 'react';
import {Link} from 'react-router-dom';

function TagLink({tag}) {
  const tagProfileUrl = `/tag/${tag.id}`;
  return (
    <Link to={tagProfileUrl}>{tag.title}</Link>
  );
}

export default TagLink;
