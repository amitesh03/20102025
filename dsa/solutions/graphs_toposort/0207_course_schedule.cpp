/*
LeetCode 207. Course Schedule
Link: https://leetcode.com/problems/course-schedule/

Question:
There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given
an array prerequisites where prerequisites[i] = [a, b] indicates that you must take course b first if
you want to take course a. Return true if it is possible to finish all courses; otherwise, return false.

Constraints:
- 1 <= numCourses <= 2000
- 0 <= prerequisites.length <= 5000
- prerequisites[i].length == 2
- 0 <= ai, bi < numCourses
- All pairs [ai, bi] are distinct

Approach (Topological Sort - Kahn's Algorithm):
- Build a directed graph: b -> a for each prerequisite [a, b].
- Compute indegree of each node.
- Initialize a queue with all nodes having indegree 0 (can be taken immediately).
- Pop a node, "take" it (increment taken count), and reduce indegree of its neighbors.
- If a neighbor's indegree becomes 0, push it into the queue.
- If we can take all numCourses, return true; otherwise false (cycle exists).

Complexity:
- Time: O(V + E) where V = numCourses, E = prerequisites.length
- Space: O(V + E)
*/

#include <vector>
#include <queue>

class Solution {
public:
    bool canFinish(int numCourses, std::vector<std::vector<int>>& prerequisites) {
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

        int taken = 0;
        while (!q.empty()) {
            int u = q.front(); q.pop();
            ++taken;
            const std::vector<int>& nbrs = adj[u];
            for (size_t i = 0; i < nbrs.size(); ++i) {
                int v = nbrs[i];
                if (--indeg[v] == 0) q.push(v);
            }
        }

        return taken == numCourses;
    }
};