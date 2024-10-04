import React from 'react'
import { Table, Tooltip } from 'antd'
import moment from 'moment'
import classNames from 'classnames/dedupe'
import { StateWrapper } from '../state-wrapper'
import ZPhoneWrapper from '../z-phone'
import ZPagination from '../z-pagination'
import { isEmpty, isObject, convertChildrenToColumns } from './util'
import styles from './styles.styl'

const cx = classNames.bind(styles)
const COLUMNTYPE = {
  DATE: 'date',
  TIME: 'time',
  DATETIME: 'datetime',
}

/**
 * Table下Column只是语法糖，最终都会转化成columns属性
 * https://github.com/ant-design/ant-design/blob/HEAD/components/table/Column.tsx
 */
export class ZColumn extends React.Component {
  render() {
    return null
  }
}

class ZTable extends React.Component {
  static defaultProps = {
    loading: false,
    total: 0,
    pageNo: 1,
    pageSize: 10
  }

  constructor(props) {
    super(props)
  }

  onPageChange = async (page, size) => {
    let { onLoadData, pageSize } = this.props
    let pageNo = page
    if (size !== pageSize) pageNo = 1
    onLoadData?.({ pageNo, pageSize: size })
  }

  isDate = type => {
    return type === COLUMNTYPE.DATE
      || type === COLUMNTYPE.DATETIME
      || type === COLUMNTYPE.TIME
  }

  renderDate = (type, text, format) => {
    let txt
    switch (type) {
      case COLUMNTYPE.DATE:
        txt = moment(text).format(format || 'YYYY-MM-DD')
        break
      case COLUMNTYPE.TIME:
        txt = moment(text).format(format || 'HH:mm:ss')
        break
      case COLUMNTYPE.DATETIME:
        txt = moment(text).format(format || 'YYYY-MM-DD HH:mm:ss')
        break
      default:
        txt = text
    }
    return txt
  }

  renderColumn = (props, text, record) => {
    let { ellipsis, type, format, render } = props
    if (type === 'phone') {
      return <ZPhoneWrapper value={text} />
    }
    if (typeof render === 'function') {
      text = render(text, record)
    }
    if (this.isDate(type)) {
      text = this.renderDate(type, text, format)
    }
    if (isEmpty(text)) return '--'
    if (ellipsis) {
      text = (typeof text !== 'string' && !React.isValidElement(text))
        ? text
        : <Tooltip placement='bottom' title={text}>
          <span>{text}</span>
        </Tooltip>
    }
    return text
  }

  getColumns = () => {
    let { children } = this.props
    return convertChildrenToColumns(children, { render: this.renderColumn })
  }

  render() {
    let { total, pageNo, pageSize, loading, pagination = {}, bordered = false, ...rest } = this.props
    let columns = this.getColumns()

    return (
      <div className={bordered ? 'z-border-table-wrapper' : 'z-table-wrapper'}>
        <Table
          columns={columns}
          // bordered={false}
          {...rest}
          pagination={false}
          loading={{
            spinning: loading,
            indicator: <StateWrapper state='loading' size='small' message='' />
          }}
          rowClassName={(record, index) => {
            let className = 'z-table-light-row';
            if (index % 2 === 1 && !bordered) className = 'z-table-dark-row';
            return className;
          }}
        />
        {!!pagination &&
          <div className='z-table-pagination'>
            <ZPagination
              showSizeChanger={true}
              pageSize={pageSize}
              current={pageNo}
              total={total}
              showTotal={(total) => `共${total}条`}
              onChange={this.onPageChange}
              {...pagination}
            />
          </div>
        }
      </div>
    )
  }
}

ZTable.Column = ZColumn
export default ZTable
