import { routerRedux } from 'dva/router';
import {queryMemberConfig, queryMember, addMember, updateMember, checkinMember, findMember, queryCheckin, randomCard, queryHomeCheckin, buyCard, queryCard, transferMember, pauseMember, calcleMember, tMember, cancleMember, activeMember, queryStatisticsUser,
  body_check_query_by_id,
  body_check_add,
  body_check_update,
} from '../services/api';
import { message } from 'antd';
import _ from 'lodash';

export default {
  namespace: 'member',

  state: {
    card_id: '', //905656
    communities: [],
    income_levels: [],
    user_sources: [],

    search_list: [],
    search_from_ts: '',
    search_count: 0,

    member_data: {
      list: [],
      pagination: {},
    },

    checkIn: {
      list: [],
      pagination: {},
    },
    homeCheckIn: {
      list: [],
      count: 0,
    },
    homeActive: 0,

    members: [],
    member_flag: false,
    member: {},

    checkIn_list: [],

    cards: [],

    quickMember: [],

    manage_flag: false,

    statistics: {},

    body_check: {},
  },

  effects: {
    // 获取相关配置
    *config({payload}, {call, put}) {
      const res = yield call(queryMemberConfig, payload);

      if(res.status === 0) {
        yield put({
          type: 'setConfig',
          payload: res.data,
        })
      } else {
        message.error(res.error);
      }
    },
    // 新增用户
    *add({payload}, {call, put}) {
      const res = yield call(addMember, payload);

      if(res.status === 0) {
        message.success("添加会员成功");
        yield put({
          type: 'setMember',
          payload: res.data,
        })
        yield put(routerRedux.push('/member/add/card'));
      } else {
        message.error(res.error);
      }
    },
    // 更新用户
    *editUser({payload}, {call, put}) {
      const res = yield call(updateMember, payload);

      if(res.status === 0) {
        message.success("更新会员成功");
        yield put(routerRedux.push('/member/search'));
      } else {
        message.error(res.error);
      }
    },
    // 获取会员列表
    *search({payload}, {call, put}) {
      const res = yield call(queryMember, payload);

      if(res.status === 0) {
        res.data.page_info.pageSize = payload.page_size;
        res.data.page_info.total = res.data.count;
        yield put({
          type: 'changeSearchList',
          payload: res.data
        });
      } else {
        message.error(res.error);
      }
    },
    // 随机生成卡号
    *random({payload}, {call, put}) {
      const res = yield call(randomCard, payload);

      if(res.status === 0) {
        yield put({
          type: 'setConfig',
          payload: res.data
        })
        yield payload.cb(res.data.card_id);
      } else {
        message.error(res.error);
      }
    },
    *checkinList({payload}, {call, put}) {
      const res = yield call(queryCheckin, payload);
      if(res.status === 0) {
        res.data.page_info.pageSize = payload.page_size;
        res.data.page_info.total = res.data.count;
        yield put({
          type: 'setCheckinList',
          payload: {
            data: res.data
          }
        })
      } else {
        message.error(res.error);
      }
    },
    *homeCheckinList({payload}, {call, put}) {
      const res = yield call(queryHomeCheckin, payload);
      if(res.status === 0) {
        yield put({
          type: 'setHomeCheckinList',
          payload: {
            data: res.data
          }
        })
      } else {
        message.error(res.error);
      }
    },
    *query({payload}, {call, put}) {
      const res = yield call(findMember, payload);
      if(res.status === 0) {
        if(!res.data.user) {
          message.error("未查询到相关数据");
        } else {
          yield put({
            type: 'setMember',
            payload: res.data,
          })
        }
      } else if (res.status === 771) {
        yield put({
          type: 'setMembers',
          payload: res.data,
        })
      } else {
        message.error(res.error);
      }
    },
    *queryToManage({payload}, {call, put}) {
      yield put({
        type: 'setConfig',
        payload: {manage_flag: true}
      })
      console.log('aaa')
      const res = yield call(findMember, payload);
      if(res.status === 0) {
        yield put({
          type: 'setMember',
          payload: res.data,
        })
      } else if (res.status === 771) {
        yield put({
          type: 'setMembers',
          payload: res.data,
        })
      } else {
        message.error(res.error);
      }
    },
    *checkIn({payload}, {call, put}) {
      if(payload.user_id) {
        yield put({
          type: 'setCheckInList',
          payload: {items: []},
        })
      }
      const res = yield call(checkinMember, payload);
      if(res.status === 0) {
        message.success("签到成功");
        yield put({
          type: 'setConfig',
          payload: {
            homeCheckIn: {
              list: [],
              count: 0,
            },
            homeActive: 0,
          }
        })
        yield put({
          type: 'homeCheckinList',
          payload: {}
        });

      } else if (res.status === 771) {
        yield put({
          type: 'setCheckInList',
          payload: res.data,
        })
      } else {
        message.error(res.error);
      }
    },
    *addCard({payload}, {call, put}) {
      const res = yield call(buyCard, payload);
      if(res.status === 0) {
        message.success("添加卡类成功");
        yield put(routerRedux.push('/member/search'));
      } else {
        message.error(res.error);
      }
    },
    *xuCard({payload}, {call, put}) {
      const res = yield call(buyCard, payload);
      if(res.status === 0) {
        message.success("续卡成功");

        yield put({
          type: 'setMember',
          payload: {user: res.data},
        })
      } else {
        mesasge.error(res.error);
      }
    },
    *queryCard({payload}, {call, put}) {
      const res = yield call(queryCard, payload);
      if(res.status === 0) {
        yield put({
          type: 'setCards',
          payload: res.data,
        })
      } else {
        message.error(res.error);
      }
    },
    *transfer({payload}, {call, put}) {
      const res = yield call(transferMember, payload);
      if(res.status === 0) {
        message.success("会员转移成功");
      } else {
        message.error(res.error);
      }
    },
    *tMember({payload}, {call, put}) {
      const res = yield call(tMember, payload);
      if(res.status === 0) {
        message.success("会员转卡成功");
      } else {
        message.error(res.error);
      }
    },
    *pause({payload}, {call, put}) {
      const res = yield call(pauseMember, payload);
      if(res.status === 0) {
        message.success("会员暂停成功");

        yield put({
          type: 'setMember',
          payload: {user: res.data},
        })
      } else {
        message.error(res.error);
      }
    },
    *calcle({payload}, {call, put}) {
      const res = yield call(calcleMember, payload);
      if(res.status === 0) {
        message.success("取消会员暂停成功");

        yield put({
          type: 'setMember',
          payload: {user: res.data},
        })
      } else {
        message.error(res.error);
      }
    },
    *quickQuery({payload}, {call, put}) {
      const res = yield call(findMember, payload);
      if(res.status === 0) {
        if(res.data.user) {
          yield put({
            type: 'setQuickMember',
            payload: res.data,
          })
        }
      } else if (res.status === 771) {
        yield put({
          type: 'setQuickMembers',
          payload: res.data,
        })
      } else {
        message.error(res.error);
      }
    },
    *cancleMember({payload}, {call, put}) {
      const res = yield call(cancleMember, payload);
      if(res.status === 0) {
        message.success("消卡成功");
        yield put({
          type: 'setMember',
          payload: {user: res.data},
        })
      } else {
        message.error(res.error);
      }
    },
    *activeMember({payload}, {call, put}) {
      const res = yield call(activeMember, payload);
      if(res.status === 0) {
        message.success("激活卡成功");
        yield put({
          type: 'setMember',
          payload: {user: res.data},
        })
      } else {
        message.error(res.error);
      }
    },
    *statistics({payload}, {call, put}) {
      const res = yield call(queryStatisticsUser, payload);
      console.log(res);
      if(res.status === 0) {
        yield put({
          type: 'setConfig',
          payload: {statistics: res.data},
        })
      } else {
        message.error(res.error);
      }
    },
    *queryBodyCheckById({payload}, {call, put}) {
      const res = yield call(body_check_query_by_id, payload);
      if(res.status === 0) {
        if(res.data.items) {
          yield put({
            type: 'setConfig',
            payload: {body_check: res.data.items}
          });
        }
      }
    },
    *addBodyCheck({payload}, {call, put}) {
      const res = yield call(body_check_add, payload);
      console.log(res);
    },
    *updateBodyCheck({payload}, {call, put}) {
      const res = yield call(body_check_update, payload);
      console.log(res);
    }
  },

  reducers: {
    setConfig(state, {payload}) {
      return{
        ...state,
        ...payload
      }
    },
    changeSearchList(state, {payload}) {

      return {
        ...state,
        member_data: {
          list: payload.items,
          pagination: {
            total: payload.page_info.total,
            pageSize: payload.page_info.pageSize,
            current: payload.page_info.current_page,
          }
        },

        search_list: payload.items,
        search_from_ts: payload.from_ts,
        search_count: payload.count,
      }
    },
    setCheckinList(state, {payload}) {
      const {data} = payload;
      return {
        ...state,
        checkIn: {
          list: data.items,
          pagination: {
            total: data.page_info.total,
            pageSize: data.page_info.pageSize,
            current: data.page_info.target_page,
          }
        }
      }
    },
    setHomeCheckinList(state, {payload}) {
      const {data} = payload;
      return {
        ...state,
        homeCheckIn: {
          list: data.items,
          count: data.count,
        }
      }
    },
    setMembers(state, {payload}) {
      const {items} = payload;
      return {
        ...state,
        member_flag: true,
        members: items,
        member: {},
      }
    },
    setMember(state, {payload}) {
      let {user} = payload;
      user.teachers = [];
      user.teacher_ids = [];
      if(user.extra_info) {
        for(let i = 0; i < user.extra_info.lesson_subscribes.length; i++) {
          if(_.indexOf(user.teacher_ids, user.extra_info.lesson_subscribes[i].worker_id) < 0) {
            user.teacher_ids.push(user.extra_info.lesson_subscribes[i].worker_id)
            user.teachers.push(user.extra_info.lesson_subscribes[i])
          }
        }
      }
      console.log(user);
      return {
        ...state,
        member_flag: true,
        members: [],
        member: user || {},
      }
    },
    setCards(state, {payload}) {
      let {items} = payload;
      return {
        ...state,
        cards: items
      }
    },
    setCheckInList(state, {payload}) {
      let {items} = payload;
      return {
        ...state,
        checkIn_list: items,
      }
    },
    setData(state, {payload}) {
      return {
        ...state,
        ...payload,
      }
    },
    setQuickMember(state, {payload}) {
      let {user} = payload
      return {
        ...state,
        quickMember: [user],
      }
    },
    setQuickMembers(state, {payload}) {
      let {items} = payload
      return {
        ...state,
        quickMember: items,
      }
    }
  },
}