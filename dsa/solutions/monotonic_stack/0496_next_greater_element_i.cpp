/*
LeetCode 496. Next Greater Element I
Link: https://leetcode.com/problems/next-greater-element-i/

Question:
You are given two arrays nums1 and nums2 where nums1 is a subset of nums2.
For each element in nums1, find the next greater element in nums2. If it does not exist, return -1.

Constraints:
- 1 <= nums1.length, nums2.length <= 1000
- -10^9 <= nums[i] <= 10^9
- All elements of nums1 are unique and present in nums2; nums2 elements are unique.

Approach (Monotonic Stack over nums2):
- Process nums2 once maintaining a decreasing stack of values.
- When current x > stack.top(), x is the next greater for stack.top(); pop and record.
- After processing, remaining stack elements have no next greater; map to -1.
- Build result for nums1 by lookup in the map.

Complexity:
- Time: O(n + m) where n = |nums2|, m = |nums1|
- Space: O(n) for the map/stack
*/

#include <vector>
#include <unordered_map>
#include <stack>

class Solution {
public:
    std::vector<int> nextGreaterElement(std::vector<int>& nums1, std::vector<int>& nums2) {
        std::unordered_map<int, int> next;
        std::stack<int> st;
        for (int i = 0; i < (int)nums2.size(); ++i) {
            int x = nums2[i];
            while (!st.empty() && x > st.top()) {
                next[st.top()] = x;
                st.pop();
            }
            st.push(x);
        }
        while (!st.empty()) {
            next[st.top()] = -1;
            st.pop();
        }
        std::vector<int> ans;
        ans.reserve(nums1.size());
        for (int i = 0; i < (int)nums1.size(); ++i) {
            int v = nums1[i];
            auto it = next.find(v);
            ans.push_back(it == next.end() ? -1 : it->second);
        }
        return ans;
    }
};