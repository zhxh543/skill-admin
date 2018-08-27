/*
  validate
  组件引用例：
  import { validateTelephone } from '@/util/validate';
*/

// 验证手机号
export function validateTelephone(telephone) {
  const reg = /^(13[0-9]|15[012356789]|17[0135678]|18[0-9]|14[57])[0-9]{8}$/;
  return reg.test(telephone)
}

//验证座机号
export function validateTel(number) {
  const reg = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
  return reg.test(number);
}

//验证邮编
export function validateCode(code) {
  const reg = /^[1-9][0-9]{5}$/;
  return reg.test(code);
}

// 用户名 用户名需字母开头，并为2-20个可见字符，可包含字母、数字、下划线
export function validateUserName(name) {
  const reg = /^[a-zA-Z][a-zA-Z0-9_]{1,19}$/;
  return reg.test(name)
}

// 真实姓名 真实姓名需为2-10个中文字符
export function validateRealName(name) {
  const reg = /[\\u4e00-\\u9fa5]{2,10}/;
  return reg.test(name)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 密码强度*/
export function validatePassLevel(str) {
  //字母+数字+特殊字符(包括_)，大于8位
  const reg = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%^&*_])[\da-zA-Z~!@#$%^&*_]{8,}$/
  return reg.test(str)
}

/* 正整数*/
export function validateNum(str) {
  let numReg = /^[0-9]\d*$/;//正整数
  return numReg.test(str)
}

/* 正数 */
export function validateNumber(val) {
  let reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
  return reg.test(val);
}

/* 字母数字下划线*/
export function validateIcon(str) {
  //由数字、26个英文字母或者下划线组成的字符串
  const reg = /^([a-z_A-Z-0-9]+)$/
  return reg.test(str)
}

/* 字母数字下划线*/
export function validateLetter(str) {
  //由数字、26个英文字母或者下划线组成的字符串
  const reg = /^\w+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * validate email
 * @param email
 * @returns {boolean}
 */
// 验证邮箱
export function validateEmail(email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

//验证两个日期前后
export function valDate(date1, date2) {
  if (date1 && date2) {
    const val1 = new Date(date1);
    const val2 = new Date(date2);
    return val1 >= val2;
  } else
    return true;
}

//验证字母数字
export function valStr(val) {
  const reg = /^[0-9a-zA-Z]*$/g;
  return reg.test(val);
}

