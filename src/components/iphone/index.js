// import preact
import { h, render, Component } from 'preact';
// import stylesheets for ipad & button
import style from './style';
// import jquery for API calls
import $ from 'jquery';
// import the Button component
import Button from '../button';
import style_iphone from '../button/style_iphone';
import TripSummary from '../tripSummary';
import DailyForecast from '../dailyForecast';

export default class Iphone extends Component {
//var Iphone = React.createClass({


	// a constructor with initial set states
	constructor(props){
		super(props);
		// temperature state
		this.state.temp = "";
		this.state.tripArray = []; //stores input box value
		this.state.dayArray = []; //stores info on daily forecast
		this.state.alertArray = [];
		this.state.itemBool = {
			"Winter Jacket": false,
			"Fleece Jacket": false,
			"Windbreaker": false,
			"Long Underwear": false,
			"T-shirts": false,
			"Long Sleeves": false,
			"Light Sweater/Hoodie": false,
			"Heavy Sweater": false,
			"Shorts": false,
			"Pants": false,
			"Sunglasses": false,
			"Umbrella": false,
			"Snow Boots": false,
			"Gloves/Scarf": false,
		}; //dictionary of items, false if not suggested
		// button display state
		this.setState({ displayTrip: false });
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
		this.setState({ displayTrip: true });
	}

	// the main render method for the iphone component
	render() {
		// check if temperature data is fetched, if so add the sign styling to the page
		//
		const tempStyles = this.state.temp ? `${style.temperature} ${style.filled}` : style.temperature;
		let dayArray = this.state.dayArray;

		// display all weather data
		return (
			<div class={ style.container }>
				 <div class={ style.header }>
						<div class={ style.city }>{ this.state.locate }</div>
						<span class={ tempStyles }>{ this.state.temp }</span>
				</div>
				<div class= { style_iphone.container }>
				<div>
					{/* Search Bar */}
					<div className={style.nav}>
						<input id="tripParameters" type="text" name="trip" placeholder="Search for a city" value="London, England, 0222, 0224"/>
						<input type="image" name="search" src="https://d30y9cdsu7xlg0.cloudfront.net/png/15028-200.png"
						onClick={ this.fetchWeatherData } />
					</div>

					{/* USED FOR TESTING --- ignore
					 <div>
						<TripSummary high={this.state.tempHigh} low={this.state.tempLow}/>
					  <DailyForecast dayArray={dayArray} />
				  </div> */}

				  { this.state.displayTrip ?
							<div> <TripSummary high={this.state.tempHigh} low={this.state.tempLow}/>
							<DailyForecast dayArray={this.state.dayArray} /> </div>:
							<div className={style.landing}>
								<img src="/assets/icons/sun.gif" id="sun" height="50"/> <br/>
								Search for a city above to recieve personalized packing recommendations. <br/><br/><br/>
								Prepare to feel prepared! <br/>
								<img src="/assets/icons/relaxing.gif" height="200"/>
							</div>  }
				 </div>
				</div>
			</div>
		);
	}

	fetchAlertData = (zip, magic, wmo) => {
		var urlAlerts = "http://api.wunderground.com/api/9e7726cd8a6a3795/alerts/q/zmw:" + zip + "." + magic + "." + wmo + ".json";

		$.ajax({
			url: urlAlerts,
			dataType: "jsonp",
			success : this.parseAlertResponse,
			error : function(req, err){ console.log('API call failed ' + err); }
		});
	}

	convertTwoDigit = (val) => {
		return (val < 10? '0' : '') + val;
	}

	dailyCall = (url) => {
		$.ajax({
			url: url,
			dataType: "jsonp",
			success : this.parseDailyResponse,
			error : function(req, err){ console.log('API call failed ' + err); }
		});
	}

	fetchDailyData = () => {
		var departDate = new Date(18, this.state.tripArray[2].substring(0, 2), this.state.tripArray[2].substring(2,4), 0, 0, 0, 0);
		
		var returnDate = new Date(18, this.state.tripArray[3].substring(0, 2), this.state.tripArray[3].substring(2,4), 0, 0, 0, 0);

		

		for ( var d = departDate; d <= returnDate; d.setDate(d.getDate() + 1)){
			var month = this.convertTwoDigit(d.getMonth());
			var day = this.convertTwoDigit(d.getDate());
			var urlDaily = "http://api.wunderground.com/api/9e7726cd8a6a3795/history_2017" + month + day + "/q/" + this.state.tripArray[1] + "/" + this.state.tripArray[0] + ".json";
			this.dailyCall(urlDaily);
		}
		console.log("dayArray",this.state.dayArray);

	}



