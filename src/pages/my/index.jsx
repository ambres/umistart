import { Component } from 'react';
import { connect } from 'dva';
import styles from './page.less';
import { Button, List, WhiteSpace, Result, Toast } from 'antd-mobile';
import router from "umi/router";
import { getLocalStorage } from "../../utils/method";

const Item = List.Item;
const Brief = Item.Brief;

class App extends Component {
  render() {
    let userInfo = getLocalStorage("userInfo");
    return (
      <div className={styles.myConSty}>
        <WhiteSpace size="lg" />
        {userInfo ? <Result
          imgUrl={userInfo.headimgurl}
          title={userInfo.name}
          message={userInfo.nickname}
        /> : <Result
            imgUrl='http://cdn.bp668.com/cjlg6rokd000aqwog1enqvfiv'
            title="名字"
            message='学生学生学生'
          />}
        <WhiteSpace size="lg" />
        <Item arrow="horizontal" thumb={<i className={`${styles.icon} icon iconfont icon-icon icon-kechenganpai`}></i>} onClick={() => {
          Toast.fail("暂无数据", 2);
        }}>我的考勤</Item>
        <Item arrow="horizontal" thumb={<i className={`${styles.icon} icon iconfont icon-icon icon-chengji`}></i>} onClick={() => {
          Toast.fail("暂无数据", 2);
        }}>我的成绩</Item>
        <Item arrow="horizontal" thumb={<i className={`${styles.icon} icon iconfont icon-icon icon-wodedangan`}></i>} onClick={() => {
          router.push("/studentarchive");
        }}>我的档案</Item>
        <Item arrow="horizontal" thumb={<i className={`${styles.icon} icon iconfont icon-icon icon-daifukuan`}></i>} onClick={() => {
          router.push('/myfinance');
        }}>我的财务</Item>
        <WhiteSpace size="xl" />
        <Item arrow="horizontal" thumb={<i className={`${styles.icon} icon iconfont icon-icon icon-selectionfill`}></i>} onClick={() => {
          router.push("/findcourse");
        }}>精品课程推荐</Item>
        {/* <Item arrow="horizontal" thumb={<i className={`${styles.icon} icon iconfont icon-icon icon-kechenganpai`}></i>} onClick={() => {
          router.replace("/login");
        }}>暂时的登录</Item> */}
        <WhiteSpace size="lg" />
      </div>
    );
  }
}

export default connect(state => {
  return {
    pageData: state.my
  };
})(App);
