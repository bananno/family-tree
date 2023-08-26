import React from 'react';
import {Link} from 'react-router-dom';

const ChecklistIndexPage = () => {
  return (
    <div>
      <h1>Checklists</h1>
      <h2>misc checklists</h2>
      <ul>
        <li>images</li>
        <li>places</li>
        <li>scratch list</li>
      </ul>
      <h2>people</h2>
      <ul>
        <li>
          <Link to="/checklist/person-vitals">vitals - person birth & death dates</Link>
        </li>
        <li>profile summary</li>
        <li>parent ages - analyze for possible mistakes</li>
      </ul>
      <h2>stories</h2>
      <p>List of all entries and whether they have links, citation text, etc.</p>
      <p>Also a list of all people that are missing the story.</p>
      <ul>
        <li>Census USA 1850</li>
        <li>Census USA 1860</li>
        <li>Census USA 1870</li>
        <li>Census USA 1880</li>
        <li>Census USA 1890</li>
        <li>Census USA 1900</li>
        <li>Census USA 1910</li>
        <li>Census USA 1920</li>
        <li>Census USA 1930</li>
        <li>Census USA 1940</li>
        <li>World War I draft</li>
        <li>World War II draft</li>
        <li>Census USA 1950</li>
      </ul>
      <h2>sources</h2>
      <ul>
        <li>
          census - list of all US census entries and whether they have links and citation text
        </li>
        <li>
          obituaries - list of people who do not have obituaries in the database
        </li>
      </ul>
      <h2>dynamic tag checklists</h2>
      <ul>
        <li>findagrave</li>
        <li>number of children</li>
        <li>wikitree</li>
      </ul>
    </div>
  );
};

export default ChecklistIndexPage;
