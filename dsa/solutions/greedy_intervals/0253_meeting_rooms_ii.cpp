/*
LeetCode 253. Meeting Rooms II
Link: https://leetcode.com/problems/meeting-rooms-ii/

Question:
Given an array of meeting time intervals where intervals[i] = [start_i, end_i],
return the minimum number of conference rooms required.

Constraints:
- 1 <= intervals.length <= 1e4
- 0 <= start_i < end_i <= 1e6

Approach (Greedy + Min-Heap of end times):
- Sort meetings by start time.
- Use a min-heap to track the earliest finishing meeting (heap stores end times).
- For each meeting:
  - If the earliest finishing meeting ends on or before current start, reuse that room (pop).
  - Always push current meeting's end into the heap.
- The heap size at any time is the number of rooms currently used; the maximum size after processing all meetings
  is the minimum number of rooms required.

Complexity:
- Time: O(n log n) due to sorting and heap operations
- Space: O(n) heap in the worst case (all overlapping)
*/

#include <vector>
#include <algorithm>
#include <queue>

class Solution {
public:
    int minMeetingRooms(std::vector<std::vector<int>>& intervals) {
        const int n = static_cast<int>(intervals.size());
        if (n <= 1) return n;

        std::sort(intervals.begin(), intervals.end(),
                  [](const std::vector<int>& a, const std::vector<int>& b) {
                      if (a[0] != b[0]) return a[0] < b[0];
                      return a[1] < b[1];
                  });

        // Min-heap of end times
        std::priority_queue<int, std::vector<int>, std::greater<int>> minHeap;
        int maxRooms = 0;

        for (const auto& iv : intervals) {
            int start = iv[0], end = iv[1];
            while (!minHeap.empty() && minHeap.top() <= start) {
                minHeap.pop();
            }
            minHeap.push(end);
            if (static_cast<int>(minHeap.size()) > maxRooms) {
                maxRooms = static_cast<int>(minHeap.size());
            }
        }
        return maxRooms;
    }
};