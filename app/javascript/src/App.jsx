import React, { useEffect, useState } from "react";

import { Route, Switch, BrowserRouter as Router } from "react-router-dom";

import { setAuthHeaders } from "apis/axios";
import { initializeLogger } from "common/logger";
import Dashboard from "components/Dashboard";
import PageLoader from "components/PageLoader";

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeLogger();
    setAuthHeaders(setLoading);
  }, []);

  if (loading) {
    return (
      <div className="h-screen">
        <PageLoader />
      </div>
    );
  }

  return (
    <Router>
      <Switch>
        <Route exact path="/" render={() => <div>Home</div>} />
        <Route exact path="/about" render={() => <div>About</div>} />
        <Route exact component={Dashboard} path="/dashboard" />
      </Switch>
    </Router>
  );
};

export default App;

//React mounts child components before parent components. In such a case child components like Dashboard might try to invoke
//their useEffect hook upon mounting which will in turn call the fetchTasks function in this case.

//For fetching tasks we'd have to invoke the Axios APIs. The issue here is that in our backend we verify each API request and
//ensure that it has a valid auth token and email. These tokens are set in the headers of the request.

//In order for those headers to be set correctly for all Axios requests, we invoke the setAuthHeaders function in the App component itself
//since it's the entry point to all other components. Thus we have to ensure that all child components are mounted only once Axios headers are successfully set.

//In order to ensure that, we pass the setLoading function as an argument to setAuthHeaders. Initially, the loading state is set to true in the App component.
//Only once the setAuthHeaders function's execution is completed and auth headers are set for API requests, we set the loading state to false.
