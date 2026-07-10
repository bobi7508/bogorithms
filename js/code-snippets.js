// Real C++ / Python implementations for every algorithm, plus a map from
// each step's `phase` tag to the source line(s) that phase corresponds to.
// Used by the modal's code panel to highlight the running line as the
// animation plays.

const CODE_SNIPPETS = {
  bubble: {
    cpp: `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}`,
    python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        for j in range(n - 1 - i):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]`,
    lines: {
      cpp: { init: 1, compare: 4, swap: 5, markSorted: 2, done: 9 },
      python: { init: 1, compare: 5, swap: 6, markSorted: 3, done: 6 },
    },
  },

  selection: {
    cpp: `void selectionSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        swap(arr[i], arr[minIdx]);
    }
}`,
    python: `def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]`,
    lines: {
      cpp: { init: 1, compareMin: 5, swapMin: 9, markSorted: 2, done: 11 },
      python: { init: 1, compareMin: 6, swapMin: 8, markSorted: 3, done: 8 },
    },
  },

  insertion: {
    cpp: `void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int j = i;
        while (j > 0 && arr[j - 1] > arr[j]) {
            swap(arr[j - 1], arr[j]);
            j--;
        }
    }
}`,
    python: `def insertion_sort(arr):
    n = len(arr)
    for i in range(1, n):
        j = i
        while j > 0 and arr[j - 1] > arr[j]:
            arr[j - 1], arr[j] = arr[j], arr[j - 1]
            j -= 1`,
    lines: {
      cpp: { init: 1, compare: 4, swap: 5, markSorted: 2, done: 9 },
      python: { init: 1, compare: 5, swap: 6, markSorted: 3, done: 7 },
    },
  },

  merge: {
    cpp: `void merge(int arr[], int lo, int mid, int hi) {
    vector<int> left(arr + lo, arr + mid + 1);
    vector<int> right(arr + mid + 1, arr + hi + 1);
    int i = 0, j = 0, k = lo;
    while (i < left.size() && j < right.size()) {
        if (left[i] <= right[j]) {
            arr[k++] = left[i++];
        } else {
            arr[k++] = right[j++];
        }
    }
    while (i < left.size()) arr[k++] = left[i++];
    while (j < right.size()) arr[k++] = right[j++];
}

void mergeSort(int arr[], int lo, int hi) {
    if (lo >= hi) return;
    int mid = (lo + hi) / 2;
    mergeSort(arr, lo, mid);
    mergeSort(arr, mid + 1, hi);
    merge(arr, lo, mid, hi);
}`,
    python: `def merge_sort(arr, lo, hi):
    if lo >= hi:
        return
    mid = (lo + hi) // 2
    merge_sort(arr, lo, mid)
    merge_sort(arr, mid + 1, hi)
    merge(arr, lo, mid, hi)

def merge(arr, lo, mid, hi):
    left = arr[lo:mid + 1]
    right = arr[mid + 1:hi + 1]
    i = j = 0
    k = lo
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            arr[k] = left[i]; i += 1
        else:
            arr[k] = right[j]; j += 1
        k += 1
    while i < len(left):
        arr[k] = left[i]; i += 1; k += 1
    while j < len(right):
        arr[k] = right[j]; j += 1; k += 1`,
    lines: {
      cpp: { init: 16, compare: 6, placeLeft: 7, placeRight: 9, placeRemainderLeft: 12, placeRemainderRight: 13, done: 21 },
      python: { init: 1, compare: 15, placeLeft: 16, placeRight: 18, placeRemainderLeft: 21, placeRemainderRight: 23, done: 7 },
    },
  },

  quick: {
    cpp: `int partition(int arr[], int lo, int hi) {
    int pivot = arr[hi];
    int i = lo;
    for (int j = lo; j < hi; j++) {
        if (arr[j] < pivot) {
            swap(arr[i], arr[j]);
            i++;
        }
    }
    swap(arr[i], arr[hi]);
    return i;
}

