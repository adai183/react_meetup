var React = require('react');
var ReactDOM = require('react-dom');
var Reactfire = require('reactfire');
var Firebase = require('firebase');
var rooturl = 'https://react-meet-up.firebaseio.com/'
var Register = require('./register');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
// Dependencies to send notifications to udacious people Slack channel
var Slack = require('node-slack');
var slack = new Slack('https://hooks.slack.com/services/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');


var App = React.createClass({
  mixins: [Reactfire],
  getInitialState: function () {
    return {
      items: {},
      loaded: false
    }
  },
  componentWillMount: function(){
    this.fb = new Firebase(rooturl + 'items/');
    this.bindAsObject(this.fb, 'items');
    this.fb.on('value', this.handleDataLoaded);
  },
  render: function() {
    return <div className="container-fluid">
      <div className="row">
        <div className="col-md-12">
            <h2 className="text-center">
              Let's come together react people
            </h2>
        </div>
      </div>
      <Register itemsStore={this.firebaseRefs.items} />

    </div>

  },
  handleDataLoaded: function () {
    this.setState({loaded: true})
  }
});

var routes =(
  <Router>
    <Route path="/" component={App}>

    </Route>
  </Router>
);


ReactDOM.render(routes, document.querySelector('.container'));
