export function myClone(arg) {
  let a = JSON.stringify(arg);
  return (JSON.parse(a));
}

export function removeItem(arr) {
  // removeItem(array, item) - удаление item из массива array
  let what, a = arguments, L = a.length, ax;
  while (L > 1 && arr.length) {
    what = a[--L];
    while ((ax= arr.indexOf(what)) !== -1) {
      arr.splice(ax, 1);
    }
  }
  return arr;
}

export function checkDate(year, month, day) {
  let date = new Date(year, month-1, day);
  return (date.getFullYear() === parseInt(year, 10)) &&
    (date.getMonth() + 1 === parseInt(month, 10)) &&
    (date.getDate() === parseInt(day, 10));
}

export function blockBailAndCost(block) {
  let bail = 0,  // залог за все товары блока
    cost = 0,  // плата за аренду всех товаров в блоке
    s_from = block['from'].split(/[.,]/),
    start = new Date(s_from[2], s_from[1]-1, s_from[0]),
    s_to = block['to'].split(/[.,]/),
    stop = new Date(s_to[2], s_to[1]-1, s_to[0]),
    oneDay = 24*60*60*1000,
    diffDays = Math.round((stop-start)/oneDay),
    ok = checkDate(s_from[2], s_from[1], s_from[0])
      && checkDate(s_to[2], s_to[1], s_to[0])
      && (diffDays > 0);
  block['units'].forEach((item)=>{
    bail += parseInt(item['order-count']) * parseInt(item['data']['bail']);
    if (diffDays <= 0) {
      cost = "...";
    } else {
      cost += parseInt(item['order-count']) * (parseInt(item['data']['first-day-cost']) + (diffDays-1) * parseInt(item['data']['day-cost']));
    }
  });

  if (isNaN(bail)) {
    bail = "...";
  }
  if (isNaN(cost)) {
    cost = "...";
  }
  return {
    bail: bail,
    cost: cost,
    ok: ok
  }
}
