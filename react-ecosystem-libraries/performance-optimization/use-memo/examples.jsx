/**
 * React useMemo Examples
 * 
 * useMemo() is a hook that memoizes expensive calculations
 * and returns the memoized value. It only recalculates
 * when one of its dependencies changes.
 */

// Example 1: Basic useMemo usage
/*
// components/ExpensiveCalculation.js
import React, { useState } from 'react';

function ExpensiveCalculation({ data }) {
  // Without useMemo, this calculation runs on every render
  const expensiveValue = data.reduce((sum, item) => {
    // Simulate expensive computation
    for (let i = 0; i < 1000; i++) {
      Math.sqrt(item.value);
    }
    return sum + item.value;
  }, 0);
  
  return (
    <div>
      <h2>Expensive Calculation Result: {expensiveValue}</h2>
    </div>
  );
}

export default ExpensiveCalculation;

// components/OptimizedCalculation.js
import React, { useMemo } from 'react';

function OptimizedCalculation({ data }) {
  // With useMemo, this calculation only runs when data changes
  const expensiveValue = useMemo(() => {
    console.log('Performing expensive calculation...');
    return data.reduce((sum, item) => {
      // Simulate expensive computation
      for (let i = 0; i < 1000; i++) {
        Math.sqrt(item.value);
      }
      return sum + item.value;
    }, 0);
  }, [data]);
  
  return (
    <div>
      <h2>Optimized Calculation Result: {expensiveValue}</h2>
    </div>
  );
}

export default OptimizedCalculation;
*/

// Example 2: useMemo with multiple dependencies
/*
// components/FilteredList.js
import React, { useState, useMemo } from 'react';

function FilteredList({ items, filterText, minPrice }) {
  // Memoize the filtered list calculation
  const filteredItems = useMemo(() => {
    console.log('Filtering items...');
    
    return items.filter(item => {
      const matchesText = item.name.toLowerCase().includes(filterText.toLowerCase());
      const aboveMinPrice = item.price >= minPrice;
      
      return matchesText && aboveMinPrice;
    });
  }, [items, filterText, minPrice]);
  
  const totalValue = useMemo(() => {
    return filteredItems.reduce((sum, item) => sum + item.price, 0);
  }, [filteredItems]);
  
  return (
    <div>
      <h2>Filtered Items ({filteredItems.length})</h2>
      <p>Total Value: ${totalValue.toFixed(2)}</p>
      <ul>
        {filteredItems.map(item => (
          <li key={item.id}>
            {item.name} - ${item.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FilteredList;
*/

// Example 3: useMemo with complex objects
/*
// components/UserAnalytics.js
import React, { useMemo } from 'react';

function UserAnalytics({ users, activities }) {
  // Memoize complex analytics calculations
  const analytics = useMemo(() => {
    console.log('Calculating analytics...');
    
    const userMap = new Map(users.map(user => [user.id, user]));
    
    const userStats = users.map(user => {
      const userActivities = activities.filter(activity => activity.userId === user.id);
      
      return {
        userId: user.id,
        name: user.name,
        totalActivities: userActivities.length,
        lastActivity: userActivities.length > 0 
          ? userActivities[userActivities.length - 1].timestamp 
          : null,
        activityTypes: [...new Set(userActivities.map(activity => activity.type))],
        totalDuration: userActivities.reduce((sum, activity) => sum + activity.duration, 0)
      };
    });
    
    const overallStats = {
      totalUsers: users.length,
      totalActivities: activities.length,
      averageActivitiesPerUser: activities.length / users.length,
      mostActiveUser: userStats.reduce((mostActive, user) => 
        user.totalActivities > mostActive.totalActivities ? user : mostActive
      , userStats[0] || {}),
      activityTypeDistribution: activities.reduce((dist, activity) => {
        dist[activity.type] = (dist[activity.type] || 0) + 1;
        return dist;
      }, {})
    };
    
    return {
      userStats,
      overallStats
    };
  }, [users, activities]);
  
  return (
    <div>
      <h2>User Analytics</h2>
      <div>
        <h3>Overall Statistics</h3>
        <p>Total Users: {analytics.overallStats.totalUsers}</p>
        <p>Total Activities: {analytics.overallStats.totalActivities}</p>
        <p>Average Activities per User: {analytics.overallStats.averageActivitiesPerUser.toFixed(2)}</p>
        <p>Most Active User: {analytics.overallStats.mostActiveUser.name}</p>
      </div>
      
      <div>
        <h3>User Statistics</h3>
        {analytics.userStats.map(user => (
          <div key={user.userId} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd' }}>
            <h4>{user.name}</h4>
            <p>Total Activities: {user.totalActivities}</p>
            <p>Activity Types: {user.activityTypes.join(', ')}</p>
            <p>Total Duration: {user.totalDuration} minutes</p>
            <p>Last Activity: {user.lastActivity ? new Date(user.lastActivity).toLocaleString() : 'No activities'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserAnalytics;
*/

