/*
LeetCode 347. Top K Frequent Elements
Link: https://leetcode.com/problems/top-k-frequent-elements/

Question:
Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.

Constraints:
- 1 <= nums.length <= 10^5
- -10^9 <= nums[i] <= 10^9
- k is in the range [1, the number of unique elements in the array]
*/

#include <vector>
#include <unordered_map>
#include <queue>
#include <functional>

class Solution {
public:
    std::vector<int> topKFrequent(std::vector<int>& nums, int k) {
        std::unordered_map<int,int> freq;
        for (int x : nums) ++freq[x];

        using P = std::pair<int,int>; // {count, value}
        std::priority_queue<P, std::vector<P>, std::greater<P>> minHeap;

        for (const auto& kv : freq) {
            minHeap.push(P(kv.second, kv.first));
            if ((int)minHeap.size() > k) minHeap.pop();
        }

        std::vector<int> ans;
        while (!minHeap.empty()) {
            ans.push_back(minHeap.top().second);
            minHeap.pop();
        }
        return ans;
    }
};

/*
Approach:
- Count frequencies with unordered_map.
- Maintain a size-k min-heap keyed by frequency; pop when size exceeds k.
- Extract heap contents as the answer.

Complexity:
- Time: O(n log k), where n is nums.size()
- Space: O(n) for frequency map and heap
*/

#ifdef LOCAL_TEST
#include <iostream>
int main() {
    std::vector<int> nums = {1,1,1,2,2,3};
    Solution sol;
    auto v = sol.topKFrequent(nums, 2);
    for (int x : v) std::cout << x << " ";
    std::cout << "\n";
    return 0;
}
#endif