void quickSort(int arr[], int lo, int hi) {
    if (lo >= hi) return;
    int p = partition(arr, lo, hi);
    quickSort(arr, lo, p - 1);
    quickSort(arr, p + 1, hi);
}`,
    python: `def partition(arr, lo, hi):
    pivot = arr[hi]
    i = lo
    for j in range(lo, hi):
        if arr[j] < pivot:
            arr[i], arr[j] = arr[j], arr[i]
            i += 1
    arr[i], arr[hi] = arr[hi], arr[i]
    return i

def quick_sort(arr, lo, hi):
    if lo >= hi:
        return
    p = partition(arr, lo, hi)
    quick_sort(arr, lo, p - 1)
    quick_sort(arr, p + 1, hi)`,
    lines: {
      cpp: { init: 14, comparePivot: 5, swapPartition: 6, placePivot: 10, markSorted: 11, done: 19 },
      python: { init: 11, comparePivot: 5, swapPartition: 6, placePivot: 8, markSorted: 9, done: 16 },
    },
  },

  linear: {
    cpp: `int linearSearch(int arr[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == target) {
            return i;
        }
    }
    return -1;
}`,
    python: `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1`,
    lines: {
      cpp: { check: 3, found: 4, notFound: 7 },
      python: { check: 3, found: 4, notFound: 5 },
    },
  },

  binary: {
    cpp: `int binarySearch(int arr[], int n, int target) {
    int lo = 0, hi = n - 1;
    while (lo <= hi) {
        int mid = (lo + hi) / 2;
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }
    return -1;
}`,
    python: `def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`,
    lines: {
      cpp: { computeMid: 5, found: 6, notFound: 13 },
      python: { computeMid: 5, found: 6, notFound: 11 },
    },
  },

  stack: {
    cpp: `class Stack {
    vector<int> data;
public:
    void push(int x) {
        data.push_back(x);
    }
    int pop() {
        int top = data.back();
        data.pop_back();
        return top;
    }
};`,
    python: `class Stack:
    def __init__(self):
        self.data = []

    def push(self, x):
        self.data.append(x)

    def pop(self):
        return self.data.pop()`,
    lines: {
      cpp: { init: 2, push: 5, pop: 9 },
      python: { init: 3, push: 6, pop: 9 },
    },
  },

  queue: {
    cpp: `class Queue {
    deque<int> data;
public:
    void enqueue(int x) {
        data.push_back(x);
    }
    int dequeue() {
        int front = data.front();
        data.pop_front();
        return front;
    }
};`,
    python: `from collections import deque

class Queue:
    def __init__(self):
        self.data = deque()

    def enqueue(self, x):
        self.data.append(x)

    def dequeue(self):
        return self.data.popleft()`,
    lines: {
      cpp: { init: 2, enqueue: 5, dequeue: 9 },
      python: { init: 5, enqueue: 8, dequeue: 11 },
    },
  },

  linkedlist: {
    cpp: `struct Node {
    int value;
    Node* next;
};

void insertAtHead(Node*& head, int value) {
    Node* node = new Node{value, head};
    head = node;
}

void insertAtTail(Node*& head, int value) {
    Node* node = new Node{value, nullptr};
    if (!head) { head = node; return; }
    Node* cur = head;
    while (cur->next) cur = cur->next;
    cur->next = node;
}

void deleteNode(Node*& head, int value) {
    if (head && head->value == value) { head = head->next; return; }
    Node* cur = head;
    while (cur->next && cur->next->value != value) cur = cur->next;
    if (cur->next) cur->next = cur->next->next;
}`,
    python: `class Node:
    def __init__(self, value):
        self.value = value
        self.next = None

def insert_at_head(head, value):
    node = Node(value)
    node.next = head
    return node

def insert_at_tail(head, value):
    node = Node(value)
    if not head:
        return node
    cur = head
    while cur.next:
        cur = cur.next
    cur.next = node
    return head