// Example 4: useMemo with DOM calculations
/*
// components/VirtualizedList.js
import React, { useMemo } from 'react';

function VirtualizedList({ items, itemHeight = 50, containerHeight = 300 }) {
  // Memoize virtualization calculations
  const virtualizationData = useMemo(() => {
    console.log('Calculating virtualization data...');
    
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const totalCount = items.length;
    const startIndex = Math.max(0, Math.min(
      Math.floor(window.scrollY / itemHeight),
      totalCount - visibleCount
    ));
    const endIndex = Math.min(startIndex + visibleCount, totalCount);
    
    const visibleItems = items.slice(startIndex, endIndex);
    const offsetY = startIndex * itemHeight;
    const totalHeight = totalCount * itemHeight;
    
    return {
      visibleItems,
      offsetY,
      totalHeight,
      startIndex,
      endIndex
    };
  }, [items, itemHeight, containerHeight]);
  
  return (
    <div style={{ height: containerHeight, overflow: 'auto' }}>
      <div 
        style={{
          height: virtualizationData.totalHeight,
          position: 'relative'
        }}
      >
        <div 
          style={{
            transform: `translateY(${virtualizationData.offsetY}px)`
          }}
        >
          {virtualizationData.visibleItems.map((item, index) => (
            <div 
              key={item.id}
              style={{
                height: itemHeight,
                position: 'absolute',
                top: (virtualizationData.startIndex + index) * itemHeight,
                width: '100%'
              }}
            >
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VirtualizedList;
*/

// Example 5: useMemo with sorting and filtering
/*
// components/SortableFilteredList.js
import React, { useState, useMemo } from 'react';

function SortableFilteredList({ items, sortBy, sortOrder = 'asc', filterBy }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Memoize sorting and filtering operations
  const processedItems = useMemo(() => {
    console.log('Processing items...');
    
    // First filter items
    let filtered = items;
    if (filterBy && searchTerm) {
      filtered = items.filter(item => 
        item[filterBy].toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Then sort the filtered items
    const sorted = [...filtered].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
    
    return sorted;
  }, [items, sortBy, sortOrder, filterBy, searchTerm]);
  
  // Memoize statistics
  const statistics = useMemo(() => {
    return {
      total: items.length,
      filtered: processedItems.length,
      average: processedItems.reduce((sum, item) => sum + (item.price || 0), 0) / processedItems.length,
      max: Math.max(...processedItems.map(item => item.price || 0)),
      min: Math.min(...processedItems.map(item => item.price || 0))
    };
  }, [items, processedItems]);
  
  return (
    <div>
      <h2>Sortable Filtered List</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price</option>
          <option value="date">Sort by Date</option>
        </select>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      
      <div>
        <h3>Statistics</h3>
        <p>Total Items: {statistics.total}</p>
        <p>Filtered Items: {statistics.filtered}</p>
        <p>Average Price: ${statistics.average.toFixed(2)}</p>
        <p>Max Price: ${statistics.max.toFixed(2)}</p>
        <p>Min Price: ${statistics.min.toFixed(2)}</p>
      </div>
      
      <ul>
        {processedItems.map(item => (
          <li key={item.id}>
            {item.name} - ${item.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SortableFilteredList;
*/

