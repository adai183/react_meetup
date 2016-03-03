var React = require('react');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      name: '',
      country: '',
      postalCode: '',
      distance: '',
      submitted: false,
      error: false,
      noGoogleMatch: false
    }
  },
  render: function(){
    return <div className="input-group">
    {this.renderError()}
    <div className={"thanks text-center" + (this.state.submitted ? ' fade' : '')}>

        thanks for joining. Check out out our meetup map <a href="./map.html">here</a>.

    </div>
      <div className={"cont" + (this.state.submitted ? ' hidden' : '')}>
        <div className="tag">

        </div>
        <div className="field">
          <input
          value={this.state.name}
          onChange={this.handleInputStateName}
          type="text"
          placeholder="name"
          className="form-controle"
          />
        </div>
      </div>
      <div className={"cont" + (this.state.submitted ? ' hidden' : '')}>
        <div className="tag">

        </div>
        <div className="field">
          <input
          value={this.state.country}
          onChange={this.handleInputStateCountry}
          placeholder="country"
          type="text"
          className="form-controle" />
        </div>
      </div>
      <div className={"cont" + (this.state.submitted ? ' hidden' : '')}>
        <div className="tag">

        </div>
        <div className="field">
          <input
          value={this.state.postalCode}
          onChange={this.handleInputStateCode}
          type="text"
          placeholder="postal code"
          className="form-controle" />
        </div>
      </div>
      <div className={"cont" + (this.state.submitted ? ' hidden' : '')}>
        <div className="tag">
          distance willing to travel for a meetup :
        </div>
        <div className="field">
          <input
          value={this.state.distance}
          onChange={this.handleInputStateDistance}
          type="text"
          className="form-controle input-distance" />  km
        </div>
      </div>
      <div className={"cont" + (this.state.submitted ? ' hidden' : '')}>
        <span className="input-group-btn">
          <button onClick= {this.handleClick}
          className="btn btn-primary"
          type="button">
            join the tribe
          </button>
        </span>
      </div>
    </div>
  },
  handleClick: function () {
    var self = this;
  // validate input and send it to Firebase
    if (this.state.name==='' || this.state.country==='' ||
      this.state.postalCode==='' || this.state.distance==='' || isNaN(this.state.distance)){
      this.setState({error:true});
    }else {
  // call google api
      var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=country' +  this.state.country + '|postal_code:' + this.state.postalCode;
      var coords;
      var town;
      var country;
      $.get(url, function(data) {
           if (data.status === 'OK') {
              self.setState({noGoogleMatch:false});
              var result = data.results[0];
              coords = result.geometry.location;

               for (var comp in result.address_components) {
                   if (result.address_components[comp].types.indexOf('country') != -1) {
                      country = result.address_components[comp].long_name
                   } else if (result.address_components[comp].types.indexOf('locality') != -1) {
                       if ('long_name' in result.address_components[comp]) {
                          town = result.address_components[comp].long_name;
                       }
                   }

               }
               if (typeof town == 'undefined') {
                   town = '';
                }
           }else{
             self.setState({noGoogleMatch:true});
             console.log(url);
           }
       }).done(function (data) {
          if (!self.state.noGoogleMatch) {
           self.props.itemsStore.push({
             name: self.state.name,
             country: self.state.country,
             postalCode: self.state.postalCode,
             distance: self.state.distance,
             lat: coords.lat,
             lng: coords.lng,
             country: self.state.country,
             town: town
             });
             self.setState({error:false});
             self.setState({noGoogleMatch:false});
             self.setState({submitted: true});

             // Webhook URL
             var url = 'https://hooks.slack.com/services/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'
             // Text to post
             var text = 'A new fellow geek joined the tribe. Welcome ' + self.state.name + ' from ' + town + ' ' + self.state.country + '!  '+ self.state.name + ' is willing to travel ' +  self.state.distance + 'km for a react meet up.'

             $.ajax({
                data: 'payload=' + JSON.stringify({
                    "username": "Mr. Robot",
                    "icon_emoji": ":robot_face:",
                    "text": text
                }),
                dataType: 'json',
                processData: false,
                type: 'POST',
                url: url
            });
          }
       })
    }
  },
  renderError: function () {
    if(this.state.error){
      return <h4
      className="error text-center">
      oohh.. you missed something. please fill out the form correctly</h4>
    }else if(this.state.noGoogleMatch) {
      return <h4
      className="error text-center">
      oohh.. seems we cannot find your address. please check your country and postalcode
      </h4>
    }else {
      return
    }
  },
  handleInputStateName: function (event) {
    this.setState({name: event.target.value});
  },
  handleInputStateCountry: function (event) {
    this.setState({country: event.target.value});
  },
  handleInputStateCode: function (event) {
    this.setState({postalCode: event.target.value});
  },
  handleInputStateDistance: function (event) {
    this.setState({distance: event.target.value});
  }

});
