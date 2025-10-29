/*
LeetCode 239. Sliding Window Maximum
Link: https://leetcode.com/problems/sliding-window-maximum/

Question:
You are given an array of integers nums, and an integer k. There is a sliding window of size k which moves from left to right across the array.
Return the maximum value in the window for each position.

Constraints:
- 1 <= nums.length <= 10^5
- -10^4 <= nums[i] <= 10^4
- 1 <= k <= nums.length
*/

#include <vector>
#include <deque>

using namespace std;

class Solution {
public:
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        int n = (int)nums.size();
        vector<int> ans;
        ans.reserve(n ? n - k + 1 : 0);
        deque<int> dq; // indices, values decreasing
        for (int i = 0; i < n; ++i) {
            // pop front if out of window
            if (!dq.empty() && dq.front() <= i - k) dq.pop_front();
            // pop back while current num >= back's num
            while (!dq.empty() && nums[i] >= nums[dq.back()]) dq.pop_back();
            dq.push_back(i);
            if (i >= k - 1) ans.push_back(nums[dq.front()]);
        }
        return ans;
    }
};

/*
Approach:
- Use deque of indices maintaining decreasing values; front is max in window; remove out-of-window indices; 
- At each i, push ans when i >= k-1.

Complexity:
- Time: O(n)
- Space: O(k)
*/

#ifdef LOCAL_TEST
#include <iostream>
int main() {
    Solution sol;
    vector<int> a = {1,3,-1,-3,5,3,6,7};
    vector<int> r = sol.maxSlidingWindow(a, 3);
    for (size_t i = 0; i < r.size(); ++i) {
        cout << r[i] << (i+1<r.size() ? ' ' : '\n');
    }
    return 0;
}
#endif