import Vue from 'vue'
import Router from 'vue-router'
//入口文件
const Entry = () => import('@/components/Entry/entry');

const home = () => import('@/components/content/home');
const content = () => import('@/components/content/transfer');//中转
const batch = () => import('@/components/batch/index');//考试批次管理
const institutionalUser = () => import('@/components/institutionalUser/index');//机构用户管理
const tutor = () => import('@/components/tutor/index');//导师管理
const certificate = () => import('@/components/certificate/index');//证书管理
const cerSetting = () => import('@/components/certificate/setting');//证书管理
const apply = () => import('@/components/certificate/apply');//证书申领
const cerSearch = () => import('@/components/certificate/search');//申领查询
const enroll = () => import('@/components/enroll/index');//报名管理
const enrollIndex = () => import('@/components/enroll/content');//报名管理
const enrollSearch = () => import('@/components/enroll/search');//报名管理-考生查询
const institution = () => import('@/components/institution/index');//机构管理-活动中心
const institutionCenter = () => import('@/components/institution/center');//机构管理-活动中心
const institutionBase = () => import('@/components/institution/base');//机构管理-活动基地
const navigation = () => import('@/components/navigation/index');//一级导航
const navigationFirst = () => import('@/components/navigation/first');//一级导航
const navigationSecond = () => import('@/components/navigation/second');//二级导航
const homePage = () => import('@/components/homePage/index');//首页管理
const banner = () => import('@/components/homePage/banner');//首页管理-轮播
const news = () => import('@/components/homePage/news');//首页管理-测评新闻
const newsIndex = () => import('@/components/homePage/news/index');//首页管理-测评新闻-index
const newsEdit = () => import('@/components/homePage/news/edit');//首页管理-测评新闻-编辑
const notice = () => import('@/components/homePage/notice');//首页管理-测评公告
const noticeIndex = () => import('@/components/homePage/notice/index');//首页管理-测评公告
const noticeEdit = () => import('@/components/homePage/notice/edit');//首页管理-测评公告
const module = () => import('@/components/homePage/module');//首页管理-模块导航
const expert = () => import('@/components/homePage/expert');//首页管理-专家团队
const notes = () => import('@/components/homePage/notes');//首页管理-杂志介绍
const suite = () => import('@/components/homePage/suite');//首页管理-套件展示
const site = () => import('@/components/homePage/site');//首页管理-合作网站
const custom = () => import('@/components/custom/index');//自定义页面
const customIndex = () => import('@/components/custom/page/index');//自定义页面
const customEdit = () => import('@/components/custom/page/edit');//自定义页面
const examine = () => import('@/components/examine/index');//活动中心审核
const examineCenter = () => import('@/components/examine/page/center');//活动中心审核
const examineBase = () => import('@/components/examine/page/base');//活动基地审核
const examineNews = () => import('@/components/examine/page/news');//新闻审核
const examineNotice = () => import('@/components/examine/page/notice');//公告审核
const examineDetail = () => import('@/components/examine/page/detail');//活动中心、活动基地详情
const user = () => import('@/components/user/index');//系统用户管理


Vue.use(Router)

