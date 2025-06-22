// src/app/marketplace/components/DisplayListings.tsx
import { useEffect, useState } from 'react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

interface Product {
  name: string;
  productAddress: string;
  price: number;
  imageUrl1: string;
  collection: string; 
}

const DisplayListings: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [priceFilter, setPriceFilter] = useState<number>(0);
  const [collectionFilter, setColectionFilter] = useState<string>('All');
  const [availableCollections, setAvailableCollections] = useState<string[]>([]);

  useEffect(() => {
    const fetchListedProducts = async () => {
      const response = await fetch('/api/products/listed');
      const data: Product[] = await response.json();
      setProducts(data);
      setFilteredProducts(data); //aqui inicializa con todos los product:)


      // Extrae las colecciones únicas de los productos para el filtro
      const collections = Array.from(new Set(data.map((product: Product) => product.collection)));
      setAvailableCollections(['All', ...collections]); 
  
    };

    fetchListedProducts();
  }, []);


  useEffect(() =>  {
    let filtered = products;   
  //filtamos por precio
  if (priceFilter > 0)  {
    filtered = filtered.filter(product => product.price <= priceFilter  * LAMPORTS_PER_SOL);
  }
  //aqui filtramos por colleccion.
  if (collectionFilter !== 'All')  {
    filtered = filtered.filter(product => product.collection === collectionFilter);
  }

  setFilteredProducts(filtered);
}, [priceFilter, collectionFilter, products]);

  return (
    <div className="p-4 bg-gray-100 dark:bg-black min-h-screen">
    <h2 className="text-3xl font-bold mb-4 text-center text-gray-800 dark:text-white">Listed Products</h2>

    <div className="flex justify-between mb-6">
      {/* Filtro de Precio */}
      <div className="flex items-center space-x-4">
        <label className="text-gray-800 dark:text-white" htmlFor="priceFilter">
          <span>Price Max (SOL):</span>
          <input
            type="number"
            id="priceFilter"
            value={priceFilter}
            onChange={(e) => setPriceFilter(Math.max(0, parseInt(e.target.value)))}
            placeholder="Max Price"
            className="border border-gray-300 p-2 rounded dark:bg-black dark:text-gray-200"
          />
        </label>
      </div>

     
      <div className="flex items-center space-x-4">
        <label className="text-gray-800 dark:text-white" htmlFor="collectionFilter">
          <span>Collection:</span>
        </label>
        <select
          id="collectionFilter"
          onChange={(e) => setColectionFilter(e.target.value)}
          value={collectionFilter}
          className="border border-gray-300 p-2 rounded dark:bg-black dark:text-gray-200"
        >
          {availableCollections.map((collection, index) => (
            <option key={index} value={collection}>{collection}</option>
          ))}
        </select>
      </div>
    </div>

    <div className="text-center mb-4 text-gray-600 dark:text-gray-300">
      {filteredProducts.length} products found
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredProducts.map((product, index) => (
        <div key={index} className="relative p-4 border rounded shadow hover:shadow-lg transition-transform transform hover:scale-105 cursor-pointer bg-white dark:bg-black group">
          <img src={product.imageUrl1} alt={product.name} className="h-64 w-full object-contain rounded mb-4" />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-opacity flex flex-col justify-end items-center opacity-0 group-hover:opacity-100 text-white text-xs p-2">
            <p className="font-semibold">{product.name}</p>
            <p className="text-sm">Price: {product.price / LAMPORTS_PER_SOL} SOL</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);
};

export default DisplayListings;
