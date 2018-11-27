import { Component } from 'react';
import { connect } from 'dva';
import styles from './page.less';
import { Grid, Carousel, WingBlank, WhiteSpace, Toast, ActivityIndicator } from 'antd-mobile';
import router from 'umi/router';
import { staticServer } from '../../utils/config';

class Main extends Component {
 
  gridItemRender = (item) => {
    return (
      <a className={styles['box-menu-item']} href="javascript:void(0)" onClick={this.itemClick.bind(this, item)} style={{ display: 'inline-block', width: '100%', height: '180' }}>
        <i className={`${styles.icon} icon iconfont icon-${item.icon}`}></i>
        {item.name}
      </a>
    )
  }

  render() {
    let { bannerAll, menuAll } = this.props.global;
    let {global: {toastLoading}} = this.props;
    
    let indicatorProps = toastLoading ? {toast: true, animating: true, text: '加载中...'} : {animating: false, text: ''};
    
    return (
      <div className={styles['container-main-page']}>
        <WingBlank>
          <WhiteSpace size="lg" />
          <Carousel
            autoplay={false}
            infinite
            slideWidth={1}
          >
            {bannerAll.map(val => {
              return (
                <a
                  key={val.guid}
                  href={val.url}
                  style={{ display: 'inline-block', width: '100%'}}
                >
                  <img
                    src={`${staticServer}${val.pic}`}
                    alt={val.name}
                    style={{ width: '100%', verticalAlign: 'top', height: '100%' }}
                    onLoad={() => {
                      // fire window resize event to change height
                      window.dispatchEvent(new Event('resize'));
                    }}
                  />
                </a>
              )
            })}
          </Carousel>
          <WhiteSpace size="lg" />
          <Grid
            data={menuAll}
            columnNum={4}
            renderItem={this.gridItemRender}
          />
          <ActivityIndicator {...indicatorProps} />
        </WingBlank>
      </div>
    );
  }
}

export default connect(state => {
  return {
    main: state.main,
    global: state.global,
  };
})(Main);
