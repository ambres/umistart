import { connect } from "dva";
import { Component } from "react";
import styles from "./page.less";
import {
  Button,
  List,
  InputItem,
  Toast,
  WhiteSpace,
  WingBlank,
  Modal
} from "antd-mobile";
import { createForm } from "rc-form";
import logo from "../../assets/logo.png";
import router from "umi/router";
import { getLocalStorage } from "../../utils/method";

const isIPhone = new RegExp("\\biPhone\\b|\\biPod\\b", "i").test(
  window.navigator.userAgent
);
let moneyKeyboardWrapProps;
if (isIPhone) {
  moneyKeyboardWrapProps = {
    onTouchStart: e => {
      if (e.cancelable) {
        // 判断默认行为是否已经被禁用
        if (!e.defaultPrevented) {
          e.preventDefault();
        }
      }
    }
  };
}
let siv;
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "money",
      value: "",
      phoneNum: "",
      btnText: "获取验证码",
      timer: 60,
      btnStatus: false,
      clearInterval: false
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.pageData.isSend) {
      this.count();
      this.props.dispatch({ type: "login/setIsSend", payload: false });
    }
  }

  count = () => {
    let { timer } = this.state;
    let siv = setInterval(() => {
      this.setState(
        preState => ({
          timer: preState.timer - 1,
          btnText: `${preState.timer - 1}s重新发送`,
          btnStatus: true
        }),
        () => {
          if (this.state.timer === 0) {
            clearInterval(siv);
            this.setState({
              btnStatus: false,
              btnText: "重新发送",
              timer: 60
            });
          }
        }
      );
    }, 1000);
  };

  // 保存登录
  submitHandle = e => {
    e.preventDefault();
    Toast.loading("登录中", 0, () => { }, true);
    let fields = this.props.form.validateFields;
    fields((errors, values) => {
      if (errors) {
        return;
      }
      if (values.phoneNum == null || /^1[0-9]{10}$/.test(values.phoneNum)) {
        Toast.fail(
          "请输入正确的手机号码！",
          1,
          () => {
            this.phoneRef.focus();
          },
          true
        );
        return false;
      }
      if (!values.validCode || values.validCode == null) {
        Toast.fail(
          "请输入正确的验证码！",
          1,
          () => {
            this.codeRef.focus();
          },
          true
        );
        return false;
      }
      let userInfo = getLocalStorage("userInfo");
      if (!userInfo) {
        Toast.fail(
          "请使用微信客户端！",
          1,
          () => {
            this.codeRef.focus();
          },
          true
        );
        return false;
      }
      values.openID = userInfo.openid;
      values.phoneNum = values.phoneNum.replace(/\s/g, "");
      values.isNeedValidCode = true;
      this.props.dispatch({ type: "login/fetch", payload: values });
    });
  };
  // 发送验证码
  sendSms = () => {
    Toast.loading("验证码发送中", 0, () => { }, true);
    let { getFieldValue } = this.props.form;
    let phoneNum = getFieldValue("phoneNum");
    if (phoneNum == null || /^1[0-9]{10}$/.test(phoneNum)) {
      Toast.fail(
        "请输入正确的手机号码！",
        1,
        () => {
          this.phoneRef.focus();
        },
        true
      );
      return false;
    }
    this.props.dispatch({
      type: "login/sendSms",
      payload: { phone: phoneNum.replace(/\s/g, "") }
    });
  };

  render() {
    const { getFieldProps } = this.props.form;
    const { type, count } = this.state;
    return (
      <div>
        <div className={`${styles["header"]}`}>
          <div className={`${styles["content"]}`}>
            <img src={logo} alt="" />
            <WhiteSpace size="md" />
            <p>佰平学生端登录</p>
          </div>
        </div>
        <List>
          <InputItem
            {...getFieldProps("phoneNum")}
            type="phone"
            placeholder="请输入手机号码"
            ref={el => (this.phoneRef = el)}
          >
            手机号码
          </InputItem>
          <InputItem
            {...getFieldProps("validCode")}
            type={type}
            placeholder="请输入验证码"
            clear
            moneyKeyboardWrapProps={moneyKeyboardWrapProps}
            className={`${styles["am-list-item"]}`}
            moneyKeyboardAlign="left"
            ref={el => (this.codeRef = el)}
            extra={
              <Button
                type="ghost"
                size="small"
                onClick={this.sendSms}
                disabled={this.state.btnStatus}
              >
                {this.state.btnText}
              </Button>
            }
          />
        </List>
        <WhiteSpace size="xl" />
        <WingBlank size="xl">
          <Button type="primary" onClick={this.submitHandle}>
            登录
          </Button>
        </WingBlank>
      </div>
    );
  }
}

const LoginForm = createForm()(Login);

export default connect(state => {
  return {
    pageData: state.login
  };
})(LoginForm);
