// import preact
import { h, render, Component } from 'preact';
import style from './style';
import DayForecast from '../dayForecast';
import $ from 'jquery';

export default class DailyForecast extends Component {
	constructor(props){
		super(props);

		this.state = {
			showDropdown: false,
			text: ""
		};

		this.addItem = this.addItem.bind(this);
		this.toggleShow = this.toggleShow.bind(this);
		this.hide = this.hide.bind(this);
	}

	toggleShow(){
		this.setState({showDropdown: !this.state.showDropdown});
	}

	hide(e){
		if (e && e.relatedTarget){
			e.relatedTarget.click();
		}
		this.setState({showDropdown: false});
	}

	addItem(e) {
		let newItem = this.state.text.value;
		this.props.items[newItem] = true;
		this.setState();
	}

	image(jpg) {
		if (jpg === "Winter Jacket"||"Down Jacket"||"Windbreaker"||"Long Underwear"
		||"T-shirts"||"Long-sleeved shirt"||"Sweater"||"Shorts"||"Pants"
		||"Sunglasses"||"Umbrella"||"Snow Boots"||"Gloves"||"Scarf") {
			let itemP = jpg.toLowerCase();
			let itemPi = itemP.replace(" ", "-");
			let itemPic = "../assets/icons/" + itemPi + ".png";
			return itemPic;
		}

		return "../assets/icons/unknown-item.png";
	}

	greyOut(i) {
		return () => {
			let id = i.split(" ")[0]
			if ($("#"+id).is(':checked'))
				$("#"+id).parent().parent().css("background-color", "#D8DDDD");
			else
				$("#"+id).parent().parent().css("background-color", "#BBB");
		}
	}

	render({}) {
		let showDropdown = this.state.showDropdown;
		let dayArray = this.props.dayArray;
		let items = this.props.items;

		let days = [];
		for (let i=0; i< dayArray.length; i++){
			let d = dayArray[i];
			days.push(
				<DayForecast month={d.month} day={d.day} high={d.maxT} low={d.minT} rainLvl={d.rainLvl} iconName={d.icon} />
			);
		}

		let bring = [];
		for (let key in items) {
			if (items[key] === true) {
				bring.push(key);
			}
		}

		return (
			<div>
				<div className={style.dailyWeather}>
					<div className={style.bar}>
						<div className={style.dailyText}>Daily weather forecast</div>
						<button className={style.caretButton} onClick={this.toggleShow}>
							{!showDropdown && <img className={style.caret} src="../../assets/icons/caret.svg" height="10"/>}
							{showDropdown && <img className={style.caretflip} src="../../assets/icons/caret.svg" height="10"/> }
						</button>
					</div>
					{showDropdown &&
						(<div className={style.whiteBox}>
							<div className={style.dayBox}>
								{days}
							</div>
						</div>
					)}
				</div>

				<img className={style.luggageHandle} src="../../assets/icons/luggage-handle.png"/>
				<div className={style.luggage}>
			    <ul>
			      {bring.map(i =>
							<li className={style.suggestedItem} key={i}>
								<img className={style.packingIcon} src={this.image(i)} />
								<span className={style.packingLabel}>{i}</span>
								<div className={style.checkContainer}>
									<input id={i.split(" ")[0]} type="checkbox" className={style.check} onClick={this.greyOut(i)}/>
									<label className={style.checkBox} for={i.split(" ")[0]}></label>
								</div>
							</li>)
			      }
			    </ul>
					<form className={style.formItem}>
					    <input /*onChange={this.onChange}*/
							 type="text" placeholder="New item..." ref={(txt) => this.state.text = txt} /*value={this.state.text}*/ />
					</form>
					<button type="text" onClick={this.addItem}>Add item</button>

				</div>
				<img className={style.luggageWheel1} src="../../assets/icons/luggage-wheel.png"/>
				<img className={style.luggageWheel2} src="../../assets/icons/luggage-wheel.png"/>
			</div>
		);
	}
}
