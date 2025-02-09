import React from 'react';
import { Link, useParams } from 'react-router-dom';

import BulletList from 'shared/BulletList';
import Filter from 'shared/Filter';
import globalClasses from 'shared/global.module.scss';
import NewTagModal from 'tag/components/NewTagModal';
import TagLink from 'tag/components/TagLink';
import TagList from 'tag/components/TagList';
import useTags from 'tag/hooks/useTags';

import classes from './TagIndexPage.module.scss';

const filterId = 'FILTER_TAG_INDEX_PAGE';

export default function TagIndexPage() {
  const { showTagsBy } = useParams();
  const { tags } = useTags({ filterId });

  return (
    <>
      <h1>tags</h1>
      <NewTagModal />
      <br />
      <Filter filterId={filterId} />
      <h2>total: {tags.length} tags</h2>
      <h2>show tags by:</h2>
      <BulletList>
        <li>
          <Link to="/tags">definition</Link>
        </li>
        <li>
          <Link to="/tags/categories">categories</Link>
        </li>
        <li>
          <Link to="/tags/grid">grid</Link>
        </li>
      </BulletList>
      <TagPageContent tags={tags} showTagsBy={showTagsBy} />
    </>
  );
}

////////////////////

function TagPageContent({ tags, showTagsBy }) {
  if (showTagsBy === 'categories') {
    return <TagIndexPageCategories tags={tags} />;
  }
  if (showTagsBy === 'grid') {
    return <TagIndexPageGrid tags={tags} />;
  }
  return <TagIndexPageDefinitions tags={tags} />;
}

function TagIndexPageCategories({ tags }) {
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
      <hr />
      {categoryList.map(category => (
        <TagIndexPageSection
          key={category}
          title={category}
          tags={categoryMap[category]}
        />
      ))}
      <TagIndexPageSection title="none" tags={none} />
    </>
  );
}

function TagIndexPageDefinitions({ tags }) {
  const defined = tags.filter(tag => tag.definition);
  const notDefined = tags.filter(tag => !tag.definition);
  return (
    <>
      <hr />
      <TagIndexPageSection title="not defined" tags={notDefined} />
      <TagIndexPageSection title="defined" tags={defined} />
    </>
  );
}

function TagIndexPageSection({ title, tags }) {
  return (
    <>
      <h2>{title}</h2>
      <TagList tags={tags} showValues={false} showDefinitions={true} />
    </>
  );
}

function TagIndexPageGrid({ tags }) {
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
            <td>
              <TagLink tag={tag} />
            </td>
            <td>{tag.usageCount}</td>
            <td>{tag.category}</td>
            <td>{tag.restrictedToModels.join(', ')}</td>
            <td>{tag.definition}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
