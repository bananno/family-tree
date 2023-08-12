import React, {useState} from 'react';
import {Link, useParams} from 'react-router-dom';

import Filter from '../Filter';
import TagLink from './TagLink';
import TagList from './TagList';
import useTagList from '../hooks/useTagList';
import globalClasses from '../Global.module.scss';
import classes from './TagIndexPage.module.scss';

const TagIndexPage = () => {
  const {showTagsBy} = useParams();
  const {tags} = useTagList();
  const [filterWords, setFilterWords] = useState([]);

  const filteredTags = filterWords.length > 0
    ? tags.filter(tag => !filterWords.some(word => !word.test(tag.title + (tag.definition || ''))))
    : tags;

  return (
    <>
      <h1>tags</h1>
      <Filter onChange={setFilterWords}/>
      <h2>total: {tags.length} tags</h2>
      <h2>show tags by:</h2>
      <ul>
        <li><Link to="/tags">definition</Link></li>
        <li><Link to="/tags/categories">categories</Link></li>
        <li><Link to="/tags/grid">grid</Link></li>
      </ul>
      <TagPageContent tags={filteredTags} showTagsBy={showTagsBy}/>
    </>
  );
};

const TagPageContent = ({tags, showTagsBy}) => {
  if (showTagsBy === 'categories') {
    return <TagIndexPageCategories tags={tags}/>;
  }
  if (showTagsBy === 'grid') {
    return <TagIndexPageGrid tags={tags}/>;
  }
  return <TagIndexPageDefinitions tags={tags}/>;
};

const TagIndexPageCategories = ({tags}) => {
  const categoryMap = {};
  const none = [];
  tags.forEach(tag => {
    if (!tag.category) {
      return none.push(tag);
    }
    tag.category.split(',').forEach(category => {
      if (!categoryMap[category]) {
        categoryMap[category] = [];
      }
      categoryMap[category].push(tag);
    });
  });
  const categoryList = Object.keys(categoryMap).sort();
  return (
    <>
      <hr/>
      {categoryList.map(category => (
        <TagIndexPageSection key={category} title={category} tags={categoryMap[category]}/>
      ))}
      <TagIndexPageSection title="none" tags={none}/>
    </>
  );
};

const TagIndexPageDefinitions = ({tags}) => {
  const defined = tags.filter(tag => tag.definition);
  const notDefined = tags.filter(tag => !tag.definition);
  return (
    <>
      <hr/>
      <TagIndexPageSection title="not defined" tags={notDefined}/>
      <TagIndexPageSection title="defined" tags={defined}/>
    </>
  );
};

const TagIndexPageSection = ({title, tags}) => {
  return (
    <>
      <h2>{title}</h2>
      <TagList tags={tags} showValues={false} showDefinitions={true}/>
    </>
  );
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
            <td>{tag.restrictedToModels.join(', ')}</td>
            <td>{tag.definition}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TagIndexPage;
