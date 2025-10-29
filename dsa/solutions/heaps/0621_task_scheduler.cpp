/*
LeetCode 621. Task Scheduler
Link: https://leetcode.com/problems/task-scheduler/

Question:
Given a char array tasks representing tasks A-Z, each task takes one interval to finish and must wait for at least n intervals
before executing again. Return the least number of intervals the CPU will take to finish all the given tasks.

Constraints:
- 1 <= tasks.length <= 10^4
- tasks[i] is an uppercase English letter.
- 0 <= n <= 100
*/

#include <vector>
#include <array>
#include <algorithm>
#include <cstddef>

class Solution {
public:
    int leastInterval(std::vector<char>& tasks, int n) {
        std::array<int, 26> cnt{};
        for (char c : tasks) {
            ++cnt[c - 'A'];
        }
        int maxFreq = *std::max_element(cnt.begin(), cnt.end());
        int maxCount = 0;
        for (int f : cnt) {
            if (f == maxFreq) ++maxCount;
        }
        long long part = static_cast<long long>(maxFreq - 1) * (n + 1) + maxCount;
        long long total = static_cast<long long>(tasks.size());
        return static_cast<int>(std::max(part, total));
    }
};

/*
Approach:
- Let maxFreq be the maximum frequency of any task, and maxCount be the number of tasks with that frequency.
- The minimal schedule length is max(tasks.size(), (maxFreq - 1) * (n + 1) + maxCount).
- This constructs maxFreq - 1 full "frames" of length (n + 1), then places the maxCount tasks in the final frame.

Complexity:
- Time: O(26 + tasks.length) = O(tasks.length)
- Space: O(1)
*/

#ifdef LOCAL_TEST
#include <iostream>
int main() {
    std::vector<char> tasks1 = {'A','A','A','B','B','B'};
    int n1 = 2;
    Solution sol;
    std::cout << sol.leastInterval(tasks1, n1) << "\n"; // 8

    std::vector<char> tasks2 = {'A','A','A','A','B','C','D','E','F','G'};
    int n2 = 2;
    std::cout << sol.leastInterval(tasks2, n2) << "\n"; // 10
    return 0;
}
#endif