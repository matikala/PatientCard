import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import PatientsList from './components/PatientsList'
import PatientsDetails from './components/PatientsDetails'
import NavBar from './components/NavBar'

function App() {
  return (
    <div>
      <NavBar />
      <Router>
        <Switch>
          <Route exact path="/" children={<PatientsList />} />
          <Route path="/patients/:id" children={<PatientsDetails/>}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
