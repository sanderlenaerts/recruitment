import styles from './assets/sass/main.scss';


import React from 'react';
import { render } from 'react-dom';
import { Layout } from './layout';

import { BrowserRouter as Router, Route} from 'react-router-dom';

render(
    <Router>
        <Layout/>
    </Router>
, document.getElementById('app'));