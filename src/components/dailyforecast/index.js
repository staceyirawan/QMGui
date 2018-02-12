// import preact
import { h, render, Component } from 'preact';
import style from './style';

export default class DailyForecast extends Component {
	render() {
		return (
			<div className={style.bar}>
				<div className={style.dailyText}>Daily weather forecast</div>
				<button className={style.downCaret}>
					<img src="https://image.flaticon.com/icons/svg/60/60781.svg" height="10"/>
				</button>
			</div>
		);
	}
}
