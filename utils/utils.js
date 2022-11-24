export const rand = (end, start = 1) => {
   for (let num = Math.floor(Math.random() * (end + 1)); num >= 0; num = Math.floor(Math.random() * (end + 1))) {
      if (num >= start) {
         return num;
      }
   }
}

export const randArr = (arr, start = 0, end = arr.length) => {
   for (let num = Math.floor(Math.random() * end); num >= 0; num = Math.floor(Math.random() * end)) {
      if (num >= start) {
         return arr[num];
      }
   }
}

export const repRegexArr = (arr, re, sub) => {
   return arr.map(el => el.replace(re, sub));
}