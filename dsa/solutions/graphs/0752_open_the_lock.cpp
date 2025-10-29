/*
LeetCode 752. Open the Lock
Link: https://leetcode.com/problems/open-the-lock/

Question:
You are given a lock with four circular wheels each with digits 0-9. The lock initially shows "0000".
A move consists of turning one wheel up or down by one digit (with wrap-around 9->0 and 0->9).
You are also given a list of deadend combinations. If the lock displays any deadend, it is frozen.
Given a target combination, return the minimum number of moves to open the lock, or -1 if impossible.

Constraints:
- 1 <= deadends.length <= 10^4
- deadends[i].length == 4
- target.length == 4

Approach (BFS shortest path on implicit graph):
- Treat each combination as a node; edges connect states one wheel-turn apart.
- Use an unordered_set for deadends and visited. Start from "0000" if not dead.
- BFS level-by-level; for each state, generate up to 8 neighbors (two directions per wheel).
- If we reach target, return the number of levels taken.

Complexity:
- Time: O(10^4) in practice due to pruning by dead/visited
- Space: O(10^4)
*/

#include <string>
#include <vector>
#include <unordered_set>
#include <queue>

class Solution {
public:
    int openLock(std::vector<std::string>& deadends, std::string target) {
        const std::string start = "0000";
        std::unordered_set<std::string> dead(deadends.begin(), deadends.end());
        if (dead.find(start) != dead.end()) return -1;
        if (target == start) return 0;

        std::queue<std::string> q;
        std::unordered_set<std::string> vis;
        q.push(start);
        vis.insert(start);
        int steps = 0;

        auto bump = [](char ch, int delta) -> char {
            int d = ch - '0';
            d = (d + delta + 10) % 10;
            return static_cast<char>('0' + d);
        };

        while (!q.empty()) {
            int sz = (int)q.size();
            for (int i = 0; i < sz; ++i) {
                std::string cur = q.front(); q.pop();
                if (cur == target) return steps;
                for (int pos = 0; pos < 4; ++pos) {
                    char orig = cur[pos];
                    // turn up
                    cur[pos] = bump(orig, +1);
                    if (!dead.count(cur) && !vis.count(cur)) {
                        vis.insert(cur);
                        q.push(cur);
                    }
                    // turn down
                    cur[pos] = bump(orig, -1);
                    if (!dead.count(cur) && !vis.count(cur)) {
                        vis.insert(cur);
                        q.push(cur);
                    }
                    // restore for next wheel position
                    cur[pos] = orig;
                }
            }
            ++steps;
        }
        return -1;
    }
};