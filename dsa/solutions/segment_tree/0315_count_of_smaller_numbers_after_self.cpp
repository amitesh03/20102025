/*
LeetCode 315. Count of Smaller Numbers After Self
Link: https://leetcode.com/problems/count-of-smaller-numbers-after-self/

Question:
Given an integer array nums, return a new counts array such that counts[i] is the number of smaller elements to the right of nums[i].

Constraints:
- 1 <= nums.length <= 10^5
- -10^4 <= nums[i] <= 10^4
*/

#include <vector>
#include <algorithm>
#include <cstddef>

class Solution {
private:
    static inline int lowbit(int x) { return x & -x; }

    void add(std::vector<int>& bit, int idx, int delta) {
        for (int i = idx; i < static_cast<int>(bit.size()); i += lowbit(i)) bit[i] += delta;
    }

    int sum(const std::vector<int>& bit, int idx) const {
        int s = 0;
        for (int i = idx; i > 0; i -= (i & -i)) s += bit[i];
        return s;
    }

public:
    std::vector<int> countSmaller(std::vector<int>& nums) {
        const int n = static_cast<int>(nums.size());
        std::vector<int> ans(n, 0);
        if (n == 0) return ans;

        std::vector<int> vals = nums;
        std::sort(vals.begin(), vals.end());
        vals.erase(std::unique(vals.begin(), vals.end()), vals.end());

        auto getIndex = [&](int x) {
            return static_cast<int>(std::lower_bound(vals.begin(), vals.end(), x) - vals.begin()) + 1;
        };

        std::vector<int> bit(static_cast<std::size_t>(vals.size() + 1), 0);

        for (int i = n - 1; i >= 0; --i) {
            int idx = getIndex(nums[i]);
            ans[i] = sum(bit, idx - 1);
            add(bit, idx, 1);
        }
        return ans;
    }
};

/*
Approach:
- Coordinate compress values and use a 1-indexed Binary Indexed Tree (Fenwick).
- Iterate from right to left: for each value, query prefix count strictly less (idx-1), then add current value.

Complexity:
- Time: O(n log n) for compression and BIT ops.
- Space: O(n) for BIT and compression arrays.
*/

#ifdef LOCAL_TEST
#include <iostream>
int main() {
    std::vector<int> nums = {5,2,6,1};
    Solution sol;
    std::vector<int> res = sol.countSmaller(nums);
    for (std::size_t i = 0; i < res.size(); ++i) {
        if (i) std::cout << ' ';
        std::cout << res[i];
    }
    std::cout << "\n"; // 2 1 1 0
    return 0;
}
#endif