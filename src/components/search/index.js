// import preact
import { h, render, Component } from 'preact';
import style from './style';

export default class Search extends Component {
	render() {
		return (
			<div className={style.nav}>
				<form>
          <input type="text" name="trip" value="Istanbul, 4/2 - 9/2"/>
					<input type="image" name="search" src="https://d30y9cdsu7xlg0.cloudfront.net/png/15028-200.png" />
        </form>
			</div>
		);
	}
}
