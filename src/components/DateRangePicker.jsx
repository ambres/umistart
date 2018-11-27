import {Component} from 'react';
import Proptypes from 'prop-types';
import {List, DatePicker, Icon, Toast} from 'antd-mobile';
import styles from './DateRangePicker.less';


const CustomChildren = ({ extra, onClick, children }) => (
  <div
    onClick={onClick}
    style={{ display: 'inline-block', backgroundColor: '#fff', padding: '.1rem 0'}}
  >
    {children}
    <span style={{ display: 'inline-block', color: '#888', minWidth: '1.6rem', lineHeight: '.5rem', border: '.01rem solid #ddd'}}>
      <span>{extra}</span>
    </span>
  </div>
);

class DateRangePicker extends Component {
  
  state = {
    startDate: null,
    endDate: null
  }
  
  componentWillMount() {
    if (this.props.defaultValue) {
      this.state.startDate = this.props.defaultValue[0]
      this.state.endDate = this.props.defaultValue[1]
    }
  }
  
  UNFASE_componentWillMount() {
    const {defaultValue} = this.props;
    let newState = {}
    if (Array.isArray(defaultValue) && defaultValue.length === 2) {
      newState = {startDate: defaultValue[0], endDate: defaultValue[1]};
    } else {
      
      newState.endDate = new Date();
      const now = new Date();
      
      let millisecond = now.getTime();
      let diff = 30 * 24 * 60 *60 * 1000; //ms, 30 day;
      
      now.setTime(millisecond - diff);
      newState.startDate = now;
    }
    
    this.setState(newState);
  }
  
  compareDate = (d1, d2) => {
    let dateString1 = `${d1.getFullYear()}${d1.getMonth()+1}${d1.getDate()}`;
    let dateString2 = `${d1.getFullYear()}${d1.getMonth()+1}${d1.getDate()}`;
    
    return d1 > d2;
  }
  
  startDateChange = (startDate) => {
    const {endDate} = this.state;
    
    let newState = {startDate, endDate};
    if (this.compareDate(startDate, endDate)) {
      newState = {
        endDate: startDate,
        startDate: endDate
      }
    }
    
    this.setState(newState);
    this.props.onChange && this.props.onChange([newState.startDate, newState.endDate]);
  }
  
  endDateChange = (endDate) => {
    const {startDate} = this.state;
    
    let newState = {startDate, endDate};
    if (this.compareDate(startDate, endDate)) {
      newState = {
        startDate: endDate,
        endDate: startDate
      }
    }
    
    this.setState(newState);
    this.props.onChange && this.props.onChange([newState.startDate, newState.endDate]);
  }
  
  render() {
    const {mode, extra, format, defaultValue} = this.props;
    
    const datePickerProps = {
      mode: mode || "datetime",
    }
    
    return (
      <div className={styles['com-date-range-picker']}>
        <div className={styles['box-date-picker']}>
          <DatePicker
            {...datePickerProps}
            value={this.state.startDate}
            onChange={this.startDateChange}
          >
            <CustomChildren>开始日期：</CustomChildren>
          </DatePicker>
        </div>
        <div className={styles['box-date-picker']}>
          <DatePicker
            {...datePickerProps}
            value={this.state.endDate}
            onChange={this.endDateChange}
          >
            <CustomChildren>结束日期：</CustomChildren>
          </DatePicker>
        </div>
      </div>
    )
  }
}

DateRangePicker.Proptypes = {
  onChange: Proptypes.func.isRequired,
  defaultValue: Proptypes.array
}

export default DateRangePicker;