// Example 6: useMemo with derived state
/*
// components/ShoppingCart.js
import React, { useMemo } from 'react';

function ShoppingCart({ items, taxRate = 0.08, shippingThreshold = 50 }) {
  // Memoize all cart calculations
  const cartCalculations = useMemo(() => {
    console.log('Calculating cart totals...');
    
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const tax = subtotal * taxRate;
    const shipping = subtotal >= shippingThreshold ? 0 : 10;
    const total = subtotal + tax + shipping;
    
    // Group items by category
    const itemsByCategory = items.reduce((groups, item) => {
      const category = item.category || 'Other';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
      return groups;
    }, {});
    
    return {
      subtotal,
      tax,
      shipping,
      total,
      itemCount,
      itemsByCategory,
      hasFreeShipping: subtotal >= shippingThreshold
    };
  }, [items, taxRate, shippingThreshold]);
  
  // Memoize formatted values
  const formattedValues = useMemo(() => {
    return {
      subtotal: cartCalculations.subtotal.toFixed(2),
      tax: cartCalculations.tax.toFixed(2),
      shipping: cartCalculations.shipping.toFixed(2),
      total: cartCalculations.total.toFixed(2)
    };
  }, [cartCalculations]);
  
  return (
    <div>
      <h2>Shopping Cart</h2>
      
      <div>
        <h3>Items ({cartCalculations.itemCount})</h3>
        {Object.entries(cartCalculations.itemsByCategory).map(([category, categoryItems]) => (
          <div key={category} style={{ marginBottom: '15px' }}>
            <h4>{category}</h4>
            <ul>
              {categoryItems.map(item => (
                <li key={item.id}>
                  {item.name} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      <div style={{ borderTop: '1px solid #ddd', paddingTop: '15px' }}>
        <h3>Summary</h3>
        <p>Subtotal: ${formattedValues.subtotal}</p>
        <p>Tax: ${formattedValues.tax}</p>
        <p>Shipping: {formattedValues.shipping}</p>
        {cartCalculations.hasFreeShipping && (
          <p style={{ color: 'green' }}>Free Shipping!</p>
        )}
        <p><strong>Total: ${formattedValues.total}</strong></p>
      </div>
    </div>
  );
}

export default ShoppingCart;
*/

// Example 7: useMemo with TypeScript
/*
// components/TypedCalculator.tsx
import React, { useMemo } from 'react';

interface CalculationInput {
  numbers: number[];
  operation: 'sum' | 'average' | 'min' | 'max' | 'median';
}

interface CalculationResult {
  result: number;
  operation: string;
  timestamp: Date;
}

const TypedCalculator: React.FC<CalculationInput> = ({ numbers, operation }) => {
  // Memoize calculation with TypeScript
  const calculationResult = useMemo((): CalculationResult => {
    console.log(`Performing ${operation} calculation...`);
    
    const sortedNumbers = [...numbers].sort((a, b) => a - b);
    const count = sortedNumbers.length;
    
    let result: number;
    
    switch (operation) {
      case 'sum':
        result = numbers.reduce((sum, num) => sum + num, 0);
        break;
      case 'average':
        result = numbers.reduce((sum, num) => sum + num, 0) / count;
        break;
      case 'min':
        result = count > 0 ? sortedNumbers[0] : 0;
        break;
      case 'max':
        result = count > 0 ? sortedNumbers[count - 1] : 0;
        break;
      case 'median':
        const mid = Math.floor(count / 2);
        result = count % 2 === 0 
          ? (sortedNumbers[mid - 1] + sortedNumbers[mid]) / 2
          : sortedNumbers[mid];
        break;
      default:
        result = 0;
    }
    
    return {
      result,
      operation,
      timestamp: new Date()
    };
  }, [numbers, operation]);
  
  return (
    <div>
      <h2>Calculator Result</h2>
      <p>Operation: {calculationResult.operation}</p>
      <p>Result: {calculationResult.result.toFixed(2)}</p>
      <p>Calculated at: {calculationResult.timestamp.toLocaleString()}</p>
    </div>
  );
};

export default TypedCalculator;
*/

