/*
LeetCode 373. Find K Pairs with Smallest Sums
Link: https://leetcode.com/problems/find-k-pairs-with-smallest-sums/

Question:
Given two integer arrays nums1 and nums2 sorted in ascending order, return the k pairs (u, v)
with the smallest sums where u is from nums1 and v is from nums2.

Constraints:
- 1 <= nums1.length, nums2.length <= 10^5
- -10^9 <= nums1[i], nums2[i] <= 10^9
- nums1 and nums2 are non-decreasing (sorted).
- 1 <= k <= 10^5
*/

#include <vector>
#include <queue>
#include <functional>
#include <algorithm>
#include <cstddef>

class Solution {
public:
    std::vector<std::vector<int>> kSmallestPairs(std::vector<int>& nums1, std::vector<int>& nums2, int k) {
        std::vector<std::vector<int>> res;
        const int n1 = (int)nums1.size();
        const int n2 = (int)nums2.size();
        if (n1 == 0 || n2 == 0 || k <= 0) return res;

        using Node = std::pair<long long, std::pair<int,int>>; // {sum, {i,j}}
        auto cmp = [](const Node& a, const Node& b) { return a.first > b.first; };
        std::priority_queue<Node, std::vector<Node>, decltype(cmp)> pq(cmp);

        const int init = std::min(n1, k);
        for (int i = 0; i < init; ++i) {
            pq.push(Node((long long)nums1[i] + (long long)nums2[0], {i, 0}));
        }

        while (!pq.empty() && (int)res.size() < k) {
            Node cur = pq.top(); pq.pop();
            int i = cur.second.first;
            int j = cur.second.second;
            res.push_back({nums1[i], nums2[j]});
            if (j + 1 < n2) {
                pq.push(Node((long long)nums1[i] + (long long)nums2[j+1], {i, j+1}));
            }
        }
        return res;
    }
};

/*
Approach:
- Use a min-heap seeded with pairs (i, 0) for i in [0, min(n1, k)).
- Each heap node stores sum and indices (i, j). Pop smallest, push next pair (i, j+1).
- Collect up to k pairs.

Complexity:
- Time: O(k log min(n1, k) + k log n1) ~ O(k log n1), bounded by available pairs.
- Space: O(min(n1, k)) for the heap, plus O(k) for the result.
*/

#ifdef LOCAL_TEST
#include <iostream>
int main() {
    std::vector<int> nums1 = {1,7,11};
    std::vector<int> nums2 = {2,4,6};
    Solution sol;
    auto ans = sol.kSmallestPairs(nums1, nums2, 3);
    for (const auto& p : ans) std::cout << p[0] << "," << p[1] << " ";
    std::cout << "\n"; // 1,2 1,4 1,6
    return 0;
}
#endif