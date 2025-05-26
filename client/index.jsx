import React from 'react';
import {createRoot} from 'react-dom/client';

import App from './src/App';
import './global.scss';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App/>);
