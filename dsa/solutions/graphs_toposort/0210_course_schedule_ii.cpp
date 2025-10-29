/*
LeetCode 210. Course Schedule II
Link: https://leetcode.com/problems/course-schedule-ii/

Question:
There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1.
You are given an array prerequisites where prerequisites[i] = [a, b] indicates that you must
take course b first if you want to take course a. Return any valid ordering of courses you
can take to finish all courses. If impossible, return an empty array.

Constraints:
- 1 <= numCourses <= 2000
- 0 <= prerequisites.length <= 5000
- prerequisites[i].length == 2
- 0 <= ai, bi < numCourses
- All pairs [ai, bi] are distinct

Approach (Topological Sort - Kahn's Algorithm):
- Build graph b->a, compute indegree.
- Push all indegree-0 nodes to queue.
- Pop node, append to order, decrement indegree of neighbors; when zero, push.
- If order covers all nodes, return it; otherwise return empty.

Complexity:
- Time: O(V + E)
- Space: O(V + E)
*/

#include <vector>
#include <queue>

class Solution {
public:
    std::vector<int> findOrder(int numCourses, std::vector<std::vector<int>>& prerequisites) {
        std::vector<std::vector<int>> adj(numCourses);
        std::vector<int> indeg(numCourses, 0);
        for (size_t i = 0; i < prerequisites.size(); ++i) {
            int a = prerequisites[i][0];
            int b = prerequisites[i][1];
            adj[b].push_back(a);
            ++indeg[a];
        }
        std::queue<int> q;
        for (int i = 0; i < numCourses; ++i) {
            if (indeg[i] == 0) q.push(i);
        }
        std::vector<int> order;
        order.reserve(numCourses);
        while (!q.empty()) {
            int u = q.front(); q.pop();
            order.push_back(u);
            const std::vector<int>& nbrs = adj[u];
            for (size_t i = 0; i < nbrs.size(); ++i) {
                int v = nbrs[i];
                if (--indeg[v] == 0) q.push(v);
            }
        }
        if (order.size() == (size_t)numCourses) return order;
        return {};
    }
};