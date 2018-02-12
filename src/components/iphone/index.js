// import preact
import { h, render, Component } from 'preact';
// import stylesheets for ipad & button
import style from './style';
// import jquery for API calls
import $ from 'jquery';
// import the Button component
import Button from '../button';
import style_iphone from '../button/style_iphone';
import Search from '../search';
import TripSummary from '../tripsummary';
import DailyForecast from '../dailyforecast';

export default class Iphone extends Component {
//var Iphone = React.createClass({

	// a constructor with initial set states
	constructor(props){
		super(props);
		// temperature state
		this.state.temp = "";
		this.state.tripArray = []; //stores input box value
		this.state.dayArray = []; //stores info on daily forecast
		//this.state.alertArray = [];
		// button display state
		this.setState({ display: true });
	}

	// a call to fetch weather data via wunderground
	fetchWeatherData = () => {
		// API URL with a structure of : ttp://api.wunderground.com/api/key/feature/q/country-code/city.json
		var tripString = ($("#tripParameters").val()?$("#tripParameters").val():alert('please fill the text field'));
		this.state.tripArray = tripString.split(", "); //City, Country or State, Depart, Return
		var url = "http://api.wunderground.com/api/9e7726cd8a6a3795/conditions/" + "planner_" + this.state.tripArray[2] + this.state.tripArray[3] + "/q/" + this.state.tripArray[1] + "/" + this.state.tripArray[0] + ".json";

		$.ajax({
			url: url,
			dataType: "jsonp",
			success : this.parseResponse,
			error : function(req, err){ console.log('API call failed ' + err); }
		})

		// once the data grabbed, hide the button
		this.setState({ display: false });
	}

	// the main render method for the iphone component
	render() {
		// check if temperature data is fetched, if so add the sign styling to the page
		const tempStyles = this.state.temp ? `${style.temperature} ${style.filled}` : style.temperature;

		// display all weather data
		return (
			<div class={ style.container }>
				<div class={ style.header }>
					<div class={ style.city }>{ this.state.locate }</div>
					<div class={ style.conditions }>{ this.state.chancePrecip }</div>
					<div class={ style.conditions }>Chance of Rain: { this.state.chanceRain }</div>
					<div class={ style.conditions }>Chance of Hail: { this.state.chanceHail }</div>
					<span class={ tempStyles }>{ this.state.temp }</span>
				</div>
				<div class={ style.details }></div>
				<div class= { style_iphone.container }>
					{ this.state.display ?
						<div>
							<Search />
							<TripSummary />
							<DailyForecast />

							<div>
								<br/>
								<input id="tripParameters" type="text" value="City, Country, Date1, Date2"></input>
								<Button class={ style_iphone.button } clickFunction={ this.fetchWeatherData }/ >
							</div>
						</div> : null }


				</div>
			</div>
		);
	}

	fetchAlertData = (zip, magic, wmo) => {
		var urlAlerts = "http://api.wunderground.com/api/9e7726cd8a6a3795/alerts/q/zmw:" + zip + "." + magic + "." + wmo + ".json";
		console.log(urlAlerts);

		$.ajax({
			url: urlAlerts,
			dataType: "jsonp",
			success : this.parseAlertResponse,
			error : function(req, err){ console.log('API call failed ' + err); }
		});
	}
/*
	fetchDailyData = () => {
		var oneDay = 24*60*60*1000;
		var departDate = this.state.tripArray[2];
		var returnDate = this.state.tripArray[3];
		var d = new Date(18, departDate.substring(0, 1), departDate.substring(2,3), 0, 0, 0, 0);
		var r = new Date(18, returnDate.substring(0, 1), returnDate.substring(2,3), 0, 0, 0, 0);
		var today = new Date();
		var forecastDate = new Date();
		forecastDate.setDate(forecastDate.getDate() + 10);

		var finish =  Math.round((forecastDate.getTime() - r.getTime())/(oneDay));
		var start =  Math.round((d.getTime() - today.getTime())/(oneDay));



		var urlDaily = ""

		$.ajax({
			url: urlDaily,
			dataType: "jsonp",
			success : this.parseDailyResponse,
			error : function(req, err){ console.log('API call failed ' + err); }
		});
	}*/

	parseResponse = (parsed_json) => {
		var location = parsed_json['current_observation']['display_location']['full'];
		var zip = parsed_json['current_observation']['display_location']['zip'];
		var magic = parsed_json['current_observation']['display_location']['magic'];
		var wmo = parsed_json['current_observation']['display_location']['wmo'];
		var temp_high = parsed_json['trip']['temp_high']['max']['C'];
		var temp_low = parsed_json['trip']['temp_low']['min']['C'];
		var cloudCover = parsed_json['trip']['cloud_cover']['cond'];
		var chanceOfPrecip = parsed_json['trip']['chance_of']['chanceofprecip']['percentage'];
		var chanceOfRain = parsed_json['trip']['chance_of']['chanceofrainday']['percentage'];
		var chanceOfHail = parsed_json['trip']['chance_of']['chanceofhailday']['percentage'];
		var chanceofWind = parsed_json['trip']['chance_of']['chanceofwindyday']['percentage'];
		var chanceOfSnow = parsed_json['trip']['chance_of']['chanceofsnowday']['percentage'];
		var chanceOfFreezing = parsed_json['trip']['chance_of']['tempbelowfreezing']['percentage'];
		var chanceOfHot = parsed_json['trip']['chance_of']['tempoverninety']['percentage'];

		// set states for fields so they could be rendered later on
		this.setState({
			locate: location,
			tempHigh: temp_high,
			tempLow: temp_low,
			chancePrecip: chanceOfPrecip,
			chanceRain: chanceOfRain,
			chanceHail: chanceOfHail,
			chanceWind: chanceofWind,
			chanceSnow: chanceOfSnow,
			chanceFreeze: chanceOfFreezing,
			chanceHot: chanceOfHot,
		});

		this.fetchAlertData(zip, magic, wmo);
	}

	parseAlertResponse = (parsed_json) => {
		var numAlerts = parsed_json['alerts'].length;
		var alertArray = parsed_json['alerts'];
		var alerts = [];
		for ( var i =0; i < numAlerts; i++){
			//grabbing name of alert and the color warning
			var alertPair = [parsed_json['alerts'][i]['wtype_meteoalarm_name'], parsed_json['alerts'][i]['level_meteoalarm_name']]; 
			alerts.push(alertPair);
		}

		this.setState({
			alertArray: alerts,
		})

		//this.fetchDailyData();
	}
}
