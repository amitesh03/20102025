/*
LeetCode 207. Course Schedule
Link: https://leetcode.com/problems/course-schedule/

Question:
There are a total of numCourses courses given as prerequisite pairs [a, b] meaning you must take course b before course a.
Return true if you can finish all courses (i.e., the directed graph has no cycle), otherwise false.

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
    bool canFinish(int numCourses, std::vector<std::vector<int>>& prerequisites) {
        if (numCourses <= 0) return true;
        std::vector<std::vector<int>> adj(numCourses);
        std::vector<int> indeg(numCourses, 0);
        // Build graph: edge b -> a (take b before a)
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
        int taken = 0;
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            ++taken;
            const std::vector<int>& nbrs = adj[u];
            for (std::size_t k = 0; k < nbrs.size(); ++k) {
                int v = nbrs[k];
                --indeg[v];
                if (indeg[v] == 0) q.push(v);
            }
        }
        return taken == numCourses;
    }
};

/*
Approach:
- Build adjacency list and indegree counts.
- Use Kahn's algorithm (BFS): enqueue courses with indegree 0, pop and reduce indegrees of neighbors.
- If we process all courses, no cycle exists; otherwise a cycle prevents completion.

Complexity:
- Time: O(numCourses + prerequisites.length)
- Space: O(numCourses + prerequisites.length)
*/