import React from 'react';
import { Route, Link } from 'react-router-dom';
import Header from '../header';
import BoxContentExplroer from '../box/box-content-explorer';

const App = () => (
  <div>
    <header>
      <Header />
    </header>
    <main>
      <Route exact path="/" component={BoxContentExplroer} />
    </main>
  </div>
);

export default App;
