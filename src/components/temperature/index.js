import { h, render, Component } from 'preact';
import style from './style';

export default class Temperature extends Component {
	constructor(props){
		super(props);
	}

	render() {
		return (
			<div>
        <span className={style.tempNum}>{this.props.num}&deg;</span>
        <div className={style.smallText}>{this.props.type}</div>
      </div>
		);
	}
}
