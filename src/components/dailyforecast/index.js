// import preact
import { h, render, Component } from 'preact';
import style from './style';
import DayForecast from '../dayForecast';

export default class DailyForecast extends Component {
	constructor(props){
		super(props);

		this.state = {
			showDropdown: false
		}

		this.toggleShow = this.toggleShow.bind(this);
		this.hide = this.hide.bind(this);
	}

	toggleShow(){
		this.setState({showDropdown: !this.state.showDropdown});
	}

	hide(e){
		if(e && e.relatedTarget){
			e.relatedTarget.click();
		}
		this.setState({showDropdown: false});
	}

	render() {
		let showDropdown = this.state.showDropdown;
		let dayArray = this.props.dayArray;

		var days = [];
		for (var i=0; i< dayArray.length; i++){
			let d = dayArray[i];
			days.push(
				<DayForecast month={d.month} day={d.day} high={d.maxT} low={d.minT} rainLvl={d.rainLvl} iconName={d.icon} />
			);
		}

		return (
			<div>
				<div className={style.bar}>
				<div className={style.dailyText}>Daily weather forecast</div>
				<button className={style.downCaret} onClick={this.toggleShow}>
					{!showDropdown && <img src="https://image.flaticon.com/icons/svg/60/60781.svg" height="10"/>}
					{showDropdown && <img src="http://images.qurancomplex.gov.sa/publications/documentation37/Publications3/1437_New_Contract/Free_Icons/clear-icons/png/caret7.png" height="5"/> }
				</button>
			</div>
				{showDropdown &&
					//todo: fix the white padding that occurs when content is not loaded?
					//todo: fix gap underneath nav and dropdown
					(<div className={style.whiteBox}>
						<div className={style.dayBox}>
							{days}
						</div>
					</div>
			)}
			</div>
		);
	}
}