	parseResponse = (parsed_json) => {
		var location = parsed_json['current_observation']['display_location']['full'];
		var zip = parsed_json['current_observation']['display_location']['zip'];
		var magic = parsed_json['current_observation']['display_location']['magic'];
		var wmo = parsed_json['current_observation']['display_location']['wmo'];
		var temp_high = parsed_json['trip']['temp_high']['max']['C'];
		var temp_low = parsed_json['trip']['temp_low']['min']['C'];
		var cloudCover = parsed_json['trip']['cloud_cover']['cond'];
		var chanceOfPrecip = parseInt(parsed_json['trip']['chance_of']['chanceofprecip']['percentage']);
		var chanceOfRain = parseInt(parsed_json['trip']['chance_of']['chanceofrainday']['percentage']);
		var chanceOfHail = parseInt(parsed_json['trip']['chance_of']['chanceofhailday']['percentage']);
		var chanceOfWind = parseInt(parsed_json['trip']['chance_of']['chanceofwindyday']['percentage']);
		var chanceOfSnow = parseInt(parsed_json['trip']['chance_of']['chanceofsnowday']['percentage']);
		var chanceOfSnowGround = parseInt(parsed_json['trip']['chance_of']['chanceofsnowonground']['percentage']);
		var chanceOverFreezing = parseInt(parsed_json['trip']['chance_of']['tempoverfreezing']['percentage']);//Cool weather
		var chanceOfFreezing = parseInt(parsed_json['trip']['chance_of']['tempbelowfreezing']['percentage']); //Below Freezing
		var chanceOfHot = parseInt(parsed_json['trip']['chance_of']['tempoverninety']['percentage']); //over 90
		var chanceOverSixty = parseInt(parsed_json['trip']['chance_of']['tempoversixty']['percentage']);//over 60
		
		//Parsing through to determine which items will be suggested
		if (chanceOfRain > 30 || chanceOfPrecip > 30){
			this.state.itemBool['Umbrella'] = true;
		}
		if (chanceOfWind > 30){
			this.state.itemBool['Windbreaker'] = true;
		}
		if (chanceOfSnowGround > 30){
			this.state.itemBool['Snow Boots'] = true;
		}
		if (chanceOfSnow > 30){
			this.state.itemBool['Winter Jacket'] = true;
		}
		if (chanceOfHot > 30){
			this.state.itemBool['T-shirts'] = true;
			this.state.itemBool['Shorts'] = true;
			this.state.itemBool['Sunglasses'] = true;
		}
		if (chanceOfFreezing > 30){ //Below Freezing
			this.state.itemBool['Winter Jacket'] = true;
			this.state.itemBool['Long Underwear'] = true;
			this.state.itemBool['Gloves/Scarf'] = true;
		}
		if (chanceOverSixty > 30){
			this.state.itemBool['Light Sweater/Hoodie'] = true;
		}
		if (chanceOverFreezing > 30){
			this.state.itemBool['Fleece Jacket'] = true;
			this.state.itemBool['Heavy Sweater'] = true;
		}

		// set states for fields so they could be rendered later on
		this.setState({
			locate: location,
			tempHigh: temp_high,
			tempLow: temp_low,
			chancePrecip: chanceOfPrecip,
			chanceRain: chanceOfRain,
			chanceHail: chanceOfHail,
			chanceWind: chanceOfWind,
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

		this.state.alertArray = alerts;

		this.fetchDailyData();
	}

	parseDailyResponse = (parsed_json) => {
		console.log("daily parsed json", parsed_json);
		var month = parseInt(parsed_json['history']['dailysummary']['0']['date']['mon']);
		var day = parseInt(parsed_json['history']['dailysummary']['0']['date']['mday']);
		var maxTemp = parseInt(parsed_json['history']['dailysummary']['0']['maxtempm']);
		var minTemp = parseInt(parsed_json['history']['dailysummary']['0']['mintempm']);
		var precip = parseFloat(parsed_json['history']['dailysummary']['0']['precipm']);

		var cond = {};
		for ( var i =0; i < parsed_json['history']['observations'].length; i+=10){
			var condition = parsed_json['history']['observations'][i]['conds'];
			cond[condition] = (cond[condition] || 0) + 1;
		} //usually taking it from midnight to morning, afternoon, evening, and then night

		var day = {
			month: month,
			day: day,
			maxT: maxTemp,
			minT: minTemp,
			rainLvl: precip,
			cond: cond,
		}

		this.state.dayArray.push(day);
	}
}
