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
			<div className={style.wrapper}>
				<div className={style.summaryIcon}>
					<i class={"wi wi-day-"+iconName}></i>
				</div>

				{/* hi low temperatures - use something besides a table? */}
				<Temperature num={high} type={"high"}/>
				<span className={style.divider}>/</span>
				<Temperature num={low} type={"low"}/>

			</div>
		);
	}
}
