import React from 'react'
import { DatePicker, Button } from 'antd'
import classNames from 'classnames/bind'
import moment from 'moment'
import ZModal from '../z-modal'
import styles from './styles.styl'

const cx = classNames.bind(styles)

export default class ModalDatePicker extends React.Component {
  static defaultProps = {
    title: '请选择时间',
    visible: false,
    format: 'YYYY-MM-DD',
    value: [],
    defaultValue: [],
    modalProp: {},
    onChange: () => { },
    onOk: () => { },
    onCancel: () => { }
  }

  constructor(props) {
    super(props)
    let { value, defaultValue, format } = props
    let val = value.length ? value : defaultValue
    let [start, end] = val
    this.state = {
      disabled: true,
      date: [start, end],
      dateStr: [
        start ? moment(start).format(format) : '',
        end ? moment(end).format(format) : '',
      ]
    }
  }

  onFooterRangeChange = e => {
    let { dataset: { i } } = e.target
    let { format, onOk } = this.props
    let end = moment()
    let range = i == 2 ? 'y' : i == 1 ? 'M' : 'w'
    let start = moment().subtract(1, range)
    //往前加了一天 by-xhc
    start = start.add(1, 'days')
    onOk?.([start, end], [start.format(format), end.format(format)])
  }

  onCalendarChange = (date, dateStr, info) => {
    let { onCalendarChange } = this.props
    let [start, end] = date
    if (!start || !end) {
      this.setState({ date, dateStr, disabled: true })
    } else {
      this.setState({ date, dateStr, disabled: false })
    }
    onCalendarChange?.(date, dateStr, info)
  }

  onOk = () => {
    let { onOk } = this.props
    let { date, dateStr } = this.state
    onOk?.(date, dateStr)
  }

  renderFooter = () => {
    let { onCancel } = this.props
    let { disabled } = this.state
    return (
      <div className={cx('zmodal-date-picker-footer')}>
        <div className={cx('footer-range')}>
          {['最近一周', '最近一月', '最近一年'].map((r, i) => {
            return <span key={i} data-i={i} onClick={this.onFooterRangeChange}>{r}</span>
          })}
        </div>
        <div className={cx('footer-buttons')}>
          <Button onClick={onCancel}>取消</Button>
          <Button type='primary' onClick={this.onOk} disabled={disabled}>确定</Button>
        </div>
      </div>
    )
  }

  render () {
    let { visible, title, modalProp, onOk, onCancel, onCalendarChange, onChange, ...rest } = this.props
    return (
      <ZModal
        visible={visible}
        className={cx('zmodal-date-picker')}
        title={title}
        width={611}
        bodyStyle={{ padding: 24, height: 358 }}
        footer={this.renderFooter()}
        onCancel={onCancel}
        {...modalProp}>
        <div className={cx('date-picker-wrapper')}>
          <div className={cx('picker-item')}>
            <label className={cx('z-date-picker-label')}>开始时间：</label>
            <label className={cx('z-date-picker-label', 'label-end')}>结束时间：</label>
            <DatePicker.RangePicker
              open
              inputReadOnly
              ref={this.datePickerRef}
              className={cx('z-date-picker')}
              dropdownClassName={cx('date-picker-popup')}
              showToday={false}
              placeholder={['请选择开始时间', '请选择结束时间']}
              getPopupContainer={trigger => trigger}
              onCalendarChange={this.onCalendarChange}
              {...rest} />
          </div>
        </div>
      </ZModal>
    )
  }
}
