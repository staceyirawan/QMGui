import { h, render, Component } from 'preact';
import style from './style';

export default class CheckList extends Component {
	constructor(props) {
    super(props);
		this.state = {
			list: this.props.sugItems,
			value: ""
		}
		this.addItem = this.addItem.bind(this);
  }

	onChange(e) {
    this.setState({value: e.target.value});
  }

	addItem(e) {
		if (e.target.value != '') {
			this.props.sugItems.push(e.target.value);
			this.setState();
			alert(e.target.value + ' added');
		}
	}

	toggle(e) {
    let checked = !this.state.checked;
    this.setState({ checked });
  }

	render({ }, { checked }) {
		let list = this.props.sugItems;
	    return (

				<div>

			    <ul>
			      {list.map(i => <li key={i}>
							{i}
							<label>
		              <input
		                  type="checkbox"
		                  checked={checked}
		                  onClick={this.toggle} />
		          </label>
							</li> )}
			    </ul>

					<form>
					    <input onClick={this.addItem} type="text" placeholder="Add item..." value={this.state.value} onChange={this.onChange}/>
					</form>
					<input type="Submit" value="Click the text box above to submit new item"/>

				</div>


	    );
	  }
}