def delete_node(head, value):
    if head and head.value == value:
        return head.next
    cur = head
    while cur.next and cur.next.value != value:
        cur = cur.next
    if cur.next:
        cur.next = cur.next.next
    return head`,
    lines: {
      cpp: { init: 1, insertHead: 8, insertTail: 16, traverse: 15, delete: 23 },
      python: { init: 3, insertHead: 8, insertTail: 18, traverse: 17, delete: 28 },
    },
  },

  bfs: {
    cpp: `void bfs(int start, vector<vector<int>>& adj) {
    vector<bool> visited(adj.size(), false);
    queue<int> q;
    visited[start] = true;
    q.push(start);
    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (int v : adj[u]) {
            if (!visited[v]) {
                visited[v] = true;
                q.push(v);
            }
        }
    }
}`,
    python: `from collections import deque

def bfs(start, adj):
    visited = {start}
    q = deque([start])
    while q:
        u = q.popleft()
        for v in adj[u]:
            if v not in visited:
                visited.add(v)
                q.append(v)`,
    lines: {
      cpp: { init: 5, visit: 7, discover: 11, done: 15 },
      python: { init: 5, visit: 7, discover: 11 },
    },
  },

  dfs: {
    cpp: `void dfs(int u, vector<vector<int>>& adj, vector<bool>& visited) {
    visited[u] = true;
    for (int v : adj[u]) {
        if (!visited[v]) {
            dfs(v, adj, visited);
        }
    }
}`,
    python: `def dfs(u, adj, visited):
    visited.add(u)
    for v in adj[u]:
        if v not in visited:
            dfs(v, adj, visited)`,
    lines: {
      cpp: { visit: 2, exploreEdge: 5, done: 8 },
      python: { visit: 2, exploreEdge: 5 },
    },
  },

  dijkstra: {
    cpp: `void dijkstra(int src, vector<vector<pair<int,int>>>& adj, vector<int>& dist) {
    dist.assign(adj.size(), INT_MAX);
    dist[src] = 0;
    vector<bool> visited(adj.size(), false);
    for (int i = 0; i < adj.size(); i++) {
        int u = -1;
        for (int j = 0; j < adj.size(); j++) {
            if (!visited[j] && (u == -1 || dist[j] < dist[u])) u = j;
        }
        visited[u] = true;
        for (auto [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
            }
        }
    }
}`,
    python: `def dijkstra(src, adj, n):
    dist = [float('inf')] * n
    dist[src] = 0
    visited = set()
    for _ in range(n):
        u = min((v for v in range(n) if v not in visited), key=lambda v: dist[v])
        visited.add(u)
        for v, w in adj[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w`,
    lines: {
      cpp: { init: 3, selectMin: 10, relax: 12, done: 17 },
      python: { init: 3, selectMin: 7, relax: 9 },
    },
  },

  fibonacci: {
    cpp: `int fib(int n) {
    if (n <= 1) return n;
    int a = fib(n - 1);
    int b = fib(n - 2);
    return a + b;
}`,
    python: `def fib(n):
    if n <= 1:
        return n
    a = fib(n - 1)
    b = fib(n - 2)
    return a + b`,
    lines: {
      cpp: { call: 1, return: 5 },
      python: { call: 1, return: 6 },
    },
  },

  knapsack: {
    cpp: `int knapsack(vector<int>& w, vector<int>& v, int cap) {
    int n = w.size();
    vector<vector<int>> dp(n + 1, vector<int>(cap + 1, 0));
    for (int i = 1; i <= n; i++) {
        for (int c = 0; c <= cap; c++) {
            if (w[i - 1] <= c) {
                dp[i][c] = max(dp[i - 1][c], dp[i - 1][c - w[i - 1]] + v[i - 1]);
            } else {
                dp[i][c] = dp[i - 1][c];
            }
        }
    }
    return dp[n][cap];
}`,
    python: `def knapsack(w, v, cap):
    n = len(w)
    dp = [[0] * (cap + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for c in range(cap + 1):
            if w[i - 1] <= c:
                dp[i][c] = max(dp[i - 1][c], dp[i - 1][c - w[i - 1]] + v[i - 1])
            else:
                dp[i][c] = dp[i - 1][c]
    return dp[n][cap]`,
    lines: {
      cpp: { baseRow: 3, computeCellTake: 7, computeCellSkip: 9, done: 13 },
      python: { baseRow: 3, computeCellTake: 7, computeCellSkip: 9, done: 10 },
    },
  },

  nqueens: {
    cpp: `bool solve(vector<int>& board, int row, int n) {
    if (row == n) return true;
    for (int col = 0; col < n; col++) {
        if (isSafe(board, row, col)) {
            board[row] = col;
            if (solve(board, row + 1, n)) return true;
            board[row] = -1;
        }
    }
    return false;
}`,
    python: `def solve(board, row, n):
    if row == n:
        return True
    for col in range(n):
        if is_safe(board, row, col):
            board[row] = col
            if solve(board, row + 1, n):
                return True
            board[row] = -1
    return False`,
    lines: {
      cpp: { try: 4, place: 5, conflict: 4, backtrack: 7, done: 2 },
      python: { try: 5, place: 6, conflict: 5, backtrack: 9, done: 2 },
    },
  },

  twopointers: {
    cpp: `bool twoSum(vector<int>& arr, int target) {
    int lo = 0, hi = arr.size() - 1;
    while (lo < hi) {
        int sum = arr[lo] + arr[hi];
        if (sum == target) {
            return true;
        } else if (sum < target) {
            lo++;
        } else {
            hi--;
        }
    }
    return false;
}`,
    python: `def two_sum(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo < hi:
        s = arr[lo] + arr[hi]
        if s == target:
            return True
        elif s < target:
            lo += 1
        else:
            hi -= 1
    return False`,
    lines: {
      cpp: { init: 2, compare: 4, found: 6, moveLo: 8, moveHi: 10, notFound: 13 },
      python: { init: 2, compare: 4, found: 6, moveLo: 8, moveHi: 10, notFound: 11 },
    },
  },

  prefixsum: {
    cpp: `vector<int> buildPrefix(vector<int>& arr) {
    int n = arr.size();
    vector<int> P(n);
    P[0] = arr[0];
    for (int i = 1; i < n; i++) {
        P[i] = P[i - 1] + arr[i];
    }
    return P;
}

int rangeSum(vector<int>& P, int l, int r) {
    return l == 0 ? P[r] : P[r] - P[l - 1];
}`,
    python: `def build_prefix(arr):
    n = len(arr)
    P = [0] * n
    P[0] = arr[0]
    for i in range(1, n):
        P[i] = P[i - 1] + arr[i]
    return P

def range_sum(P, l, r):
    return P[r] if l == 0 else P[r] - P[l - 1]`,
    lines: {
      cpp: { init: 4, build: 6, query: 12 },
      python: { init: 4, build: 6, query: 10 },
    },
  },

  diffarray: {
    cpp: `void applyRangeUpdate(vector<int>& diff, int l, int r, int val) {
    diff[l] += val;
    if (r + 1 < (int)diff.size()) {
        diff[r + 1] -= val;
    }
}

vector<int> reconstruct(vector<int>& diff) {
    vector<int> arr(diff.size());
    arr[0] = diff[0];
    for (int i = 1; i < (int)diff.size(); i++) {
        arr[i] = arr[i - 1] + diff[i];
    }
    return arr;
}`,
    python: `def apply_range_update(diff, l, r, val):
    diff[l] += val
    if r + 1 < len(diff):
        diff[r + 1] -= val

def reconstruct(diff):
    arr = [0] * len(diff)
    arr[0] = diff[0]
    for i in range(1, len(diff)):
        arr[i] = arr[i - 1] + diff[i]
    return arr`,
    lines: {
      cpp: { init: 8, applyLeft: 2, applyRight: 4, reconstructInit: 10, reconstruct: 12 },
      python: { init: 7, applyLeft: 2, applyRight: 4, reconstructInit: 8, reconstruct: 10 },
    },
  },

  dsu: {
    cpp: `vector<int> parent(n), rnk(n, 0);
iota(parent.begin(), parent.end(), 0);

int find(vector<int>& parent, int x) {
    if (parent[x] != x) {
        parent[x] = find(parent, parent[x]);
    }
    return parent[x];
}

void unite(vector<int>& parent, vector<int>& rnk, int a, int b) {
    int ra = find(parent, a), rb = find(parent, b);
    if (ra == rb) return;
    if (rnk[ra] < rnk[rb]) swap(ra, rb);
    parent[rb] = ra;
    if (rnk[ra] == rnk[rb]) rnk[ra]++;
}`,
    python: `parent = list(range(n))
rank = [0] * n

def find(x):
    if parent[x] != x:
        parent[x] = find(parent[x])
    return parent[x]

def union(a, b):
    ra, rb = find(a), find(b)
    if ra == rb:
        return
    if rank[ra] < rank[rb]:
        ra, rb = rb, ra
    parent[rb] = ra
    if rank[ra] == rank[rb]:
        rank[ra] += 1`,
    lines: {
      cpp: { init: 2, find: 6, skip: 13, union: 15, done: 17 },
      python: { init: 1, find: 6, skip: 12, union: 15, done: 17 },
    },
  },

  permutations: {
    cpp: `void permute(vector<int>& arr, vector<int>& current, vector<bool>& used) {
    if (current.size() == arr.size()) {
        record(current);
        return;
    }
    for (int i = 0; i < arr.size(); i++) {
        if (used[i]) continue;
        used[i] = true;
        current.push_back(arr[i]);
        permute(arr, current, used);
        used[i] = false;
        current.pop_back();
    }
}`,
    python: `def permute(arr, current, used):
    if len(current) == len(arr):
        record(current)
        return
    for i in range(len(arr)):
        if used[i]:
            continue
        used[i] = True
        current.append(arr[i])
        permute(arr, current, used)
        used[i] = False
        current.pop()`,
    lines: {
      cpp: { try: 7, place: 9, conflict: 7, complete: 3, backtrack: 11, done: 14 },
      python: { try: 6, place: 9, conflict: 6, complete: 3, backtrack: 11, done: 12 },
    },
  },

  binpow: {
    cpp: `long long binPow(long long base, long long exp) {
    long long result = 1;
    while (exp > 0) {
        if (exp & 1) {
            result *= base;
        }
        base *= base;
        exp >>= 1;
    }
    return result;
}`,
    python: `def bin_pow(base, exp):
    result = 1
    while exp > 0:
        if exp & 1:
            result *= base
        base *= base
        exp >>= 1
    return result`,
    lines: {
      cpp: { init: 2, multiply: 5, skip: 4, square: 7, done: 10 },
      python: { init: 2, multiply: 5, skip: 4, square: 6, done: 8 },
    },
  },

  subsetenum: {
    cpp: `void enumerateSubsets(vector<int>& set) {
    int n = set.size();
    for (int mask = 0; mask < (1 << n); mask++) {
        vector<int> subset;
        for (int i = 0; i < n; i++) {
            if (mask & (1 << i)) {
                subset.push_back(set[i]);
            }
        }
        process(subset);
    }
}`,
    python: `def enumerate_subsets(s):
    n = len(s)
    for mask in range(1 << n):
        subset = [s[i] for i in range(n) if mask & (1 << i)]
        process(subset)`,
    lines: {
      cpp: { enumerate: 6, done: 12 },
      python: { enumerate: 4, done: 5 },
    },
  },

  treedfs: {
    cpp: `void dfs(int u, vector<vector<int>>& adj, vector<bool>& visited) {
    visited[u] = true;
    for (int v : adj[u]) {
        if (!visited[v]) {
            dfs(v, adj, visited);
        }
    }
}`,
    python: `def dfs(u, adj, visited):
    visited.add(u)
    for v in adj[u]:
        if v not in visited:
            dfs(v, adj, visited)`,
    lines: {
      cpp: { visit: 2, exploreEdge: 5, done: 7 },
      python: { visit: 2, exploreEdge: 5 },
    },
  },

  toposort: {
    cpp: `vector<int> topoSort(int n, vector<vector<int>>& adj, vector<int>& indeg) {
    queue<int> q;
    for (int i = 0; i < n; i++) if (indeg[i] == 0) q.push(i);
    vector<int> order;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        order.push_back(u);
        for (int v : adj[u]) {
            if (--indeg[v] == 0) {
                q.push(v);
            }
        }
    }
    return order;
}`,
    python: `from collections import deque

def topo_sort(n, adj, indeg):
    q = deque([i for i in range(n) if indeg[i] == 0])
    order = []
    while q:
        u = q.popleft()
        order.append(u)
        for v in adj[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                q.append(v)
    return order`,
    lines: {
      cpp: { init: 3, visit: 7, reduceIndeg: 9, discover: 10, done: 14 },
      python: { init: 4, visit: 8, reduceIndeg: 10, discover: 12, done: 13 },
    },
  },

  meetinmiddle: {
    cpp: `vector<long long> subsetSums(vector<int>& arr) {
    int n = arr.size();
    vector<long long> sums;
    for (int mask = 0; mask < (1 << n); mask++) {
        long long sum = 0;
        for (int i = 0; i < n; i++) {
            if (mask & (1 << i)) sum += arr[i];
        }
        sums.push_back(sum);
    }
    return sums;
}

bool meetInMiddle(vector<int>& arr, int target) {
    int half = arr.size() / 2;
    vector<int> left(arr.begin(), arr.begin() + half);
    vector<int> right(arr.begin() + half, arr.end());
    auto sumsL = subsetSums(left);
    auto sumsR = subsetSums(right);
    sort(sumsR.begin(), sumsR.end());
    for (long long s : sumsL) {
        if (binary_search(sumsR.begin(), sumsR.end(), target - s)) {
            return true;
        }
    }
    return false;
}`,
    python: `def subset_sums(arr):
    n = len(arr)
    sums = []
    for mask in range(1 << n):
        s = sum(arr[i] for i in range(n) if mask & (1 << i))
        sums.append(s)
    return sums

def meet_in_middle(arr, target):
    half = len(arr) // 2
    left, right = arr[:half], arr[half:]
    sums_l = subset_sums(left)
    sums_r = sorted(subset_sums(right))
    for s in sums_l:
        idx = bisect_left(sums_r, target - s)
        if idx < len(sums_r) and sums_r[idx] == target - s:
            return True
    return False`,
    lines: {
      cpp: { buildLeft: 9, buildRight: 9, search: 22, found: 23, notFound: 26 },
      python: { buildLeft: 6, buildRight: 6, search: 15, found: 17, notFound: 18 },
    },
  },

  dpontree: {
    cpp: `int dp[MAXN];

int dfs(int u, int parent, vector<int>& value, vector<vector<int>>& children) {
    dp[u] = value[u];
    for (int c : children[u]) {
        if (c == parent) continue;
        dp[u] += dfs(c, u, value, children);
    }
    return dp[u];
}`,
    python: `def dfs(u, parent, value, children):
    total = value[u]
    for c in children[u]:
        if c == parent:
            continue
        total += dfs(c, u, value, children)
    return total`,
    lines: {
      cpp: { visit: 4, combine: 7, computeDP: 9 },
      python: { visit: 2, combine: 6, computeDP: 7 },
    },
  },

  lca: {
    cpp: `int lca(int u, int v, vector<int>& parent, vector<int>& depth) {
    while (depth[u] > depth[v]) u = parent[u];
    while (depth[v] > depth[u]) v = parent[v];
    while (u != v) {
        u = parent[u];
        v = parent[v];
    }
    return u;
}`,
    python: `def lca(u, v, parent, depth):
    while depth[u] > depth[v]:
        u = parent[u]
    while depth[v] > depth[u]:
        v = parent[v]
    while u != v:
        u = parent[u]
        v = parent[v]
    return u`,
    lines: {
      cpp: { init: 1, alignDepth: 2, climbBoth: 5, found: 8 },
      python: { init: 1, alignDepth: 3, climbBoth: 7, found: 9 },
    },
  },

  eulertour: {
    cpp: `vector<int> tour;
int timer = 0;
int tin[MAXN], tout[MAXN];

void dfs(int u, int parent, vector<vector<int>>& children) {
    tour.push_back(u);
    tin[u] = timer++;
    for (int c : children[u]) {
        dfs(c, u, children);
        tour.push_back(u);
    }
    tout[u] = timer++;
}`,
    python: `tour = []
timer = 0
tin, tout = {}, {}

def dfs(u, parent, children):
    global timer
    tour.append(u)
    tin[u] = timer; timer += 1
    for c in children[u]:
        dfs(c, u, children)
        tour.append(u)
    tout[u] = timer; timer += 1`,
    lines: {
      cpp: { enter: 7, returnTo: 10, exit: 12 },
      python: { enter: 8, returnTo: 11, exit: 12 },
    },
  },

  multibfs: {
    cpp: `vector<int> multiSourceBFS(int n, vector<vector<int>>& adj, vector<int>& sources) {
    vector<int> dist(n, -1);
    queue<int> q;
    for (int s : sources) {
        dist[s] = 0;
        q.push(s);
    }
    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (int v : adj[u]) {
            if (dist[v] == -1) {
                dist[v] = dist[u] + 1;
                q.push(v);
            }
        }
    }
    return dist;
}`,
    python: `from collections import deque

def multi_source_bfs(n, adj, sources):
    dist = [-1] * n
    q = deque()
    for s in sources:
        dist[s] = 0
        q.append(s)
    while q:
        u = q.popleft()
        for v in adj[u]:
            if dist[v] == -1:
                dist[v] = dist[u] + 1
                q.append(v)
    return dist`,
    lines: {
      cpp: { init: 6, visit: 9, discover: 13, done: 17 },
      python: { init: 8, visit: 10, discover: 14, done: 15 },
    },
  },

  hashset: {
    cpp: `vector<int> table[M];

void insert(int x) {
    int h = x % M;
    table[h].push_back(x);
}

bool contains(int x) {
    int h = x % M;
    for (int v : table[h]) {
        if (v == x) return true;
    }
    return false;
}`,
    python: `table = [[] for _ in range(m)]

def insert(x):
    h = x % m
    table[h].append(x)

def contains(x):
    h = x % m
    for v in table[h]:
        if v == x:
            return True
    return False`,
    lines: {
      cpp: { init: 1, insert: 5, lookupHash: 9, compare: 11, compareFound: 11, notFound: 13 },
      python: { init: 1, insert: 5, lookupHash: 8, compare: 10, compareFound: 10, notFound: 12 },
    },
  },

  sweepline: {
    cpp: `int maxOverlap(vector<pair<int,int>>& intervals) {
    vector<pair<int,int>> events;
    for (auto& [s, e] : intervals) {
        events.push_back({s, 1});
        events.push_back({e, -1});
    }
    sort(events.begin(), events.end());
    int active = 0, best = 0;
    for (auto& [pos, type] : events) {
        active += type;
        best = max(best, active);
    }
    return best;
}`,
    python: `def max_overlap(intervals):
    events = []
    for s, e in intervals:
        events.append((s, 1))
        events.append((e, -1))
    events.sort()
    active = best = 0
    for pos, typ in events:
        active += typ
        best = max(best, active)
    return best`,
    lines: {
      cpp: { init: 7, start: 10, newMax: 11, end: 10, done: 13 },
      python: { init: 6, start: 9, newMax: 10, end: 9, done: 11 },
    },
  },

  trie: {
    cpp: `struct TrieNode {
    TrieNode* children[26] = {};
    bool isEnd = false;
};

void insert(TrieNode* root, const string& word) {
    TrieNode* node = root;
    for (char ch : word) {
        int i = ch - 'a';
        if (!node->children[i]) {
            node->children[i] = new TrieNode();
        }
        node = node->children[i];
    }
    node->isEnd = true;
}`,
    python: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

def insert(root, word):
    node = root
    for ch in word:
        if ch not in node.children:
            node.children[ch] = TrieNode()
        node = node.children[ch]
    node.is_end = True`,
    lines: {
      cpp: { traverse: 13, create: 11, markEnd: 15 },
      python: { traverse: 11, create: 10, markEnd: 12 },
    },
  },
};
