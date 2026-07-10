// Registry: metadata + setup() for every algorithm shown on the site.
// setup(container) must return { steps, render(step) }.

const ALGORITHMS = [
  // ---------------- Sorting ----------------
  {
    id: 'bubble', category: 'sorting', categoryLabel: 'Sorting',
    title: 'Bubble Sort', tags: ['O(n²)', 'In-place', 'Stable'],
    desc: 'Compare each pair of adjacent elements and swap them if out of order, repeating passes until the array is sorted.',
    time: 'O(n²)', space: 'O(1)',
    steps: [
      'Scan the array, comparing 2 adjacent elements.',
      'If the earlier element is bigger than the next, swap them.',
      'After each pass, the largest element "bubbles" to the end.',
      'Repeat until no swaps happen in a full pass.',
    ],
    setup: (c) => setupSortVisual(c, 'bubble'),
  },
  {
    id: 'selection', category: 'sorting', categoryLabel: 'Sorting',
    title: 'Selection Sort', tags: ['O(n²)', 'In-place'],
    desc: 'On each pass, find the smallest element in the unsorted part and move it into its correct position.',
    time: 'O(n²)', space: 'O(1)',
    steps: [
      'Treat the array as sorted and unsorted parts.',
      'Find the smallest element in the unsorted part.',
      'Swap it with the first element of the unsorted part.',
      'Grow the sorted part by one element and repeat.',
    ],
    setup: (c) => setupSortVisual(c, 'selection'),
  },
  {
    id: 'insertion', category: 'sorting', categoryLabel: 'Sorting',
    title: 'Insertion Sort', tags: ['O(n²)', 'Stable'],
    desc: 'Build the sorted array one element at a time, inserting each new element into its correct position.',
    time: 'O(n²)', space: 'O(1)',
    steps: [
      'Start at the 2nd element, treating the 1st as sorted.',
      'Compare the current element with the ones before it.',
      'Shift larger elements to the right to make room.',
      'Insert the current element into its correct spot.',
    ],
    setup: (c) => setupSortVisual(c, 'insertion'),
  },
  {
    id: 'merge', category: 'sorting', categoryLabel: 'Sorting',
    title: 'Merge Sort', tags: ['O(n log n)', 'Divide & Conquer'],
    desc: 'Split the array into two halves, recursively sort each half, then merge the two sorted halves back together.',
    time: 'O(n log n)', space: 'O(n)',
    steps: [
      'Split the array into two equal halves.',
      'Recursively sort each half down to single elements.',
      'Merge the two sorted halves: compare the fronts, take the smaller.',
      'Repeat until the whole array is merged.',
    ],
    setup: (c) => setupSortVisual(c, 'merge'),
  },
  {
    id: 'quick', category: 'sorting', categoryLabel: 'Sorting',
    title: 'Quick Sort', tags: ['O(n log n)', 'In-place'],
    desc: 'Pick a pivot element, partition the array around it, then recursively sort the two partitions.',
    time: 'O(n log n) avg', space: 'O(log n)',
    steps: [
      'Pick the last element as the pivot.',
      'Scan the array, moving elements smaller than the pivot to the left.',
      'Place the pivot into its correct spot between the two partitions.',
      'Recursively quick sort the left and right partitions.',
    ],
    setup: (c) => setupSortVisual(c, 'quick'),
  },

  // ---------------- Searching ----------------
  {
    id: 'linear', category: 'searching', categoryLabel: 'Searching',
    title: 'Linear Search', tags: ['O(n)', 'No sorting needed'],
    desc: 'Scan through every element of the array in order until the target value is found.',
    time: 'O(n)', space: 'O(1)',
    steps: [
      'Start at the first element of the array.',
      'Compare the current element with the target value.',
      'If it matches, return that position.',
      'Otherwise, move to the next element until the end.',
    ],
    setup: (c) => setupSearchVisual(c, 'linear'),
  },
  {
    id: 'binary', category: 'searching', categoryLabel: 'Searching',
    title: 'Binary Search', tags: ['O(log n)', 'Requires sorted array'],
    desc: 'Repeatedly halve the search range based on comparing with the middle element — only works on a sorted array.',
    time: 'O(log n)', space: 'O(1)',
    steps: [
      'Find the middle element (mid) of the range [lo, hi].',
      'If arr[mid] equals the target → found.',
      'If arr[mid] is smaller → narrow the range to the right half.',
      'If arr[mid] is bigger → narrow the range to the left half, repeat.',
    ],
    setup: (c) => setupSearchVisual(c, 'binary'),
  },

  // ---------------- Data structures ----------------
  {
    id: 'stack', category: 'structures', categoryLabel: 'Data Structures',
    title: 'Stack', tags: ['LIFO', 'O(1) push/pop'],
    desc: 'A LIFO (Last In First Out) data structure — the most recently added element is the first one removed.',
    time: 'O(1)', space: 'O(n)',
    steps: [
      'push(x): add element x onto the top of the stack.',
      'pop(): remove and return the element at the top.',
      'peek(): view the top element without removing it.',
      'Only one end can be touched — the top of the stack.',
    ],
    setup: (c) => setupStackQueueVisual(c, 'stack'),
  },
  {
    id: 'queue', category: 'structures', categoryLabel: 'Data Structures',
    title: 'Queue', tags: ['FIFO', 'O(1) enqueue/dequeue'],
    desc: 'A FIFO (First In First Out) data structure — the element added first is the first one removed.',
    time: 'O(1)', space: 'O(n)',
    steps: [
      'enqueue(x): add element x to the rear of the queue.',
      'dequeue(): remove and return the element at the front.',
      'Insertion and removal happen at opposite ends.',
      'Commonly used for first-come order processing, e.g. BFS.',
    ],
    setup: (c) => setupStackQueueVisual(c, 'queue'),
  },
  {
    id: 'linkedlist', category: 'structures', categoryLabel: 'Data Structures',
    title: 'Linked List', tags: ['O(1) insert/delete', 'Sequential'],
    desc: 'A chain of nodes, each storing a value and a pointer to the next node — no contiguous memory required.',
    time: 'O(1) insert', space: 'O(n)',
    steps: [
      'Each node has 2 parts: a value and a next pointer.',
      'insertAtHead: the new node points to the old head, becoming the new head.',
      'insertAtTail: the last node points to the new node.',
      'delete: relink the previous node\'s next pointer to skip the removed node.',
    ],
    setup: (c) => setupLinkedListVisual(c),
  },
  {
    id: 'dsu', category: 'structures', categoryLabel: 'Data Structures',
    title: 'Disjoint Set Union (DSU)', tags: ['Union-Find', 'α(n) amortized'],
    desc: 'Tracks a collection of disjoint sets, supporting fast union and find operations via path compression and union by rank.',
    time: 'O(α(n))', space: 'O(n)',
    steps: [
      'Each element starts as its own parent (its own set).',
      'find(x): follow parent pointers up to the root, compressing the path along the way.',
      'union(a, b): find both roots, then attach the smaller-rank tree under the larger.',
      'Path compression + union by rank keep the trees almost flat over time.',
    ],
    setup: (c) => setupDSUVisual(c),
  },
  {
    id: 'trie', category: 'structures', categoryLabel: 'Data Structures',
    title: 'Trie (Prefix Tree)', tags: ['O(len)', 'Prefix search'],
    desc: 'A tree where each edge is a character — words sharing a prefix share the same path from the root.',
    time: 'O(word length)', space: 'O(alphabet · nodes)',
    steps: [
      'Start at the root for every insertion.',
      'For each character, follow the existing edge if present.',
      'If no edge exists for that character, create a new node.',
      'Mark the final node as the end of a complete word.',
    ],
    setup: (c) => setupTrieVisual(c),
  },
  {
    id: 'hashset', category: 'structures', categoryLabel: 'Data Structures',
    title: 'Hash Set (Chaining)', tags: ['O(1) avg', 'Collision handling'],
    desc: 'Maps values to buckets via a hash function; collisions in the same bucket are stored as a chain (list).',
    time: 'O(1) average', space: 'O(n)',
    steps: [
      'insert(x): compute h(x) = x mod m, append x to bucket h(x).',
      'lookup(x): compute h(x), then scan that bucket\'s chain.',
      'Compare each element in the chain until a match or the end.',
      'Good hash functions keep chains short, keeping operations close to O(1).',
    ],
    setup: (c) => setupHashSetVisual(c),
  },
  {
    id: 'sweepline', category: 'structures', categoryLabel: 'Data Structures',
    title: 'Sweep Line', tags: ['O(n log n)', 'Events'],
    desc: 'Turn each interval into a start/end event, then sweep through sorted events tracking how many are active.',
    time: 'O(n log n)', space: 'O(n)',
    steps: [
      'Convert every interval into a +1 (start) and -1 (end) event.',
      'Sort all events by position.',
      'Sweep through them, adding the event\'s delta to a running "active" count.',
      'Track the maximum active count seen — that\'s the peak overlap.',
    ],
    setup: (c) => setupSweepLineVisual(c),
  },

  // ---------------- Graph ----------------
  {
    id: 'bfs', category: 'graph', categoryLabel: 'Graph',
    title: 'BFS (Breadth-First Search)', tags: ['O(V+E)', 'Queue'],
    desc: 'Traverse a graph level by level, visiting all neighbors before going further — uses a queue.',
    time: 'O(V + E)', space: 'O(V)',
    steps: [
      'Enqueue the starting vertex and mark it visited.',
      'Dequeue the front vertex and check all its neighbors.',
      'If a neighbor is unvisited, mark it visited and enqueue it.',
      'Repeat until the queue is empty — this guarantees visiting the nearest levels first.',
    ],
    setup: (c) => setupGraphVisual(c, 'bfs'),
  },
  {
    id: 'multibfs', category: 'graph', categoryLabel: 'Graph',
    title: 'Multisource BFS', tags: ['O(V+E)', 'Multiple starts'],
    desc: 'Seed the BFS queue with several starting vertices at once to find each vertex\'s distance to its nearest source.',
    time: 'O(V + E)', space: 'O(V)',
    steps: [
      'Enqueue every source vertex at the same time, each with distance 0.',
      'Dequeue a vertex and check its neighbors, same as ordinary BFS.',
      'An unvisited neighbor gets distance = current + 1.',
      'The result is each vertex\'s distance to whichever source is closest.',
    ],
    setup: (c) => setupMultiSourceBfsVisual(c),
  },
  {
    id: 'dfs', category: 'graph', categoryLabel: 'Graph',
    title: 'DFS (Depth-First Search)', tags: ['O(V+E)', 'Stack / Recursion'],
    desc: 'Go as deep as possible along one branch before backtracking, using a stack or recursion.',
    time: 'O(V + E)', space: 'O(V)',
    steps: [
      'Visit the starting vertex and mark it visited.',
      'Pick an unvisited neighbor and go deeper into it (recursion).',
      'When no unvisited neighbors remain, backtrack to the previous vertex.',
      'Repeat until all connected vertices are visited.',
    ],
    setup: (c) => setupGraphVisual(c, 'dfs'),
  },
  {
    id: 'dijkstra', category: 'graph', categoryLabel: 'Graph',
    title: 'Dijkstra', tags: ['O((V+E) log V)', 'Shortest path'],
    desc: 'Find the shortest path from a source vertex to every other vertex in a graph with non-negative weights.',
    time: 'O((V+E) log V)', space: 'O(V)',
    steps: [
      'Initialize dist[source] = 0, all other vertices = infinity.',
      'Pick the unvisited vertex with the smallest dist, mark it visited.',
      'For each neighbor, update dist if going through the current vertex is shorter.',
      'Repeat until every vertex has been visited.',
    ],
    setup: (c) => setupGraphVisual(c, 'dijkstra'),
  },
  {
    id: 'toposort', category: 'graph', categoryLabel: 'Graph',
    title: 'Topological Sort', tags: ['O(V+E)', "Kahn's algorithm"],
    desc: 'Orders the vertices of a DAG so every edge points from an earlier vertex to a later one — uses in-degree counting.',
    time: 'O(V + E)', space: 'O(V)',
    steps: [
      'Compute the in-degree (number of incoming edges) of every vertex.',
      'Enqueue all vertices that currently have in-degree 0.',
      'Dequeue a vertex, append it to the order, and remove its outgoing edges.',
      'Whenever a neighbor\'s in-degree drops to 0, enqueue it too.',
    ],
    setup: (c) => setupTopoVisual(c),
  },

  // ---------------- Tree ----------------
  {
    id: 'treedfs', category: 'tree', categoryLabel: 'Tree',
    title: 'Introduction to Tree (DFS)', tags: ['O(V)', 'Recursion'],
    desc: 'A tree is just a connected graph with no cycles — depth-first search visits every node exactly once.',
    time: 'O(V)', space: 'O(V)',
    steps: [
      'Start at the root and mark it visited.',
      'Recurse into each unvisited child.',
      'Since a tree has no cycles, DFS never revisits a node.',
      'Backtrack to the parent once all children are explored.',
    ],
    setup: (c) => setupTreeVisual(c),
  },
  {
    id: 'lca', category: 'tree', categoryLabel: 'Tree',
    title: 'Lowest Common Ancestor (LCA)', tags: ['O(depth)', 'Naive climb'],
    desc: 'Finds the deepest node that is an ancestor of both u and v, by climbing both up to the same depth, then together.',
    time: 'O(depth)', space: 'O(V)',
    steps: [
      'Precompute each node\'s parent and depth (one DFS/BFS from the root).',
      'Climb whichever of u, v is deeper until both are at the same depth.',
      'Climb both nodes up one level at a time together.',
      'They meet exactly at the lowest common ancestor.',
    ],
    setup: (c) => setupLCAVisual(c),
  },
  {
    id: 'eulertour', category: 'tree', categoryLabel: 'Tree',
    title: 'Euler Tour', tags: ['O(V)', 'tin/tout'],
    desc: 'A DFS that records every node each time it\'s entered or returned to, producing a flat sequence useful for subtree queries.',
    time: 'O(V)', space: 'O(V)',
    steps: [
      'On entering a node, record tin[node] and append it to the tour.',
      'After returning from each child, append the node to the tour again.',
      'On leaving the node for good, record tout[node].',
      'The tour has exactly 2n - 1 entries for n nodes.',
    ],
    setup: (c) => setupEulerTourVisual(c),
  },

  // ---------------- Recursion & DP ----------------
  {
    id: 'fibonacci', category: 'recursion', categoryLabel: 'Recursion & DP',
    title: 'Fibonacci (Recursion)', tags: ['O(2ⁿ)', 'Recursion tree'],
    desc: 'Compute fib(n) = fib(n-1) + fib(n-2) recursively — the call tree reveals a lot of duplicated work.',
    time: 'O(2ⁿ)', space: 'O(n)',
    steps: [
      'fib(n) recursively calls fib(n-1) and fib(n-2).',
      'Base case: fib(0) = 0, fib(1) = 1.',
      'Each call waits for both child calls to return before adding the results.',
      'The recursion tree grows exponentially — this is why dynamic programming is used to optimize it.',
    ],
    setup: (c) => setupRecursionVisual(c),
  },
  {
    id: 'knapsack', category: 'recursion', categoryLabel: 'Recursion & DP',
    title: '0/1 Knapsack (DP)', tags: ['O(n·W)', 'DP table'],
    desc: 'Choose a subset of items with the maximum total value without exceeding the capacity — solved with a DP table.',
    time: 'O(n · W)', space: 'O(n · W)',
    steps: [
      'dp[i][w] = max value achievable using the first i items with capacity w.',
      'If item i is heavier than w: dp[i][w] = dp[i-1][w] (can\'t take it).',
      'Otherwise: dp[i][w] = max(skip item i, take item i + dp[i-1][w-weight]).',
      'The bottom-right cell of the table is the final answer.',
    ],
    setup: (c) => setupDPVisual(c),
  },
  {
    id: 'dpontree', category: 'recursion', categoryLabel: 'Recursion & DP',
    title: 'DP on Tree', tags: ['O(V)', 'Post-order'],
    desc: 'Compute a value for every node from its children\'s results via post-order DFS — here, the subtree sum.',
    time: 'O(V)', space: 'O(V)',
    steps: [
      'Recurse into every child first (post-order).',
      'Each child returns its own subtree\'s computed value.',
      'Combine the children\'s results with the current node\'s own value.',
      'dp[root] ends up describing the entire tree.',
    ],
    setup: (c) => setupDPOnTreeVisual(c),
  },

  // ---------------- Backtracking ----------------
  {
    id: 'nqueens', category: 'backtracking', categoryLabel: 'Backtracking',
    title: 'N-Queens', tags: ['Backtracking', 'O(n!)'],
    desc: 'Place n queens on an n×n board so that no queen attacks another — try, and backtrack on failure.',
    time: 'O(n!)', space: 'O(n²)',
    steps: [
      'Place a queen in the current row, trying one column at a time.',
      'Check the column and both diagonals for other queens.',
      'If safe, place the queen and move to the next row.',
      'If no column is safe, backtrack to the previous row and try another column.',
    ],
    setup: (c) => setupNQueensVisual(c),
  },
  {
    id: 'permutations', category: 'backtracking', categoryLabel: 'Backtracking',
    title: 'Permutations', tags: ['Backtracking', 'O(n·n!)'],
    desc: 'Generate every ordering of a set of values by building an arrangement one slot at a time and undoing on completion.',
    time: 'O(n · n!)', space: 'O(n)',
    steps: [
      'Try placing each unused value in the current position.',
      'If already used, skip it (conflict).',
      'Otherwise place it, mark it used, and recurse into the next position.',
      'Once a position is filled n times, record it, then backtrack and try the next value.',
    ],
    setup: (c) => setupPermutationsVisual(c),
  },

  // ---------------- Two Pointers ----------------
  {
    id: 'twopointers', category: 'twopointers', categoryLabel: 'Two Pointers',
    title: 'Two Pointers', tags: ['O(n)', 'Sorted array'],
    desc: 'Walk two indices from opposite ends of a sorted array toward each other to find a pair matching a target sum.',
    time: 'O(n)', space: 'O(1)',
    steps: [
      'Start lo at index 0 and hi at the last index.',
      'Compute sum = arr[lo] + arr[hi].',
      'If the sum matches the target, a pair is found.',
      'If the sum is too small, move lo right; if too large, move hi left.',
    ],
    setup: (c) => setupTwoPointersVisual(c),
  },

  // ---------------- Prefix Sum ----------------
  {
    id: 'prefixsum', category: 'prefixsum', categoryLabel: 'Prefix Sum',
    title: 'Prefix Sum', tags: ['O(n) build', 'O(1) query'],
    desc: 'Precompute running totals so any range-sum query can be answered instantly with a subtraction.',
    time: 'O(n) build, O(1) query', space: 'O(n)',
    steps: [
      'P[0] = arr[0].',
      'P[i] = P[i-1] + arr[i] for each following index.',
      'Range sum [l, r] = P[r] - P[l-1] (or just P[r] if l = 0).',
      'Each query now costs O(1) instead of re-summing the range.',
    ],
    setup: (c) => setupPrefixSumVisual(c),
  },
  {
    id: 'diffarray', category: 'prefixsum', categoryLabel: 'Prefix Sum',
    title: 'Difference Array', tags: ['O(1) update', 'O(n) rebuild'],
    desc: 'Apply a range update in O(1) by marking only its boundaries, then rebuild the real array with a prefix sum.',
    time: 'O(1) update', space: 'O(n)',
    steps: [
      'Start with a zero difference array diff[].',
      'To add val across [l, r]: diff[l] += val and diff[r+1] -= val.',
      'Reconstruct the real array via a running prefix sum of diff.',
      'The "+val" cancels itself out exactly after index r.',
    ],
    setup: (c) => setupDiffArrayVisual(c),
  },

  // ---------------- Math ----------------
  {
    id: 'binpow', category: 'math', categoryLabel: 'Math',
    title: 'Binary Exponentiation', tags: ['O(log exp)', 'Fast power'],
    desc: 'Compute base^exp in logarithmic time by repeatedly squaring the base and halving the exponent.',
    time: 'O(log exp)', space: 'O(1)',
    steps: [
      'If the current exponent is odd, multiply the result by the current base.',
      'Square the base and halve the exponent (integer division).',
      'Repeat until the exponent reaches 0.',
      'This turns O(exp) multiplications into O(log exp).',
    ],
    setup: (c) => setupBinPowVisual(c),
  },

  // ---------------- Bitmasks ----------------
  {
    id: 'subsetenum', category: 'bitmasks', categoryLabel: 'Bitmasks',
    title: 'Subset Enumeration', tags: ['O(2ⁿ)', 'Bitmask'],
    desc: 'Every integer from 0 to 2^n - 1, read in binary, encodes exactly one subset of an n-element set.',
    time: 'O(2ⁿ · n)', space: 'O(n)',
    steps: [
      'Loop mask from 0 to 2^n - 1.',
      'For each bit i, if bit i of mask is set, include element i in the subset.',
      'Every mask corresponds to exactly one unique subset.',
      'This enumerates all 2ⁿ subsets without recursion.',
    ],
    setup: (c) => setupSubsetEnumVisual(c),
  },

  // ---------------- Meet in the Middle ----------------
  {
    id: 'meetinmiddle', category: 'meetinmiddle', categoryLabel: 'Meet in the Middle',
    title: 'Meet in the Middle', tags: ['O(2^(n/2))', 'Split + search'],
    desc: 'Split the input in half, brute-force each half separately, then combine the two halves with a fast search.',
    time: 'O(2^(n/2))', space: 'O(2^(n/2))',
    steps: [
      'Split the array into a left half and a right half.',
      'Enumerate every subset sum of the left half, and of the right half.',
      'Sort the right half\'s sums.',
      'For each left sum, binary-search the right sums for the needed complement.',
    ],
    setup: (c) => setupMeetInMiddleVisual(c),
  },
];

const CATEGORY_LABELS = {
  sorting: 'Sorting',
  searching: 'Searching',
  structures: 'Data Structures',
  graph: 'Graph',
  tree: 'Tree',
  recursion: 'Recursion & DP',
  backtracking: 'Backtracking',
  twopointers: 'Two Pointers',
  prefixsum: 'Prefix Sum',
  math: 'Math',
  bitmasks: 'Bitmasks',
  meetinmiddle: 'Meet in the Middle',
};
