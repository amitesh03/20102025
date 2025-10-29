/*
LeetCode 841. Keys and Rooms
Link: https://leetcode.com/problems/keys-and-rooms/

Question:
You are given an array rooms where each room i contains a list of keys to other rooms.
Initially, you are in room 0, all other rooms are locked. Return true if you can visit every room.

Constraints:
- n == rooms.size, 1 <= n <= 1000
- 0 <= rooms[i].size <= 1000
- keys are integers in [0, n-1]

Approach (BFS/DFS):
- Treat rooms as an adjacency list. Start from room 0, BFS through keys unlocking rooms.
- Maintain visited array; push newly discovered rooms to queue.
- After BFS, check if all rooms visited.

Complexity:
- Time: O(V + E) over rooms and keys
- Space: O(V) for visited and queue
*/

#include <vector>
#include <queue>

class Solution {
public:
    bool canVisitAllRooms(std::vector<std::vector<int>>& rooms) {
        int n = (int)rooms.size();
        if (n == 0) return true;

        std::vector<char> seen(n, 0);
        std::queue<int> q;
        seen[0] = 1;
        q.push(0);

        while (!q.empty()) {
            int u = q.front();
            q.pop();
            const std::vector<int>& nbrs = rooms[u];
            for (size_t i = 0; i < nbrs.size(); ++i) {
                int v = nbrs[i];
                if (!seen[v]) {
                    seen[v] = 1;
                    q.push(v);
                }
            }
        }
        for (int i = 0; i < n; ++i) {
            if (!seen[i]) return false;
        }
        return true;
    }
};