export default {
  menus: [
    {
      text: '关于佰平',
      iconClassName: 'icon-guanyuwomen',
      url: '/about'
    },
    {
      text: '我的考勤',
      iconClassName: 'icon-wodekaoqin',
      url: '/myattendance'
    },
    {
      text: '我的成绩',
      iconClassName: 'icon-chengji',
      url: '/mygrade'
    },
    {
      text: '优惠报名',
      iconClassName: 'icon-baoming',
      url: '/about'
    },
    {
      text: '微沟通',
      iconClassName: 'icon-goutong',
      url: '/about'
    },
    {
      text: '我的档案',
      iconClassName: 'icon-wodedangan',
      url: '/myarchives'
    },
    {
      text: '扫码签到',
      iconClassName: 'icon-saomaqiandao',
      url: '/about'
    },
    {
      text: '我的账务',
      iconClassName: 'icon-wodezhangwu',
      url: '/mybills'
    },
    {
      text: '课程安排',
      iconClassName: 'icon-kechenganpai',
      url: '/about'
    },
    {
      text: '学员须知',
      iconClassName: 'icon-xuzhi1',
      url: '/about'
    },
    {
      text: '云课堂',
      iconClassName: 'icon-ketang',
      url: 'http://www.bp668.com/'
    },
    {
      text: '我的学历',
      iconClassName: 'icon-xueli',
      url: '/about'
    },
    {
      text: '资料下载',
      iconClassName: 'icon-xuexiwenjianziliaoxiazai',
      url: '/about'
    },
    {
      text: '院校介绍',
      iconClassName: 'icon-yuanxiaojieshao',
      url: '/about'
    },
    {
      text: '佰平官网',
      iconClassName: 'icon-guanwang',
      url: 'http://www.baiping.org/'
    },
    {
      text: '评价老师',
      iconClassName: 'icon-evaluate',
      url: '/about'
    }
  ],
  myCourses: [
    {
      guid: 'xxxx-xxxx-xxxx-xxfj',
      courseName: '初级会计实务'
    },
    {
      guid: 'xxxx-xxxx-xxxx-xxfj',
      courseName: '经济法基础'
    },
    {
      guid: 'xxxx-xxxx-xxxx-xxfj',
      courseName: '中级会计实务'
    },
    {
      guid: 'xxxx-xxxx-xxxx-xxfj',
      courseName: '中级经济法'
    },
    {
      guid: 'xxxx-xxxx-xxxx-xxfj',
      courseName: '中级财务管理'
    }
  ],
  attendanceDetail: {
    guid: 'xxxx-xxxx-xxxx-xxfj',
    courseName: '初级会计实务',
    attendanceRecords: [
      {
        date: '8月1日',
        hasAttended: true,
        shouldAttendTimes: 1,
        hasAttendTimes: 1
      },
      {
        date: '8月2日',
        hasAttended: true,
        shouldAttendTimes: 1,
        hasAttendTimes: 1
      },
      {
        date: '8月3日',
        hasAttended: false,
        shouldAttendTimes: 1,
        hasAttendTimes: 1
      },
      {
        date: '8月4日',
        hasAttended: true,
        shouldAttendTimes: 1,
        hasAttendTimes: 1
      },
      {
        date: '8月5日',
        hasAttended: true,
        shouldAttendTimes: 1,
        hasAttendTimes: 1
      },
      {
        date: '8月6日',
        hasAttended: false,
        shouldAttendTimes: 1,
        hasAttendTimes: 0
      },
      {
        date: '8月7日',
        hasAttended: true,
        shouldAttendTimes: 1,
        hasAttendTimes: 1
      },
      {
        date: '8月8日',
        hasAttended: true,
        shouldAttendTimes: 1,
        hasAttendTimes: 1
      },
      {
        date: '8月9日',
        hasAttended: false,
        shouldAttendTimes: 1,
        hasAttendTimes: 1
      }
    ]
  },
  archivesDetail: {
    name: '天天',
    studentNo: '',
    idCard: '',
    attendedCourses: ["初级会计实务", "中级会计实务"],
    accountAndPassword: [
      {
        title: '职称成绩查询账号',
        username: 'ttian',
        password: '123456'
      },
      {
        title: '成人高考成绩查询账号',
        username: 'ttian',
        password: '123456'
      }
    ]
  },
  gradeDetail: {
  
  }
}
