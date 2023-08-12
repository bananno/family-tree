import React from 'react';
import {Link, useParams} from 'react-router-dom';

import TagLink from './TagLink';
import TagList from './TagList';
import useTagList from '../hooks/useTagList';
import globalClasses from '../Global.module.scss';
import classes from './TagIndexPage.module.scss';

const TagIndexPage = () => {
  const {showTagsBy} = useParams();
  const {tags} = useTagList();

  return (
    <>
      <h1>tags</h1>
      <h2>total: {tags.length} tags</h2>
      <h2>show tags by:</h2>
      <ul>
        <li><Link to="/tags">definition</Link></li>
        <li><Link to="/tags/categories">categories</Link></li>
        <li><Link to="/tags/grid">grid</Link></li>
      </ul>
      <TagPageContent tags={tags} showTagsBy={showTagsBy}/>
    </>
  );
};

const TagPageContent = ({tags, showTagsBy}) => {
  if (showTagsBy === 'categories') {
    return (
      <>
        <hr/>
        <h2>categories...</h2>
      </>
    );
  }
  if (showTagsBy === 'grid') {
    return <TagIndexPageGrid tags={tags}/>
  }
  return (
    <>
      <hr/>
      <ul>
        {tags.map(tag => (
          <li key={tag.id}>
            <TagLink tag={tag}/>
          </li>
        ))}
      </ul>
    </>
  );

  // <TagList tags={tags}/>
};

const TagIndexPageGrid = ({tags}) => {
  return (
    <table className={[globalClasses.Table, classes.TagIndexGrid].join(' ')}>
      <thead>
        <tr>
          <th>title</th>
          <th>usage count</th>
          <th>category</th>
          <th>restricted to</th>
          <th>definition</th>
        </tr>
      </thead>
      <tbody>
        {tags.map(tag => (
          <tr key={tag.id}>
            <td><TagLink tag={tag}/></td>
            <td>{tag.usageCount}</td>
            <td>{tag.category}</td>
            <td></td>
            <td>{tag.definition}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TagIndexPage;
