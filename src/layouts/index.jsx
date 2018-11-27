import styles from "./index.less";
import my from '../assets/svgs/my.svg';
import myHover from '../assets/svgs/my-hover.svg';
import notice from '../assets/svgs/notice.svg';
import noticeHover from '../assets/svgs/notice-hover.svg';
import home from '../assets/svgs/home.svg';
import homeHover from '../assets/svgs/home-hover.svg';
import recommend from '../assets/svgs/recommend.svg';
import recommendHover from '../assets/svgs/recommend-hover.svg';
import { Component } from 'react';
import { connect } from "dva";
import { NavBar, Icon, Toast, Popover, TabBar } from "antd-mobile";
import router from "umi/router";
import withRouter from "umi/withRouter";
import config from "utils/config";
import { TransitionGroup, CSSTransition } from "react-transition-group";

const { prefix, openPages } = config;

const Item = Popover.Item;
const myImg = src => <img src={`https://gw.alipayobjects.com/zos/rmsportal/${src}.svg`} className="am-icon am-icon-xs" alt="" />;
class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'home',
      hidden: false,
      visible: false,
      selected: '',
    };
  }
  onSelect = (opt) => {
    this.setState({
      visible: false,
      selected: opt.props.value,
    });
  };
  handleVisibleChange = (visible) => {
    this.setState({
      visible,
    });
  };
  renderContent(reactNode) {
    return (
      <div style={{ backgroundColor: 'rgb(243, 243, 243)', height: '100%', textAlign: 'center', paddingTop: '0.9rem' }}>
        {reactNode}
      </div>
    );
  }
  render() {
    const { pathname, children, global: { noReadCount, text } } = this.props;
    if (openPages && openPages.includes(pathname)) {
      return <div> {children}</div>;
    }
    const selectPath = pathname.replace('/', '');
    const isHomePage = pathname === "/main" || pathname === "/" || pathname === "/recommend" || pathname === "/notice" || pathname === "/my";

    return (
      <div className={styles.layout} style={{ position: isHomePage ? 'fixed' : 'static' }}>
        <NavBar
          key="navbar"
          mode="dark"
          className={styles.barColor}
          style={{ position: 'fixed', width: '100%', top: 0, zIndex: 99999 }}
          icon={
            isHomePage ? null : (
              <Icon type="left" />
            )
          }
          onLeftClick={() => {
            //这里需要做指定式跳转，手机页面会涉及到用户刷新的问题
            router.go(-1);
          }}
          rightContent={[
            <a key={'navbar1'} href='javascript:void(0);' style={{ color: '#fff' }} onClick={() => {
              window.location.reload()
            }} >刷新</a>
          ]}

        >
          {text}
        </NavBar>

        {isHomePage ?
          (<TabBar
            unselectedTintColor="#949494"
            tintColor="#33A3F4"
            barTintColor="white"
            hidden={this.state.hidden}
          >
            <TabBar.Item
              title="首页"
              key="home"
              icon={{ uri: home }}
              selectedIcon={{ uri: homeHover }}
              selected={selectPath === '' || selectPath === 'main'}
              // badge={1}
              onPress={() => {
                router.replace('/main');
              }}
            >
              {this.renderContent(children)}
            </TabBar.Item>
            <TabBar.Item
              icon={{ uri: recommend }}
              selectedIcon={{ uri: recommendHover }}
              title="推荐学员"
              key="recommend"
              selected={selectPath === 'recommend'}
              onPress={() => {
                router.replace('/recommend');
              }}
            >
              {this.renderContent(children)}
            </TabBar.Item>
            <TabBar.Item
              icon={{ uri: notice }}
              selectedIcon={{ uri: noticeHover }}
              title="通知"
              key="notice"
              dot={noReadCount > 0}
              selected={selectPath === 'notice'}
              onPress={() => {
                router.replace('/notice');
              }}
            >
              {this.renderContent(children)}
            </TabBar.Item>
            <TabBar.Item
              icon={{ uri: my }}
              selectedIcon={{ uri: myHover }}
              title="我的"
              key="my"
              selected={selectPath === 'my'}
              onPress={() => {
                router.replace('/my');
              }}
            >
              {this.renderContent(children)}
            </TabBar.Item>
          </TabBar>) : this.renderContent(children)}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    global: state.global,
    pathname: state.routing.location.pathname
  };
}

const ConnectedLayout = connect(mapStateToProps)(Layout);

export default withRouter(
  ({ location, match, children }) =>
    <TransitionGroup>
      <CSSTransition key={location.key} classNames="fade" timeout={10}>
        <ConnectedLayout>{children}</ConnectedLayout>
      </CSSTransition>
    </TransitionGroup>
)
