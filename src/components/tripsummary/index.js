// import preact
import { h, render, Component } from 'preact';
import Temperature from '../temperature';
import style from './style'

export default class TripSummary extends Component {
	constructor(props){
		super(props);
	}

	render() {
		let high = this.props.high;
		let low = this.props.low;
		let iconName = this.props.iconName;

		return (
			//todo: icon
			<div className={style.wrapper}>
				<div className={style.icon}>
					<i class={"wi wi-day-"+iconName}></i>
					<img src="http://icons.iconarchive.com/icons/icons8/ios7/256/Weather-Rain-icon.png" height="100"/>
				</div>

				{/* hi low temperatures - use something besides a table? */}
				<Temperature num={high} type={"high"}/>
				<span className={style.divider}>/</span>
				<Temperature num={low} type={"low"}/>

			</div>
		);
	}
}
