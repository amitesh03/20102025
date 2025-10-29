import { create } from 'zustand'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  total: number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  
  addItem: (item) => {
    const { items } = get()
    const existingItem = items.find(i => i.id === item.id)
    
    if (existingItem) {
      set({
        items: items.map(i =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      })
    } else {
      set({ items: [...items, { ...item, quantity: 1 }] })
    }
  },
  
  removeItem: (id) => {
    set({ items: get().items.filter(item => item.id !== id) })
  },
  
  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      get().removeItem(id)
    } else {
      set({
        items: get().items.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      })
    }
  },
  
  clearCart: () => {
    set({ items: [] })
  },
  
  get total() {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }
}))

interface CounterStore {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
}

export const useCounterStore = create<CounterStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 })
}))