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
		let icons = [
			"winter-jacket",
			"down-jacket",
			"windbreaker",
			"long-underwear",
			"t-shirt",
			"long-sleeved-shirt",
			"sweater",
			"shorts",
			"pants",
			"sunglasses",
			"umbrella",
			"snow-boots",
			"gloves",
			"scarf"];

		let itemName = jpg.toLowerCase().replace(" ", "-");

		if (icons.indexOf(itemName) !== -1) {
			let itemUrl  = "../assets/icons/" + itemName + ".png";
			return itemUrl;
		}

		return -1;
	}

	greyOut(i) {
		return () => {
			let id = i.replace(/ /g, "-");
			if ($("#"+id).is(':checked'))
				$("#"+id).parent().parent().css("background-color", "#D8DDDD");
			else
				$("#"+id).parent().parent().css("background-color", "#BBB");
		}
	}

	searchEnter(e) {
		if(e.key === 'Enter') {
			return this.addItem;
		}
	}

	render({}) {
		let showDropdown = this.state.showDropdown;
		let dayArray = this.props.dayArray;
		let items = this.props.items;
		let alerts = this.props.alerts;

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
				<div className={style.alertBox}>
					<ul>
						{alerts.map(i =>
							<li className={style.alertCircle} key={i} style={{background: i[1]}}>
								<div>
									<div>
										<img className={style.alertImage} src="../../assets/icons/warning-sign.png" />
									</div>
									<div>
										<span className={style.alertName}>{i[0]}</span>
									</div>
									<div className={style.alertDescDiv}>
										<span className={style.alertDesc}>{i[2]}</span>
									</div>
								</div>
							</li>)
						}
					</ul>
				</div>
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
								{ this.image(i) !== -1 ?
									<img className={style.packingIcon} src={this.image(i)} />
									:
									<div></div>
								}
								<span className={this.image(i) !== -1 ? style.packingLabel : style.noImageLabel}>{i}</span>
								<div className={style.checkContainer}>
									<input id={i.replace(/ /g, "-")} type="checkbox" className={style.check} onClick={this.greyOut(i)}/>
									<label className={style.checkBox} for={i.replace(/ /g, "-")}></label>
								</div>
							</li>)
			      }
			    </ul>
			    <input className={style.itemInput} type="text" placeholder="New item..." value="" ref={(txt) => this.state.text = txt} onKeyPress={() => {this.searchEnter}}/>
					<input className={style.addItem} type="image" name="add" src="../../assets/icons/add.png" onClick={this.addItem}/>
				</div>
				<img className={style.luggageWheel1} src="../../assets/icons/luggage-wheel.png"/>
				<img className={style.luggageWheel2} src="../../assets/icons/luggage-wheel.png"/>
			</div>
		);
	}
}
