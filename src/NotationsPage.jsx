import React, {useEffect, useState} from 'react';

function NotationsPage() {
  const [notations, setNotations] = useState([]);

  useEffect(() => {
    fetch('http://localhost:9000/api/notation-index')
      .then((res) => res.json())
      .then((res) => {
        setNotations(res.data);
      })
      .catch((err) => {
        console.log('ERROR', err.message);
      });
  }, []);

  return (
    <div>
      <h2>notations</h2>
      <ul>
        {notations.map(notation => (
          <li key={notation.id}>
            {notation.title || '(empty)'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NotationsPage;

