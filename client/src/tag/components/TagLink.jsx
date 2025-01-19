import React from 'react';
import { Link } from 'react-router-dom';

export default function TagLink({ tag }) {
  const tagProfileUrl = `/tag/${tag.id}`;
  return <Link to={tagProfileUrl}>{tag.title}</Link>;
}
