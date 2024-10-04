import React from 'react'
import { Row, Col, Tooltip, Image, Rate } from 'antd'
import classNames from 'classnames/dedupe'
import ZPhoneWrapper from '../z-phone'
import styles from './styles.styl'

const cx = classNames.bind(styles)

export default class ZDetailCard extends React.PureComponent {
  static defaultProps = {
    detailCardInfo: [],
  }

  render() {
    let { detailCardInfo } = this.props
    return (
      <div className={cx('detail-card-wrapper-new')}>
        {detailCardInfo.map((item, rowIndex) => {
          let detailCardRow = item
          return (
            <Row gutter={16} className={cx('card-row')} key={rowIndex}>
              {detailCardRow.map((item, colIndex) => {
                let { label, content, colSpan, type = 'string', required = false, labelPadding = false, isShow = true, colon = true } = item
                if (!isShow) return
                return (
                  <Col span={colSpan} className={cx('card-col')} key={colIndex}>
                    <span className={cx('card-label')}>{label}{colon ? '：' : ''}</span>
                    {type == 'phone' &&
                      <span className={cx('card-string-content')}>{content || '--'}</span>
                    }
                    {type == 'string' &&
                      <Tooltip title={content}>
                        <span className={cx('card-string-content')}>{content || '--'}</span>
                      </Tooltip>
                    }
                    {type == 'rate' &&
                      <span className={cx('card-string-content')}>
                        <Rate disabled value={content} />
                      </span>
                    }
                    {type == 'image' &&
                      <div className={cx('card-image-content')}>
                        {content && content.length && content.length != 0
                          ? <div className={cx('image-list')}>
                            {content.map((item, index) => {
                              return (
                                <div className={cx('image-item')} key={index}>
                                  <Image src={item} key={index} />
                                </div>
                              )
                            })}
                          </div>
                          : <div className={cx('image-empty')}>
                            <img src='https://oss-static.eaiot.cloud/aiot-factory-web/2021-04-13-none／photo@2x-1618291984280.png' />
                            <span>暂无图片</span>
                          </div>
                        }
                      </div>
                    }
                  </Col>
                )
              })}
            </Row>
          )
        })}
      </div>
    )
  }
}
