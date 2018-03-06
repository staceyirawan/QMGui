import { h, render, Component } from 'preact';
import style from './style';
import $ from 'jquery';
import Button from '../button';
import style_iphone from '../button/style_iphone';
import TripSummary from '../tripsummary';
import DailyForecast from '../dailyforecast';

export default class Iphone extends Component {

	constructor(props){
		super(props);
		this.state.temp = "";

		this.state.tripArray = []; //stores input box value
		this.state.dayArray = []; //stores info on daily forecast
		this.state.alertArray = [];
		this.state.summaryIcon = "na";
		this.state.itemBool = {
			"Winter Jacket": false,
			"Down Jacket": false,
			"Windbreaker": false,
			"Long Underwear": false,
			"T-shirts": false,
			"Long-sleeved shirt": false,
			"Sweater": false,
			"Shorts": false,
			"Pants": false,
			"Sunglasses": false,
			"Umbrella": false,
			"Snow Boots": false,
			"Gloves": false,
			"Scarf": false,
		}; //false if not a suggested item
		this.setState({ displayTrip: false });
	}

	formatDate = (dates) => {
		var date = dates.replace(/\//g, '').replace("/ /g", '').replace("-", '');
		this.state.tripArray[2] = date.substring(0, 4);
		this.state.tripArray[3] = date.substring(4, 8);
	}

	fetchWeatherData = () => {
		this.state.dayArray.length = 0;
		this.state.alertArray.length = 0;
		this.state.tripArray.length = 0;
		// API URL with a structure of : ttp://api.wunderground.com/api/key/feature/q/country-code/city.json
		var tripString = ($("#tripParameters").val()?$("#tripParameters").val():alert('please fill the text field'));
		this.state.tripArray = tripString.split(", "); //City, Country or State, Depart, Return
		this.formatDate(this.state.tripArray[2]);

		var url = "http://api.wunderground.com/api/9e7726cd8a6a3795/conditions/" + "planner_" + this.state.tripArray[2] + this.state.tripArray[3] + "/q/" + this.state.tripArray[1] + "/" + this.state.tripArray[0] + ".json";

		$.ajax({
			url: url,
			dataType: "jsonp",
			success : this.parseResponse,
			error : function(req, err){ console.log('API call failed ' + err); }
		})

		this.setState({ displayTrip: true });
	}

	render() {
		const tempStyles = this.state.temp ? `${style.temperature} ${style.filled}` : style.temperature;
		let dayArray = this.state.dayArray;

		return (
			<div class={ style.container }>
				{ this.state.displayTrip ?
					<div></div>
					:
					<img src="/assets/icons/relaxing.gif" id="relax"/>
				}
				<div class= { style_iphone.container }>
				<div>
					<div className={style.nav}>
						<input id="tripParameters" type="text" name="trip" placeholder="Search for a city" onKeyPress={this.searchEnter} />
						<input type="image" name="search" src="../../assets/icons/search.png"
						onClick={ this.fetchWeatherData } />
					</div>


				  { this.state.displayTrip ?
						<div>
							<TripSummary high={this.state.tempHigh} low={this.state.tempLow} iconName={this.state.summaryIcon}/>
							<DailyForecast dayArray={this.state.dayArray} items={this.state.itemBool}/>
						</div>
						:
						<div class="landing">
							<img src="/assets/icons/sun.gif" id="sun" height="50"/>
							<div className={style.landing}>
								<br/><br/><br/>
								Search for a city above to receive personalized packing recommendations.
								<br/><br/>
								Prepare to feel prepared!
								<br/>
							</div>
						</div>
					}
				 </div>
				</div>
			</div>
		);
	}

	searchEnter = (e) => {
		if(e.key === 'Enter') {
			this.fetchWeatherData();
		}
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
			this.state.itemBool['Gloves'] = true;
			this.state.itemBool['Scarf'] = true;
		}
		if (chanceOverSixty > 30){
			this.state.itemBool['Long-sleeved Shirt'] = true;
		}
		if (chanceOverFreezing > 30){
			this.state.itemBool['Down Jacket'] = true;
			this.state.itemBool['Sweater'] = true;
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
		var month = parseInt(parsed_json['history']['dailysummary']['0']['date']['mon']);
		var day = parseInt(parsed_json['history']['dailysummary']['0']['date']['mday']);
		var maxTemp = parseInt(parsed_json['history']['dailysummary']['0']['maxtempm']);
		var minTemp = parseInt(parsed_json['history']['dailysummary']['0']['mintempm']);
		var precip = parseFloat(parsed_json['history']['dailysummary']['0']['precipm']) || 0;
		var snowfall = parseFloat(parsed_json['history']['dailysummary']['0']['snowfallm']) || 0;

		var cond = {};
		for ( var i =0; i < parsed_json['history']['observations'].length; i+=10){
			var condition = parsed_json['history']['observations'][i]['icon'];
			cond[condition] = (cond[condition] || 0) + 1;
		} //usually taking it from midnight to morning, afternoon, evening, and then night

		var day = {
			month: month,
			day: day,
			maxT: maxTemp,
			minT: minTemp,
			rainLvl: precip,
			snowLvl: snowfall,
			cond: cond,
			icon: this.getDailyIcon(cond, precip, snowfall),
		}

		this.state.dayArray.push(day);
		this.state.dayArray.sort(function compare(a, b) {
			if (parseInt(a.month) < parseInt(b.month)){
				return -1;
			} else if (parseInt(a.month) > parseInt(b.month)){
				return 1;
			} else {
				if ( parseInt(a.day) > parseInt(b.day) ){
					return 1;
				}
			}
			return 0;
		});

		this.getSummaryIcon();
	}

	getDailyIcon(cond, precip, snowfall) {
		var clearCount = (cond['clear'] || 0) + (cond['partlysunny'] || 0) + (cond['mostlysunny'] || 0) + (cond['sunny'] || 0);
		var cloudyCount = (cond['cloudy'] || 0) + (cond['partlycloudy'] || 0) + (cond['mostlycloudy'] || 0);
		var snowCount = (cond['flurries'] || 0) + (cond['snow'] || 0);
		var sleetCount = (cond['sleet'] || 0);
		var rainCount = (cond['rain'] || 0);
		var thunderCount = (cond['tstorms'] || 0);
		var fogCount = (cond['fog'] || 0) + (cond['hazy'] || 0);
		var naCount = (cond[''] || 0) + (cond['unknown'] || 0);

		if(snowCount >= 1 && snowfall > 0)
			return 'snow';
		if(sleetCount >= 1)
			return 'sleet';
		if(thunderCount >= 1 && precip > 0)
			return 'thunderstorm';
		if(rainCount >= 1 && precip > 0)
			return 'showers';
		if(fogCount >= 1)
			return 'fog';
		if(cloudyCount >= 1 && cloudyCount >= clearCount)
			return 'cloudy';
		if(clearCount >= 1 && clearCount >= cloudyCount)
			return 'sunny';
		return 'na';
	}

	getSummaryIcon() {
		var dayArray = this.state.dayArray;
		var maxCount = -1;
		var maxIcon = "na";
		var iconCounts = {};

		for(var i = 0; i < dayArray.length; i++) {
			var dayIcon = dayArray[i]["icon"];
			iconCounts[dayIcon] = (iconCounts[dayIcon] || 0) + 1;

			if(iconCounts[dayIcon] > maxCount) {
				maxCount = iconCounts[dayIcon];
				maxIcon = dayIcon;
			}
		}

		this.setState({summaryIcon : maxIcon});
	}
}
