# DSA Syllabus and Practice Plan

A structured, practice-first roadmap covering core data structures, algorithmic patterns (15+), and curated LeetCode problems to strengthen each concept.

## How to Use
- Study concepts briefly, then immediately solve 3–10 targeted problems per topic.
- Track solution patterns and build reusable templates for each pattern.
- Revisit topics with spaced repetition: easy -> medium -> hard.

## Prerequisites
- Big-O basics, recursion fundamentals
- Comfort with either Java, C++, Python, or JavaScript

## Suggested 12-Week Timeline
- Weeks 1–2: Arrays, Strings, Hashing, Two Pointers, Sliding Window
- Weeks 3–4: Linked Lists, Stacks/Queues, Prefix Sums, Monotonic Stack/Queue
- Weeks 5–6: Trees, BST, DFS/BFS, Binary Search (+ on answer)
- Weeks 7–8: Heaps, K-way merge, Top-K, Greedy + Intervals, Sweep Line
- Weeks 9–10: Graphs, Topological Sort, Union-Find, Shortest Paths
- Weeks 11–12: Dynamic Programming (1D, grids, subsequences), Advanced topics (Trie, Segment Tree, Fenwick, LCA)

---

## Core Data Structures and Problems

### Arrays
Concepts: indexing, prefix sums, difference arrays, in-place operations.
LeetCode practice:
- 1 Two Sum
- 121 Best Time to Buy and Sell Stock
- 238 Product of Array Except Self
- 53 Maximum Subarray
- 56 Merge Intervals
- 57 Insert Interval
- 435 Non-overlapping Intervals
- 252 Meeting Rooms
- 41 First Missing Positive
- 268 Missing Number
- 217 Contains Duplicate
- 283 Move Zeroes
- 189 Rotate Array
- 15 3Sum
- 18 4Sum
- 560 Subarray Sum Equals K
- 128 Longest Consecutive Sequence

### Strings
Concepts: hashing, sliding window, two pointers, palindrome checks.
LeetCode practice:
- 242 Valid Anagram
- 3 Longest Substring Without Repeating Characters
- 647 Palindromic Substrings
- 5 Longest Palindromic Substring
- 8 String to Integer (atoi)
- 28 Implement strStr
- 49 Group Anagrams
- 14 Longest Common Prefix
- 76 Minimum Window Substring
- 205 Isomorphic Strings
- 139 Word Break
- 392 Is Subsequence

### Hash Map / Set
Concepts: frequency maps, deduplication, membership tests.
LeetCode practice:
- 771 Jewels and Stones
- 387 First Unique Character in a String
- 36 Valid Sudoku
- 49 Group Anagrams
- 128 Longest Consecutive Sequence
- 560 Subarray Sum Equals K

### Linked List
Concepts: pointers, in-place reversal, cycle detection, merging.
LeetCode practice:
- 206 Reverse Linked List
- 21 Merge Two Sorted Lists
- 141 Linked List Cycle
- 160 Intersection of Two Linked Lists
- 19 Remove Nth Node From End of List
- 234 Palindrome Linked List
- 143 Reorder List
- 148 Sort List
- 138 Copy List with Random Pointer
- 2 Add Two Numbers

### Stack and Queue
Concepts: LIFO/FIFO, monotonic structures, deque tricks.
LeetCode practice:
- 20 Valid Parentheses
- 155 Min Stack
- 150 Evaluate Reverse Polish Notation
- 739 Daily Temperatures
- 84 Largest Rectangle in Histogram
- 239 Sliding Window Maximum
- 225 Implement Stack using Queues
- 232 Implement Queue using Stacks

### Trees (Binary Tree)
Concepts: traversal (pre/in/post), height, paths, serialization.
LeetCode practice:
- 94 Binary Tree Inorder Traversal
- 104 Maximum Depth of Binary Tree
- 543 Diameter of Binary Tree
- 110 Balanced Binary Tree
- 112 Path Sum
- 437 Path Sum III
- 617 Merge Two Binary Trees
- 226 Invert Binary Tree
- 101 Symmetric Tree
- 572 Subtree of Another Tree

