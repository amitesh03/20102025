/*
LeetCode 739. Daily Temperatures
Link: https://leetcode.com/problems/daily-temperatures/

Question:
Given an array of integers temperatures representing the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature. If there is no future day for which this is possible, keep answer[i] = 0.

Constraints:
- 1 <= temperatures.length <= 10^5
- 30 <= temperatures[i] <= 100
*/

#include <vector>
#include <stack>
#include <cstddef>

class Solution {
public:
    std::vector<int> dailyTemperatures(std::vector<int>& temperatures) {
        std::size_t n = temperatures.size();
        std::vector<int> answer(n, 0);
        std::stack<std::size_t> st; // store indices, temperatures decreasing
        for (std::size_t i = 0; i < n; ++i) {
            while (!st.empty() && temperatures[i] > temperatures[st.top()]) {
                std::size_t idx = st.top(); st.pop();
                answer[idx] = static_cast<int>(i - idx);
            }
            st.push(i);
        }
        return answer;
    }
};

/*
Approach:
- Maintain a monotonic decreasing stack of indices. For each day i, pop indices with temperature less than temperatures[i], and set answer for those indices to i - idx.

Complexity:
- Time: O(n), each index is pushed and popped at most once.
- Space: O(n) for the stack and answer.
*/

#ifdef LOCAL_TEST
#include <iostream>
int main() {
    std::vector<int> t = {73,74,75,71,69,72,76,73};
    Solution sol;
    std::vector<int> a = sol.dailyTemperatures(t);
    for (std::size_t i = 0; i < a.size(); ++i) {
        std::cout << a[i] << (i + 1 < a.size() ? ' ' : '\n');
    }
    return 0;
}
#endif