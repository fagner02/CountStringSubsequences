class item {
  letter: number;
  code: number = -1;
  prev: number;
  value: number;
  count: number = 1;
  constructor(letter: number, prev: number, value: number = 0) {
    this.letter = letter;
    this.prev = prev;
    this.value = value;
  }
}

function findSub(main: string, sub: string) {
  let previous: item;
  let subMap: any = {};

  subMap[-1] = new item(-1, -1, 1);

  for (var i = 0; i < sub.length; i++) {
    let charCodeAt: number = sub.charCodeAt(i);

    let index = charCodeAt;
    let last = subMap[index];
    if (last != undefined) {
      index = index + last!.count * 256;
      last!.count++;
    }

    previous = i == 0 ? new item(index, -1) : new item(index, previous!.letter);
    previous.code = charCodeAt;

    subMap[index] = previous;
  }

  for (let i = 0; i < main.length; i++) {
    var index = main.charCodeAt(i);
    let current = subMap[index];
    if (current == undefined) {
      continue;
    }
    let initial = current.count;
    let last = subMap[current.prev].value;
    for (let k = 0; k < initial; k++) {
      let current = subMap[index];
      let newLast = current.value;
      let prev = subMap[current.prev];
      if (current.code != prev.code) {
        current.value += prev.value;
      } else {
        current.value += last;
      }
      last = newLast;
      index += 256;
    }
  }
  return previous!.value;
}

function countDynamicPrograming(a: string, b: string) {
  var m = a.length;
  var n = b.length;

  var lookup = Array(m + 1);
  for (var i = 0; i < m + 1; i++) lookup[i] = Array(n + 1).fill(0);

  for (i = 0; i <= n; ++i) lookup[0][i] = 0;

  for (i = 0; i <= m; ++i) lookup[i][0] = 1;

  for (i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a.charAt(i - 1) == b.charAt(j - 1))
        lookup[i][j] = lookup[i - 1][j - 1] + lookup[i - 1][j];
      else lookup[i][j] = lookup[i - 1][j];
    }
  }
  return lookup[m][n];
}

function count(a: any, b: any, m: any, n: any): number {
  if (n == 0) return 1;

  if (m == 0) return 0;

  if (a[m - 1] == b[n - 1])
    return count(a, b, m - 1, n - 1) + count(a, b, m - 1, n);
  else return count(a, b, m - 1, n);
}
