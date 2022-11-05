function three(a: string, b: string) {
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
