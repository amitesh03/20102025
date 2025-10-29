/*
LeetCode 215. Kth Largest Element in an Array
Link: https://leetcode.com/problems/kth-largest-element-in-an-array/

Question:
Given an integer array nums and an integer k, return the kth largest element in the array.
Note that it is the kth largest element in the sorted order, not the kth distinct element.

Constraints:
- 1 <= nums.length <= 10^5
- -10^9 <= nums[i] <= 10^9
- 1 <= k <= nums.length
*/

#include <vector>
#include <queue>
#include <functional>
#include <cstddef>

class Solution {
public:
    int findKthLargest(std::vector<int>& nums, int k) {
        std::priority_queue<int, std::vector<int>, std::greater<int>> minHeap;
        for (std::vector<int>::const_iterator it = nums.begin(); it != nums.end(); ++it) {
            minHeap.push(*it);
            if (static_cast<int>(minHeap.size()) > k) minHeap.pop();
        }
        return minHeap.top();
    }
};

/*
Approach:
- Maintain a min-heap of size k; after pushing each element, pop if size > k.
- The root of the heap is the kth largest after processing all elements.

Complexity:
- Time: O(n log k)
- Space: O(k)
*/

#ifdef LOCAL_TEST
#include <iostream>
int main() {
    std::vector<int> nums = {3,2,1,5,6,4};
    Solution sol;
    std::cout << sol.findKthLargest(nums, 2) << "\n"; // 5
    return 0;
}
#endif