/*
LeetCode 210. Course Schedule II
Link: https://leetcode.com/problems/course-schedule-ii/

Question:
There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1.
Some courses may have prerequisites given as pairs [a, b] meaning b must be taken before a.
Return the ordering of courses you should take to finish all courses. If there are multiple valid answers, return any of them.
If it is impossible to finish all courses, return an empty array.

Constraints:
- 1 <= numCourses <= 10^5
- 0 <= prerequisites.length <= 10^5
- prerequisites[i].length == 2
- 0 <= ai, bi < numCourses
*/

#include <vector>
#include <queue>
#include <cstddef>

class Solution {
public:
    std::vector<int> findOrder(int numCourses, std::vector<std::vector<int>>& prerequisites) {
        if (numCourses <= 0) return {};
        std::vector<std::vector<int>> adj(numCourses);
        std::vector<int> indeg(numCourses, 0);
        for (std::size_t i = 0; i < prerequisites.size(); ++i) {
            int a = prerequisites[i][0];
            int b = prerequisites[i][1];
            if (b < 0 || b >= numCourses || a < 0 || a >= numCourses) continue;
            adj[b].push_back(a);
            ++indeg[a];
        }
        std::queue<int> q;
        for (int i = 0; i < numCourses; ++i) {
            if (indeg[i] == 0) q.push(i);
        }
        std::vector<int> order;
        order.reserve(static_cast<std::size_t>(numCourses));
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            order.push_back(u);
            const std::vector<int>& nbrs = adj[u];
            for (std::size_t k = 0; k < nbrs.size(); ++k) {
                int v = nbrs[k];
                --indeg[v];
                if (indeg[v] == 0) q.push(v);
            }
        }
        if (static_cast<int>(order.size()) != numCourses) return {};
        return order;
    }
};

/*
Approach:
- Build adjacency list and indegree counts.
- Use Kahn's algorithm to produce a topological ordering.
- If not all nodes are processed, a cycle exists; return empty.

Complexity:
- Time: O(numCourses + prerequisites.length)
- Space: O(numCourses + prerequisites.length)
*/

#ifdef LOCAL_TEST
#include <iostream>
int main() {
    Solution sol;
    int num = 4;
    std::vector<std::vector<int>> pre = {{1,0},{2,0},{3,1},{3,2}};
    std::vector<int> res = sol.findOrder(num, pre);
    for (std::size_t i = 0; i < res.size(); ++i) {
        if (i) std::cout << ' ';
        std::cout << res[i];
    }
    std::cout << "\n";
    return 0;
}
#endif