### Binary Search Tree (BST)
Concepts: ordered traversal, invariants, LCA.
LeetCode practice:
- 98 Validate Binary Search Tree
- 700 Search in a Binary Search Tree
- 701 Insert into a Binary Search Tree
- 450 Delete Node in a BST
- 235 Lowest Common Ancestor of a BST
- 230 Kth Smallest Element in a BST
- 938 Range Sum of BST

### Heaps / Priority Queue
Concepts: top-k, min/max heap, multiway merge.
LeetCode practice:
- 215 Kth Largest Element in an Array
- 347 Top K Frequent Elements
- 295 Find Median from Data Stream
- 23 Merge k Sorted Lists
- 502 IPO
- 621 Task Scheduler
- 373 Find K Pairs with Smallest Sums

### Trie (Prefix Tree)
Concepts: prefix matching, word search, autocomplete.
LeetCode practice:
- 208 Implement Trie (Prefix Tree)
- 211 Design Add and Search Words Data Structure
- 212 Word Search II
- 720 Longest Word in Dictionary
- 648 Replace Words

### Graphs
Concepts: adjacency list, BFS/DFS, topo sort, shortest path.
LeetCode practice:
- 200 Number of Islands
- 133 Clone Graph
- 207 Course Schedule
- 210 Course Schedule II
- 417 Pacific Atlantic Water Flow
- 994 Rotting Oranges
- 261 Graph Valid Tree
- 310 Minimum Height Trees

### Union-Find (Disjoint Set)
Concepts: union by rank, path compression, components.
LeetCode practice:
- 684 Redundant Connection
- 547 Number of Provinces
- 721 Accounts Merge
- 1319 Number of Operations to Make Network Connected
- 959 Regions Cut By Slashes

### Advanced: Segment Tree / Fenwick (BIT)
Concepts: range queries, point updates, logarithmic operations.
LeetCode practice:
- 307 Range Sum Query - Mutable
- 315 Count of Smaller Numbers After Self
- 493 Reverse Pairs
- 218 The Skyline Problem
- 732 My Calendar III

### String Algorithms (KMP / Rolling Hash)
Concepts: prefix-function, failure links, polynomial rolling hash.
LeetCode practice:
- 28 Implement strStr (KMP)
- 1044 Longest Duplicate Substring
- 187 Repeated DNA Sequences
- 459 Repeated Substring Pattern
- 686 Repeated String Match

---

## Algorithmic Patterns (15+ with curated problems)

### 1. Sliding Window
Use for subarray/substring with contiguous elements optimizing length or sum.
LeetCode practice:
- 3 Longest Substring Without Repeating Characters
- 76 Minimum Window Substring
- 159 Longest Substring with At Most Two Distinct Characters
- 438 Find All Anagrams in a String
- 209 Minimum Size Subarray Sum
- 2958 Length of Longest Subarray With at Most K Frequency
- 1004 Max Consecutive Ones III

### 2. Two Pointers
Opposite ends or same-direction pointers to reduce complexity on sorted arrays/strings.
LeetCode practice:
- 15 3Sum
- 18 4Sum
- 26 Remove Duplicates from Sorted Array
- 88 Merge Sorted Array
- 680 Valid Palindrome II
- 167 Two Sum II - Input array is sorted
- 125 Valid Palindrome

### 3. Fast & Slow Pointers
Cycle detection or middle finding.
LeetCode practice:
- 141 Linked List Cycle
- 142 Linked List Cycle II
- 876 Middle of the Linked List
- 202 Happy Number

### 4. Prefix Sum
Accumulate sums to answer range queries or count subarrays.
LeetCode practice:
- 560 Subarray Sum Equals K
- 1248 Count Number of Nice Subarrays
- 523 Continuous Subarray Sum
- 238 Product of Array Except Self (prefix/postfix trick)
- 363 Max Sum of Rectangle No Larger Than K

### 5. Difference Array
Range increment updates in O(1) per update; compute prefix at end.
LeetCode practice:
- 370 Range Addition
- 1109 Corporate Flight Bookings
- 1854 Maximum Population Year

### 6. Monotonic Stack
Next greater/smaller element, histogram problems.
LeetCode practice:
- 739 Daily Temperatures
- 84 Largest Rectangle in Histogram
- 496 Next Greater Element I
- 503 Next Greater Element II
- 316 Remove Duplicate Letters
- 402 Remove K Digits

