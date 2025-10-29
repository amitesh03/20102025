/*
LeetCode 632. Smallest Range Covering Elements from K Lists
Link: https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists/

Question:
You are given k lists of sorted integers nums. Choose a range [l, r] that includes at least one number from each list.
Return the smallest such range (by length r - l); if multiple, return any.

Constraints:
- k == nums.size(), 1 <= k
- Each nums[i] is sorted in non-decreasing order

Approach (K-way merge with min-heap):
- Push the first element of each list into a min-heap; track the current maximum among heap elements.
- Repeatedly pop the minimum; this anchors l. Update the best range with [l, currentMax].
- Advance within the list from which the min was taken; push its next element and update currentMax.
- Stop when any list is exhausted, since a valid cover cannot be formed afterward.

Complexity:
- Time: O(T log k), where T is the total number of pushed elements
- Space: O(k)
*/

#include <vector>
#include <queue>
#include <climits>
#include <algorithm>

class Solution {
public:
    std::vector<int> smallestRange(std::vector<std::vector<int>>& nums) {
        struct Node {
            int val;
            int row;
            int idx;
        };
        struct Cmp {
            bool operator()(const Node& a, const Node& b) const {
                return a.val > b.val; // min-heap by value
            }
        };

        const int k = static_cast<int>(nums.size());
        std::priority_queue<Node, std::vector<Node>, Cmp> pq;
        int currentMax = INT_MIN;

        for (int i = 0; i < k; ++i) {
            if (nums[i].empty()) return {0, 0}; // edge-case guard
            int v = nums[i][0];
            pq.push(Node{v, i, 0});
            if (v > currentMax) currentMax = v;
        }

        int bestL = 0, bestR = INT_MAX;

        while (!pq.empty()) {
            Node cur = pq.top(); pq.pop();
            int curMin = cur.val;
            if (currentMax - curMin < bestR - bestL) {
                bestL = curMin;
                bestR = currentMax;
            }

            int nextIdx = cur.idx + 1;
            if (nextIdx >= static_cast<int>(nums[cur.row].size())) {
                break; // cannot cover all lists further
            }
            int nextVal = nums[cur.row][nextIdx];
            pq.push(Node{nextVal, cur.row, nextIdx});
            if (nextVal > currentMax) currentMax = nextVal;
        }

        return {bestL, bestR};
    }
};