export default new Router({
  linkActiveClass: 'linkActive',
  routes: [
    {
      path: '/',
      redirect: '/entry',
    },
    {
      path: '/entry',
      name: 'entry',
      component: Entry,
      redirect: '/home',
      children: [
        {
          path: '/',
          name: 'home',
          component: home,
          redirect: '/index'
        },
        {
          path: '/index',
          name: 'index',
          component: home
        },
        {
          path: '/content',
          name: 'content',
          redirect: '/batch',
          component: content,
          children: [
            {
              path: '/batch',
              name: 'batch',
              component: batch
            },
            {
              path: '/institutionalUser',
              name: 'institutionalUser',
              component: institutionalUser
            },
            {
              path: '/tutor',
              name: 'tutor',
              component: tutor
            },
            {
              path: '/certificate',
              name: 'certificate',
              redirect: '/certificate/index',
              component: certificate,
              children: [
                {
                  path: '/certificate/index',
                  name: 'cerSetting',
                  component: cerSetting
                },
                {
                  path: '/certificate/apply',
                  name: 'apply',
                  component: apply
                },
                {
                  path: '/certificate/:type/edit',
                  name: 'cerSearch',
                  meta: {
                    other: '申领查询'
                  },
                  component: cerSearch
                }
              ]
            },
            {
              path: '/enroll',
              name: 'enroll',
              redirect: '/enroll/index',
              component: enroll,
              children: [
                {
                  path: '/enroll/index',
                  name: 'enrollIndex',
                  component: enrollIndex
                },
                {
                  path: '/enroll/search',
                  name: 'enrollSearch',
                  meta: {
                    other: '考生查询'
                  },
                  component: enrollSearch
                }
              ]
            },
            {
              path: '/institution',
              name: 'institution',
              redirect: '/institution/center',
              component: institution,
              children: [
                {
                  path: '/institution/center',
                  name: 'institutionCenter',
                  component: institutionCenter
                },
                {
                  path: '/institution/base',
                  name: 'institutionBase',
                  component: institutionBase
                }
              ]
            },
            {
              path: '/navigation',
              name: 'navigation',
              redirect: '/navigation/first',
              component: navigation,
              children: [
                {
                  path: '/navigation/first',
                  name: 'navigationFirst',
                  component: navigationFirst
                },
                {
                  path: '/navigation/second',
                  name: 'navigationSecond',
                  component: navigationSecond
                }
              ]
            },
            {
              path: '/homePage',
              name: 'homePage',
              redirect: '/homePage/banner',
              component: homePage,
              children: [
                {
                  path: '/homePage/banner',
                  name: 'banner',
                  component: banner
                },
                {
                  path: '/homePage/news',
                  name: 'news',
                  redirect: '/homePage/news/index',
                  component: news,
                  children: [
                    {
                      path: '/homePage/news/index',
                      name: 'newsIndex',
                      component: newsIndex
                    },
                    {
                      path: '/homePage/news/:type/edit',
                      name: 'newsEdit',
                      meta: {
                        other: '编辑'
                      },
                      component: newsEdit
                    }
                  ]
                },
                {
                  path: '/homePage/notice',
                  name: 'notice',
                  redirect: '/homePage/notice/index',
                  component: notice,
                  children: [
                    {
                      path: '/homePage/notice/index',
                      name: 'noticeIndex',
                      component: noticeIndex
                    },
                    {
                      path: '/homePage/notice/:type/edit',
                      name: 'noticeEdit',
                      meta: {
                        other: '编辑'
                      },
                      component: noticeEdit
                    }
                  ]
                },
                {
                  path: '/homePage/module',
                  name: 'module',
                  component: module
                },
                {
                  path: '/homePage/expert',
                  name: 'expert',
                  component: expert
                },
                {
                  path: '/homePage/notes',
                  name: 'notes',
                  component: notes
                },
                {
                  path: '/homePage/suite',
                  name: 'suite',
                  component: suite
                },
                {
                  path: '/homePage/site',
                  name: 'site',
                  component: site
                }
              ]
            },
            {
              path: '/custom',
              name: 'custom',
              redirect: '/custom/index',
              component: custom,
              children: [
                {
                  path: '/custom/index',
                  name: 'customIndex',
                  component: customIndex
                },
                {
                  path: '/custom/edit',
                  name: 'customEdit',
                  meta: {
                    other: '编辑'
                  },
                  component: customEdit
                }
              ]
            },
            {
              path: '/examine',
              name: 'examine',
              redirect: '/examine/center',
              component: examine,
              children: [
                {
                  path: '/examine/center',
                  name: 'examineCenter',
                  component: examineCenter
                },
                {
                  path: '/examine/base',
                  name: 'examineBase',
                  component: examineBase
                },
                {
                  path: '/examine/news',
                  name: 'examineNews',
                  component: examineNews
                },
                {
                  path: '/examine/notice',
                  name: 'examineNotice',
                  component: examineNotice
                },
                {
                  path: '/examine/:type/detail',
                  name: 'examineDetail',
                  component: examineDetail
                }
              ]
            },
            {
              path: '/user',
              name: 'user',
              component: user
            }
          ]
        }
      ]
    },
    // {
    //   path: '/login',
    //   name: 'login',
    //   component: Login
    // },
  ]
})
