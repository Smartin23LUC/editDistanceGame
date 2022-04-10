const levenshtein1 = (a, b) => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  
  let row, prev, next;

  // Space complexity: O(min(a,b)) instead of O(a)
  if (a.length > b.length)
  {
    let tmp = a;
    a = b;
    b = tmp;
  }

  row = Array(a.length + 1);
  for (let i = 0; i <= a.length; i++)
  {
    row[i] = i;
  }

  for (let i = 1; i <= b.length; i++)
  {
    prev = i;
    
    for (let j = 1; j <= a.length; j++)
    {
      if (b[i-1] === a[j-1])
      {
        next = row[j-1];              // -> match
      }
      else
      {
        next = Math.min(row[j-1] + 1, // -> substitution
               Math.min(row[j] + 1,   // -> insertion
                        prev + 1));   // -> deletion
      }
      
      row[j - 1] = prev;
      prev = next;
    }

    row[a.length] = prev;
  }
  
  return row[a.length];
}

const levenshtein2 = (a, b) => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  let value;

  if (a[0] === b[0])
  {
    value = levenshtein2(a.substring(1), b.substring(1));
  }
  else
  {
    let sub = levenshtein2(a.substring(1), b.substring(1)) + 1;
    let ins = levenshtein2(a, b.substring(1)) + 1;
    let del = levenshtein2(a.substring(1), b) + 1;
    
    value = Math.min(sub, Math.min(ins, del));
  }
  
  return value;
}

dist_cache = new Map();

function levenshtein3_reset()
{
    dist_cache.clear();
}

const levenshtein3 = (a, b) => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  let key, value;

  key = a + "#" + b;
  if (dist_cache.has(key))
  {
    value = dist_cache.get(key);
    return value;
  }

  if (a[0] === b[0])
  {
    value = levenshtein3(a.substring(1), b.substring(1));
  }
  else
  {
    let sub = levenshtein3(a.substring(1), b.substring(1)) + 1;
    let ins = levenshtein3(a, b.substring(1)) + 1;
    let del = levenshtein3(a.substring(1), b) + 1;
    
    value = Math.min(sub, Math.min(ins, del));
  }
  
  dist_cache.set(key, value);
  return value;
}

function edit_dist_test(source, target)
{
    var startTime = performance.now();
    const dist1 = levenshtein1(source, target);
    const time1 = performance.now() - startTime;

    var startTime = performance.now();
    const dist2 = levenshtein2(source, target);
    const time2 = performance.now() - startTime;

    var startTime = performance.now();
    const dist3 = levenshtein3(source, target);
    const time3 = performance.now() - startTime;
    levenshtein3_reset();
    
    return [time1, dist1, time2, dist2, time3, dist3];
}