### 7. Monotonic Queue / Deque
Maintain max/min over sliding window.
LeetCode practice:
- 239 Sliding Window Maximum
- 862 Shortest Subarray with Sum at Least K
- 1438 Longest Continuous Subarray With Absolute Diff <= K

### 8. Binary Search (Index) and Binary Search on Answer
Find boundaries or optimal answer by feasibility check.
LeetCode practice:
- 34 Find First and Last Position of Element in Sorted Array
- 74 Search a 2D Matrix
- 540 Single Element in a Sorted Array
- 153 Find Minimum in Rotated Sorted Array
- 4 Median of Two Sorted Arrays
- 378 Kth Smallest Element in a Sorted Matrix
- 410 Split Array Largest Sum (BS on answer)
- 1011 Capacity To Ship Packages Within D Days (BS on answer)
- 875 Koko Eating Bananas (BS on answer)

### 9. Greedy + Sorting
Local optimal choices with sort-based scheduling/interval selection.
LeetCode practice:
- 435 Non-overlapping Intervals
- 56 Merge Intervals
- 253 Meeting Rooms II
- 135 Candy
- 122 Best Time to Buy and Sell Stock II
- 1029 Two City Scheduling

### 10. Intervals and Sweep Line
Scan events, maintain active set counts.
LeetCode practice:
- 57 Insert Interval
- 253 Meeting Rooms II
- 252 Meeting Rooms
- 986 Interval List Intersections
- 218 The Skyline Problem

### 11. Backtracking
Systematically explore state space; prune aggressively.
LeetCode practice:
- 46 Permutations
- 47 Permutations II
- 78 Subsets
- 90 Subsets II
- 39 Combination Sum
- 40 Combination Sum II
- 79 Word Search
- 51 N-Queens
- 37 Sudoku Solver

### 12. Subsets / Combinatorics
Bitmask or recursion to generate combinations/permutations.
LeetCode practice:
- 77 Combinations
- 78 Subsets
- 90 Subsets II
- 401 Binary Watch

### 13. K-way Merge (Heap)
Merge multiple sorted lists/arrays efficiently.
LeetCode practice:
- 23 Merge k Sorted Lists
- 632 Smallest Range Covering Elements from K Lists
- 373 Find K Pairs with Smallest Sums

### 14. Top-K / Heap Selection
Frequency counting and priority selection.
LeetCode practice:
- 347 Top K Frequent Elements
- 692 Top K Frequent Words
- 215 Kth Largest Element in an Array
- 973 K Closest Points to Origin

### 15. Cyclic Sort / Index Placement
Place numbers 1..n to correct indices; detect missing/duplicate.
LeetCode practice:
- 41 First Missing Positive
- 442 Find All Duplicates in an Array
- 448 Find All Numbers Disappeared in an Array

### 16. In-place Linked List Reversal
Template for reversing, k-group operations.
LeetCode practice:
- 206 Reverse Linked List
- 92 Reverse Linked List II
- 25 Reverse Nodes in k-Group

### 17. BFS (Unweighted Shortest Path)
Level-order traversal for grids/graphs.
LeetCode practice:
- 200 Number of Islands
- 994 Rotting Oranges
- 127 Word Ladder
- 1091 Shortest Path in Binary Matrix
- 752 Open the Lock

### 18. DFS (Search, Components, Paths)
Recursive exploration, cycle detection, path tracking.
LeetCode practice:
- 207 Course Schedule
- 133 Clone Graph
- 797 All Paths From Source to Target
- 130 Surrounded Regions

### 19. Topological Sort
Kahn’s algorithm (BFS) or DFS post-order for DAGs.
LeetCode practice:
- 210 Course Schedule II
- 269 Alien Dictionary
- 444 Sequence Reconstruction

### 20. Union-Find (DSU)
Maintain connectivity, detect cycles, count components.
LeetCode practice:
- 684 Redundant Connection
- 947 Most Stones Removed with Same Row or Column
- 765 Couples Holding Hands
- 1319 Number of Operations to Make Network Connected

### 21. Dijkstra / 0-1 BFS
Weighted shortest path; deque for 0/1 edges.
LeetCode practice:
- 743 Network Delay Time
- 1631 Path With Minimum Effort
- 787 Cheapest Flights Within K Stops
- 1162 As Far from Land as Possible (multi-source BFS)
- 1293 Shortest Path in a Grid with Obstacles Elimination

