import { Product, Order } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Ceviche de Hongos Silvestres',
    description: 'Marinado en cítricos andinos con toques de ají limo y cilantro fresco.',
    price: 28.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDz9NE9v74S_zGKn4d8pq1ARRFQvLaMwK52SvmmwGl1drB7WoTwdn27pI2Xa_iH-j9sicvnioPNKFvmfx2r56O2mZpb4O7nhraMeJFfi0gVlYm9o6uE2395NmKWU04xhcqwRqMlFT1aIpkMdAlAcVjEDqP4aXuEkdxq0Qn98Xmq5jeaDkg7li1G6SBBJtIUVTCi75AKxWb76Pd3uNFqwylNrBP___eJ6cbqA_NkE7Hlbu_0SzY3TIa-vlnGFDYp0sZMqupMzZT46Vo',
    category: 'Entradas',
    tags: ['Vegano'],
    calories: 210,
    protein: '8g',
    carbs: '25g',
    fats: '4g'
  },
  {
    id: '2',
    name: 'Hummus de Tarwi y Quinua',
    description: 'Acompañado de tostadas de pan de masa madre y aceite de oliva extra virgen.',
    price: 22.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSpobNkZi5vznpckMI_vx4PhH_GbaB4n1sFcrc-W_LEim62Yc7QwBWngAlnloBonn429ErqhZ42XYOX1KVRPuqNrf_Ka6FJ2oH9XEyE0iQvvcMxd70i8JA4_8kJsYDUF6U2pQHvbeuhdtfAfrQlnjpd4ZKvIC_RYGUD-8d5nNFS-yuhhV6FXD-aD2tTztUAwQOaCj2wst41tzBaYXfsUkGs56Ojqy5NPQCxoL-GpPT-M_OumKfRhTkLFZLue1JhFAYbsBy4dektz8',
    category: 'Entradas',
    tags: ['Sin Gluten'],
    calories: 320,
    protein: '12g',
    carbs: '35g',
    fats: '15g'
  },
  {
    id: '3',
    name: 'Ensalada de la Huerta Andina',
    description: 'Hojas verdes tiernas, palta, tomates cherry, y vinagreta de maracuyá.',
    price: 26.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA2OhqP-OwDMP9qNDQPyhum23pOjbdfEydeV8cfCTrL0g-AN6m-ySpctQEDiFl8MOHfpDC3QCE0f89EFaqew_wUevGbH0YAseU-1o5GITAUYas136a9wqTJg7HedSJRapjf08hfyHX_ezUopD17IJB4F6KJzH9HONWtb_3JfIGUGhSPml4xKz7Dgg0RYC7Fm10jRgWcQjalrn_HZtl_9IzfmsZKXBaurtZpoh0Yhlfj4B-H3x53zJi52wJSRtwFkOM8Ua5OBQq5s0',
    category: 'Entradas',
    tags: ['Superfood'],
    calories: 280,
    protein: '6g',
    carbs: '15g',
    fats: '18g'
  },
  {
    id: '4',
    name: 'Crema de Zapallo Loche',
    description: 'Suave crema con toques de jengibre y semillas de calabaza tostadas.',
    price: 24.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZNtl7N1SopUsyVJ8vfQzOwMOvBHWRan5URwFx9NIGPDamzgQo_Ji29Z9u57MEvj0Wl94Py-Vc-1yyePX7hDKVUYvkNJDOogDksbEepVXqwSSzZx3rIPCmGPiqwBfMTEvUHARByL5cmLBOrgTiaKc74e9hfJrtf9xFjvZraYTJmpybRGKwP8fKpj1lVzvTSAAbWX-bQH1uDZscsZeO2bPwiSrI-ag6iEeebey3Oa8yepQR_Y-fZQWwfSU9R48saUce273tHnkoTKE',
    category: 'Entradas',
    calories: 180,
    protein: '4g',
    carbs: '22g',
    fats: '7g'
  }
];

export const ORDERS: Order[] = [
  {
    id: '1045',
    table: '04',
    waiter: 'Juan',
    time: '08:45',
    type: 'dine-in',
    status: 'pending',
    items: [
      { name: '2x Lomo Saltado Andino', quantity: 2, notes: 'Sin cebolla, carne término medio.', status: 'pending' },
      { name: '1x Causa Limeña', quantity: 1, status: 'pending' }
    ]
  },
  {
    id: '1046',
    time: '02:10',
    type: 'takeaway',
    status: 'pending',
    items: [
      { name: '1x Ají de Gallina', quantity: 1, status: 'pending' },
      { name: '1x Chicha Morada (1L)', quantity: 1, status: 'pending' }
    ]
  },
  {
    id: '1041',
    table: '12',
    waiter: 'Carlos',
    time: '14:20',
    type: 'dine-in',
    status: 'cooking',
    items: [
      { name: '1x Ceviche Clásico', quantity: 1, status: 'ready' },
      { name: '1x Pachamanca a la Olla', quantity: 1, status: 'cooking' }
    ]
  }
];