// Example 8: useMemo with performance monitoring
/*
// utils/performanceMonitor.js
export const withMemoPerformance = (WrappedComponent) => {
  const componentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  
  const MonitoredComponent = React.memo(function MonitoredComponent(props) {
    const memoizedValue = React.useMemo(() => {
      console.time(`${componentName} memoized calculation`);
      
      return props.calculateValue ? props.calculateValue(props.data) : props.data;
    }, [props.data]);
    
    React.useEffect(() => {
      console.timeEnd(`${componentName} memoized calculation`);
    });
    
    return <WrappedComponent {...props} memoizedValue={memoizedValue} />;
  });
  
  MonitoredComponent.displayName = `withMemoPerformance(${componentName})`;
  
  return MonitoredComponent;
};

// components/MonitoredExpensiveComponent.js
import React from 'react';
import { withMemoPerformance } from '../utils/performanceMonitor';

function ExpensiveComponent({ data }) {
  const calculateValue = (rawData) => {
    console.log('Processing expensive data...');
    return rawData.reduce((sum, item) => {
      // Simulate expensive operation
      for (let i = 0; i < 1000; i++) {
        Math.sqrt(item.value);
      }
      return sum + item.value;
    }, 0);
  };
  
  return (
    <div>
      <h2>Expensive Component</h2>
      <p>Calculated Value: {props.memoizedValue}</p>
    </div>
  );
}

export default withMemoPerformance(ExpensiveComponent);
*/

// Example 9: useMemo with caching strategy
/*
// utils/smartMemo.js
import { useMemo, useRef } from 'react';

// Smart memo that considers cache size and performance
export const useSmartMemo = (factory, deps, maxSize = 10) => {
  const cacheRef = useRef(new Map());
  
  return useMemo(() => {
    const cacheKey = JSON.stringify(deps);
    
    // Check cache first
    if (cacheRef.current.has(cacheKey)) {
      console.log('Cache hit for:', cacheKey);
      return cacheRef.current.get(cacheKey);
    }
    
    // Calculate new value
    const value = factory(...deps);
    
    // Update cache with LRU strategy
    if (cacheRef.current.size >= maxSize) {
      const firstKey = cacheRef.current.keys().next().value;
      cacheRef.current.delete(firstKey);
    }
    
    cacheRef.current.set(cacheKey, value);
    console.log('Cache miss for:', cacheKey);
    
    return value;
  }, deps);
};

// components/SmartCachedComponent.js
import React from 'react';
import { useSmartMemo } from '../utils/smartMemo';

function SmartCachedComponent({ data, config }) {
  // Smart memoized calculation
  const processedData = useSmartMemo(
    (rawData, config) => {
      console.log('Processing data with config:', config);
      return rawData.map(item => ({
        ...item,
        processed: item.value * (config.multiplier || 1),
        category: item.value > (config.threshold || 50) ? 'high' : 'low'
      }));
    },
    [data, config],
    5 // Cache max 5 different configurations
  );
  
  return (
    <div>
      <h2>Smart Cached Component</h2>
      <ul>
        {processedData.map(item => (
          <li key={item.id}>
            {item.name}: {item.processed.toFixed(2)} ({item.category})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SmartCachedComponent;
*/

