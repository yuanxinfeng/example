/*
 * @Description: JavaScript中任意两个数加减的解决方案
 * @Author: Jasper
 * @Github: https://github.com/yuanxinfeng
 * @Date: 2019-11-11 09:52:09
 * @LastEditors: Jasper
 * @LastEditTime: 2019-11-11 14:29:02
 */
const MAX = Number.MAX_SAFE_INTEGER;
const MIN = Number.MIN_SAFE_INTEGER;
const intLen = `${MAX}`.length - 1;
/**
 * @Description: 判断输入的数字是否在javascript的安全系数范围内
 * @param { number } 需要检查的数字
 * @return { boolean }: 返回数字是否为安全的整数
 */
function isSafeNumber(num) {
  // 即使 num 成了科学计数法也能正确的和 MAX, MIN 比较大小
  return MIN <= num && num <= MAX;
}
/**
 * @Description: 整数减法函数入口
 * @param { String }: a 相减的第一个整数字符串
 * @param { String }: b 相减的第一个整数字符串
 * @return { string }: 返回计算结果
 */
function intSub(a = "0", b = "0") {
  const newA = `${a}`;
  const newB = Number(b) > 0 ? `-${b}` : `${b}`.slice(1);
  const result = intAdd(newA, newB);
  return result;
}
/**
 * @Description: 计算两个数之和，返回计算结果
 * @param { String }: a 相加的第一个整数字符串
 * @param { String }: b 相加的第一个整数字符串
 * @return { string }: 返回计算结果
 */
function intAdd(a = "", b = "") {
  const statusObj = checkNumber(a, b);
  if (!statusObj.status) {
    return statusObj.data;
  } else {
    let newA, newB, maxLen;
    const tagA = Number(a) < 0,
      tagB = Number(b) < 0;
    let strA = `${a}`,
      strB = `${b}`;
    const reg = /^\-?(\d+)(\.\d+)?e\+(\d+)$/;
    if (reg.test(a) || reg.test(b)) {
      console.warn(
        "由于存在科学计数法，计算结果不一定准确，请转化成字符串后计算"
      );
      strA = strA.replace(reg, function(...rest) {
        const str = rest[2] ? rest[1] + rest[2].slice(1) : rest[1];
        return str.padEnd(Number(rest[3]) + 1, "0");
      });
      strB = strB.replace(reg, function(...rest) {
        const str = rest[2] ? rest[1] + rest[2].slice(1) : rest[1];
        return str.padEnd(Number(rest[3]) + 1, "0");
      });
      maxLen = Math.max(a.length, b.length);
    } else {
      const lenA = tagA ? strA.length - 1 : strA.length;
      const lenB = tagB ? strB.length - 1 : strB.length;
      maxLen = Math.max(lenA, lenB);
    }
    const padLen = Math.ceil(maxLen / intLen) * intLen; // 即为会用到的整个数组长度
    newA = tagA
      ? `-${strA.slice(1).padStart(padLen, "0")}`
      : strA.padStart(padLen, "0");
    newB = tagB
      ? `-${strB.slice(1).padStart(padLen, "0")}`
      : strB.padStart(padLen, "0");
    let result = intCalc(newA, newB);
    // 去掉正负数前面无意义的字符 ‘0’
    const numberResult = Number(result);
    if (numberResult > 0) {
      while (result[0] === "0") {
        result = result.slice(1);
      }
    } else if (numberResult < 0) {
      while (result[1] === "0") {
        result = "-" + result.slice(2);
      }
    } else {
      result = "0";
    }
    console.log(result);
    return result;
  }
}
function intCalc(a, b) {
  let result = "0";
  const intA = Number(a),
    intB = Number(b);
  // 判断是否为安全数，不为安全数的操作进入复杂计算模式
  if (isSafeNumber(intA) && isSafeNumber(intB) && isSafeNumber(intA + intB)) {
    result = `${intA + intB}`;
  } else {
    const sliceA = a.slice(1),
      sliceB = b.slice(1);
    if (a[0] === "-" && b[0] === "-") {
      // 两个数都为负数，取反后计算，结果再取反
      result = "-" + calc(sliceA, sliceB, true);
    } else if (a[0] === "-") {
      // 第一个数为负数，第二个数为正数的情况
      const newV = compareNumber(sliceA, b);
      if (newV === 1) {
        // 由于 a 的绝对值比 b 大，为了确保返回结果为正数，a的绝对值作为第一个参数
        result = "-" + calc(sliceA, b, false);
      } else if (newV === -1) {
        // 道理同上
        result = calc(b, sliceA, false);
      }
    } else if (b[0] === "-") {
      // 第一个数为正数，第二个数为负数的情况
      const newV = compareNumber(sliceB, a);
      if (newV === 1) {
        // 由于 b 的绝对值比 a 大，为了确保返回结果为正数，b的绝对值作为第一个参数
        result = "-" + calc(sliceB, a, false);
      } else if (newV === -1) {
        // 道理同上
        result = calc(a, sliceB, false);
      }
    } else {
      // 两个数都为正数，直接计算
      result = calc(a, b, true);
    }
  }
  return result;
}
/**
 * @Description: 比较两个整数字符串是否正确
 * @param { string }: 比较的第一个整数字符串
 * @param { string }: 比较的第一个整数字符串
 * @return { object }: 返回是否要退出函数的状态和退出函数返回的数据
 */
