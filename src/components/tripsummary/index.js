// import preact
import { h, render, Component } from 'preact';
import Temperature from '../temperature';
import style from './style'

export default class TripSummary extends Component {
	render() {
		return (
			//icon for weather
			<div className={style.wrapper}>
				<div className={style.icon}>
					<img src="http://icons.iconarchive.com/icons/icons8/ios7/256/Weather-Rain-icon.png" height="100"/>
				</div>

				{/* hi low temperatures - use something besides a table? */}
				<Temperature num={21} type={"high"}/>
				<span className={style.divider}>/</span>
				<Temperature num={11} type={"low"}/>
				
			</div>
		);
	}
}