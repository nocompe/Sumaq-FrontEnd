import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  cantidad: number;
  nota?: string;
}

interface CartCtx {
  items: CartItem[];
  add: (p: { id: number; nombre: string; precio: number | string; imagen: string }) => void;
  inc: (id: number) => void;
  dec: (id: number) => void;
  remove: (id: number) => void;
  setNota: (id: number, nota: string) => void;
  clear: () => void;
  count: number;
  total: number;
}

const Ctx = createContext<CartCtx>({} as CartCtx);
export const useCart = () => useContext(Ctx);

const KEY = 'qarmi_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
  });

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(items)); }, [items]);

  const add: CartCtx['add'] = (p) => setItems(prev => {
    const found = prev.find(i => i.id === p.id);
    if (found) return prev.map(i => i.id === p.id ? { ...i, cantidad: i.cantidad + 1 } : i);
    return [...prev, { id: p.id, nombre: p.nombre, precio: Number(p.precio), imagen: p.imagen, cantidad: 1 }];
  });
  const inc = (id: number) => setItems(prev => prev.map(i => i.id === id ? { ...i, cantidad: i.cantidad + 1 } : i));
  const dec = (id: number) => setItems(prev => prev.flatMap(i => i.id === id ? (i.cantidad > 1 ? [{ ...i, cantidad: i.cantidad - 1 }] : []) : [i]));
  const remove = (id: number) => setItems(prev => prev.filter(i => i.id !== id));
  const setNota = (id: number, nota: string) => setItems(prev => prev.map(i => i.id === id ? { ...i, nota } : i));
  const clear = () => setItems([]);

  const count = items.reduce((a, i) => a + i.cantidad, 0);
  const total = items.reduce((a, i) => a + i.precio * i.cantidad, 0);

  return <Ctx.Provider value={{ items, add, inc, dec, remove, setNota, clear, count, total }}>{children}</Ctx.Provider>;
}