function checkNumber(a, b) {
  const obj = {
    status: true,
    data: null
  };
  const typeA = typeof a,
    typeB = typeof b;
  const allowTypes = ["number", "string"];
  if (!allowTypes.includes(typeA) || !allowTypes.includes(typeB)) {
    console.error("参数中存在非法的数据，数据类型只支持 number 和 string");
    obj.status = false;
    obj.data = false;
  }
  if (Number.isNaN(a) || Number.isNaN(b)) {
    console.error("参数中不应该存在 NaN");
    obj.status = false;
    obj.data = false;
  }
  const intA = Number(a),
    intB = Number(b);
  if (intA === 0) {
    obj.status = false;
    obj.data = b;
  }
  if (intB === 0) {
    obj.status = false;
    obj.data = a;
  }
  const inf = [Infinity, -Infinity];
  if (inf.includes(intA) || inf.includes(intB)) {
    console.error("参数中存在Infinity或-Infinity");
    obj.status = false;
    obj.data = false;
  }
  return obj;
}
/**
 * @Description: 比较两个整数字符串正负
 * @param { string } a 比较的第一个整数字符串
 * @param { string } b 比较的第二个整数字符串
 * @return { boolean } 返回第一个参数与第二个参数的比较
 */
function compareNumber(a, b) {
  if (a === b) return 0;
  if (a.length > b.length) {
    return 1;
  } else if (a.length < b.length) {
    return -1;
  } else {
    for (let i = 0; i < a.length; i++) {
      if (a[i] > b[i]) {
        return 1;
      } else if (a[i] < b[i]) {
        return -1;
      }
    }
  }
}

/**
 * @Description: 相加的结果
 * @param { string } a 相加的第一个整数字符串
 * @param { string } b 相加的第二个整数字符串
 * @param { string } type 两个参数是 相加（true） 还是相减（false）
 * @return { string } 返回相加的结果
 */
function calc(a, b, type = true) {
  const arr = []; // 保存每个部分计算结果的数组
  for (let i = 0; i < a.length; i += intLen) {
    // 每部分长度 15 的裁取字符串
    const strA = a.slice(i, i + intLen);
    const strB = b.slice(i, i + intLen);
    const newV = Number(strA) + Number(strB) * (type ? 1 : -1); // 每部分的计算结果，暂时不处理
    arr.push(`${newV}`);
  }
  let num = ""; // 连接每个部分的字符串
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] > 0) {
      // 每部分结果大于 0 的处理方案
      const str = `${arr[i]}`;
      if (str.length < intLen) {
        // 长度不足 15 的首部补充字符‘0’
        num = str.padStart(intLen, "0") + num;
      } else if (str.length > intLen) {
        // 长度超过 15 的扔掉第一位，下一部分进位加一
        num = str.slice(1) + num;
        if (i >= 1 && str[0] !== "0") arr[i - 1]++;
        else num = "1" + num;
      } else {
        // 长度等于 15 的直接计算
        num = str + num;
      }
    } else if (arr[i] < 0) {
      // 每部分结果小于 0 的处理方案，借位 10的15次方计算，结果恒为正数，首部填充字符‘0’到15位
      const newV = `${10 ** intLen + Number(arr[i])}`;
      num = newV.padStart(intLen, "0") + num;
      if (i >= 1) arr[i - 1]--;
    } else {
      // 每部分结果等于 0 的处理方案，连续15个字符‘0’
      num = "0".padStart(intLen, "0") + num;
    }
  }
  return num;
}

//测试结果
intSub("9037499254750994", "-9007299251310995");
