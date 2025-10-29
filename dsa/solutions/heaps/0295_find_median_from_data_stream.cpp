/*
LeetCode 295. Find Median from Data Stream
Link: https://leetcode.com/problems/find-median-from-data-stream/

Question:
The MedianFinder class supports adding integers and retrieving the median of all elements added so far.
Implement the data structure with addNum and findMedian methods.

Constraints:
- addNum called up to 5 * 10^4 times
- -10^5 <= num <= 10^5
- There will be at least one element when calling findMedian
*/

#include <queue>
#include <vector>
#include <functional>

class MedianFinder {
public:
    MedianFinder() = default;

    void addNum(int num) {
        if (maxHeap.empty() || num <= maxHeap.top()) {
            maxHeap.push(num);
        } else {
            minHeap.push(num);
        }
        // Rebalance
        if (maxHeap.size() > minHeap.size() + 1) {
            minHeap.push(maxHeap.top());
            maxHeap.pop();
        } else if (minHeap.size() > maxHeap.size()) {
            maxHeap.push(minHeap.top());
            minHeap.pop();
        }
    }

    double findMedian() const {
        if (maxHeap.size() == minHeap.size()) {
            if (maxHeap.empty()) return 0.0;
            return (maxHeap.top() + minHeap.top()) / 2.0;
        }
        return static_cast<double>(maxHeap.top());
    }

private:
    std::priority_queue<int> maxHeap; // lower half
    std::priority_queue<int, std::vector<int>, std::greater<int>> minHeap; // upper half
};