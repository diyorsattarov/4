// hooks/catalog.js
import { useState, useEffect } from 'react';

const useCatalog = (initialPage = 1, productsPerPage = 10) => {
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);

  useEffect(() => {
    fetch(`http://localhost:5000/get_all_products?page=${currentPage}`)
      .then(response => response.json())
      .then(data => {
        setProducts(data.products);
        setTotalProducts(data.totalProducts);
      })
      .catch(error => console.error('Error:', error));
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(totalProducts / productsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return { products, currentPage, totalPages: Math.ceil(totalProducts / productsPerPage), handleNextPage, handlePreviousPage };
};

export default useCatalog;