### 22. Dynamic Programming (DP) Essentials
Common patterns: 1D DP, grids, subsequences, knapsack.
LeetCode practice:
- 53 Maximum Subarray (Kadane’s)
- 70 Climbing Stairs
- 198 House Robber
- 300 Longest Increasing Subsequence
- 1143 Longest Common Subsequence
- 518 Coin Change II
- 322 Coin Change
- 62 Unique Paths
- 64 Minimum Path Sum
- 221 Maximal Square
- 72 Edit Distance

### 23. Bit Manipulation
Use XOR/bit masks to compress state or compute quickly.
LeetCode practice:
- 136 Single Number
- 137 Single Number II
- 260 Single Number III
- 191 Number of 1 Bits
- 338 Counting Bits
- 401 Binary Watch
- 78 Subsets (bitmask)

### 24. Meet-in-the-Middle
Split problem into halves and combine results.
LeetCode practice:
- 1755 Closest Subsequence Sum
- 805 Split Array With Same Average

### 25. LCA / Binary Lifting (Advanced Trees)
Lowest common ancestor in O(log N) after preprocessing.
LeetCode practice:
- 236 Lowest Common Ancestor of a Binary Tree
- 235 Lowest Common Ancestor of a BST
- 1676 Lowest Common Ancestor of a Binary Tree IV

---

## Problem-Solving Checklist
- Define inputs/outputs and constraints clearly.
- Identify applicable pattern(s) before coding.
- Prove correctness: invariants, induction, or counterexamples.
- Analyze complexity and memory; consider trade-offs.
- Write clean, testable code; add assertions for edge cases.

## Practice Strategy
- For each topic: 1–2 easy, 3–5 medium, 1–2 hard problems.
- After solving: summarize learned pattern and pitfalls.
- Re-solve key problems in 1 week to reinforce.

## References
- LeetCode Explore tracks for DS and Algorithms
- CP-algorithms for advanced graph and string topics
- CLRS (Introduction to Algorithms) for theory

## Milestones and Review
- End of Week 2: pass 50+ easy/medium array/string problems.
- End of Week 4: confidence with linked list, stack/queue, monotonic structures.
- End of Week 6: tree traversals, binary search, and BFS/DFS mastery.
- End of Week 8: heaps, intervals, greedy patterns solved.
- End of Week 10: graphs, topo sort, DSU, shortest paths.
- End of Week 12: DP, tries, segment tree/Fenwick basics.

---

## Extended LeetCode Set (More practice per domain)
Arrays/Strings extras:
- 11 Container With Most Water
- 338 Counting Bits
- 718 Maximum Length of Repeated Subarray
- 11 We already listed; consider re-derivation via two pointers

Linked List extras:
- 328 Odd Even Linked List
- 61 Rotate List
- 23 Merge k Sorted Lists

Trees extras:
- 199 Binary Tree Right Side View
- 105 Construct Binary Tree from Preorder and Inorder Traversal
- 124 Binary Tree Maximum Path Sum
- 863 All Nodes Distance K in Binary Tree

Graph extras:
- 886 Possible Bipartition
- 1971 Find if Path Exists in Graph
- 997 Find the Town Judge
- 785 Is Graph Bipartite?

DP extras:
- 416 Partition Equal Subset Sum
- 494 Target Sum
- 174 Dungeon Game
- 329 Longest Increasing Path in a Matrix

Greedy/Intervals extras:
- 452 Minimum Number of Arrows to Burst Balloons
- 621 Task Scheduler
- 57 Insert Interval (review)

Heaps extras:
- 378 Kth Smallest Element in a Sorted Matrix
- 767 Reorganize String
- 871 Minimum Number of Refueling Stops

String algorithms extras:
- 214 Shortest Palindrome
- 28 Implement strStr (different methods)
- 459 Repeated Substring Pattern (review)

Advanced DS extras:
- 1202 Smallest String With Swaps (Union-Find + sorting)
- 239 Sliding Window Maximum (Deque pattern review)
- 480 Sliding Window Median (Two Heaps)

---

## Tracking
Maintain a log of solved problems with:
- Date, difficulty, time spent
- Pattern used and why
- Mistakes and fixes
- Complexity and alternative solutions