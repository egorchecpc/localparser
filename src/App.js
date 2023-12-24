import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Products from "./Products";

const App = () => {
  const [productUrl, setProductUrl] = useState("");
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState(0)
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/get_products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filter]);
  const updateData = async () => {
    let urlsProd = products.map((product) => product.url);
    try {
      setProducts([])
      await urlsProd.map(async (url) => {
        const response = await axios.post(
          "http://127.0.0.1:5000/api/add_product",
          {
            url: url,
          }
        );
        setProducts((prevProducts) => [...prevProducts, response.data]);
      })
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };
  const handleInputChange = (event) => {
    setProductUrl(event.target.value);
  };
  
  const handleAddProduct = async () => {
    if (products.some(product => product.url === productUrl)) {
      alert("Такой продукт уже существует.");
      return;
    }
    
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/add_product",
        {
          url: productUrl,
        }
      );
      setProductUrl('');
      setProducts((prevProducts) => [...prevProducts, response.data]);
    } catch (error) {
      console.error("Ошибка при добавлении товара:", error);
    }
  };

  const getProducts = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:5000/api/get_products"
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Ошибка при получении товаров:", error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []); // Запустить один раз при монтировании компонента

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Введите ссылку на товар"
          value={productUrl}
          onChange={handleInputChange}
        />
        <button onClick={handleAddProduct}>Добавить товар</button>
        <button onClick={updateData}>Обновить данные</button>
        <h1>Товары</h1>
        <div className="filtered-btn">
          <button onClick={()=>(setFilter(0))}>Все товары</button>
          <button onClick={()=>(setFilter(1))}>Ушли из продажи</button>
          <button onClick={()=>(setFilter(2))}>Снова в наличии</button>
        </div>
        <Products products={products} filter={filter}/>
      </div>
    </div>
  );
};

export default App;
