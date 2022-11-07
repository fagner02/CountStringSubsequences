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

async function findSub(main: string, sub: string) {
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

async function count(a: any, b: any, m: any, n: any): Promise<number> {
  if (n == 0) return 1;

  if (m == 0) return 0;

  if (a[m - 1] == b[n - 1])
    return (await count(a, b, m - 1, n - 1)) + (await count(a, b, m - 1, n));
  else return count(a, b, m - 1, n);
}
