import { h, render, Component } from 'preact';
import style from './style';

export default class DayForecast extends Component {
  constructor(props){
    super(props);
  }

  render(){
    let precipitation = null;
    if (this.props.rainLvl > 0){
      precipitation = this.props.rainLvl + " in/cm rain";
    } else {
      //todo: find the largest cond and print out if no rain
    }

    return (
      <div className={style.day}>
        &nbsp; {this.props.day}/{this.props.month}
        &nbsp; {/* todo: determine icon */}
        &nbsp; {this.props.high}&deg; / {this.props.low}&deg;
        &nbsp; {precipitation}
      </div>
    )
  }
}
