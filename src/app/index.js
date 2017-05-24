import styles from './assets/sass/main.scss';

import React from 'react';
import { render } from 'react-dom';

import { Header } from './components/Header';

class App extends React.Component {
    render(){
        return (
            <div className="app-container">
                <Header/>
                <h1>Hello!</h1>
            </div>
        );
    }
}

render(<App/>, document.getElementById('app'));