// Example 10: Advanced useMemo patterns
/*
// hooks/useMemoizedState.js
import { useState, useMemo } from 'react';

// Hook that combines useState with useMemo for derived state
export const useMemoizedState = (initialState, dependencies = []) => {
  const [state, setState] = useState(initialState);
  
  // Memoize derived state calculations
  const derivedState = useMemo(() => {
    // Calculate derived values based on state
    const derived = {};
    
    // Example derived calculations
    if (state.items) {
      derived.totalItems = state.items.length;
      derived.totalValue = state.items.reduce((sum, item) => sum + (item.value || 0), 0);
      derived.averageValue = derived.totalItems > 0 ? derived.totalValue / derived.totalItems : 0;
    }
    
    if (state.filters) {
      derived.activeFilters = Object.entries(state.filters)
        .filter(([_, value]) => value !== null && value !== '')
        .map(([key, value]) => ({ key, value }));
    }
    
    return derived;
  }, [state, ...dependencies]);
  
  return [state, setState, derivedState];
};

// components/AdvancedStateComponent.js
import React from 'react';
import { useMemoizedState } from '../hooks/useMemoizedState';

function AdvancedStateComponent({ initialData }) {
  const [state, setState, derived] = useMemoizedState({
    items: initialData || [],
    filters: {
      search: '',
      category: '',
      minPrice: 0,
      maxPrice: Infinity
    }
  });
  
  const updateFilter = (filterKey, value) => {
    setState(prevState => ({
      ...prevState,
      filters: {
        ...prevState.filters,
        [filterKey]: value
      }
    }));
  };
  
  const filteredItems = useMemo(() => {
    return state.items.filter(item => {
      const matchesSearch = !state.filters.search || 
        item.name.toLowerCase().includes(state.filters.search.toLowerCase());
      
      const matchesCategory = !state.filters.category || item.category === state.filters.category;
      
      const matchesPriceRange = item.price >= state.filters.minPrice && 
        item.price <= state.filters.maxPrice;
      
      return matchesSearch && matchesCategory && matchesPriceRange;
    });
  }, [state.items, state.filters]);
  
  return (
    <div>
      <h2>Advanced State Component</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Filters</h3>
        <input
          type="text"
          placeholder="Search..."
          value={state.filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
        />
        <select 
          value={state.filters.category}
          onChange={(e) => updateFilter('category', e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
        </select>
        <input
          type="number"
          placeholder="Min Price"
          value={state.filters.minPrice}
          onChange={(e) => updateFilter('minPrice', Number(e.target.value))}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={state.filters.maxPrice}
          onChange={(e) => updateFilter('maxPrice', Number(e.target.value))}
        />
      </div>
      
      <div>
        <h3>Statistics</h3>
        <p>Total Items: {derived.totalItems}</p>
        <p>Filtered Items: {filteredItems.length}</p>
        <p>Total Value: ${derived.totalValue.toFixed(2)}</p>
        <p>Average Value: ${derived.averageValue.toFixed(2)}</p>
      </div>
      
      <div>
        <h3>Filtered Results</h3>
        <ul>
          {filteredItems.map(item => (
            <li key={item.id}>
              {item.name} - ${item.price}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdvancedStateComponent;
*/

export const useMemoExamples = {
  description: "Examples of using React useMemo() for optimizing expensive calculations",
  concepts: [
    "useMemo() - Hook for memoizing calculations",
    "Dependency array - Controls when calculation runs",
    "Memoization - Caching calculation results",
    "Derived state - Computing state from other state"
  ],
  benefits: [
    "Prevents expensive recalculations",
    "Improves rendering performance",
    "Reduces CPU usage",
    "Optimizes list operations",
    "Caches complex computations"
  ],
  whenToUse: [
    "Expensive calculations",
    "Complex data transformations",
    "Sorting and filtering operations",
    "Derived state calculations",
    "Virtualization calculations"
  ],
  whenNotToUse: [
    "Simple calculations",
    "Operations that run rarely",
    "Calculations with minimal performance impact",
    "State that changes frequently"
  ],
  bestPractices: [
    "Include all dependencies in the dependency array",
    "Keep dependency arrays stable",
    "Avoid complex objects in dependencies",
    "Profile to identify optimization opportunities",
    "Consider cache size for memoized values"
  ]
};