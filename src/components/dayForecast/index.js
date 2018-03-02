import { h, render, Component } from 'preact';
import style from './style';

export default class DayForecast extends Component {
  constructor(props){
    super(props);
  }

  render(){
    let description = null;
		let iconName = this.props.iconName;
		let precip = false;

		switch(iconName) {
			case "snow":
				precip = true;
				description = this.props.snowLvl + " mm snow";
				break;
			case "sleet":
				precip = true;
				description = "sleet";
				break;
			case "thunderstorm":
			case "showers":
				precip = true;
				description = this.props.rainLvl + " mm rain";
				break;
			case "fog":
				description = "foggy";
				break;
			case "cloudy":
				description = "cloudy";
				break;
			case "sunny":
				description = "sunny";
				break;
			case "na":
				description = "conditions n/a"
				break;
		}

    return (
      <div className={style.day}>
        &nbsp; {this.props.day}/{this.props.month}
				{
				/* Not sure how to nest classes in less, current solution is use icon vs span*/
				precip ?
        <i class={"wi wi-day-" + this.props.iconName}></i>
				:
				<span class={"wi wi-day-" + this.props.iconName}></span>
				}

        &nbsp; {/* todo: determine icon */}
        &nbsp; {this.props.high}&deg; / {this.props.low}&deg;
        &nbsp; {description}
      </div>
    )
  }
}
