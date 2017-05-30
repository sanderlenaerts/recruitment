import React from 'react';

import { Switch, Route, Redirect } from 'react-router-dom'; 

import { StudyOptionList } from './study-option-list';
import { ProgrammeContainer } from './programme-container';
import { NotFound } from './programme-container';


export const StudyOptionContainer = () => (
  <Switch>
    <Route exact path='/options' component={StudyOptionList}/>
    <Route path='/options/:snumber/programmes' component={ProgrammeContainer}/>
    <Route path='/404' component={NotFound} />
    <Redirect from='*' to='/404' />
  </Switch>
)