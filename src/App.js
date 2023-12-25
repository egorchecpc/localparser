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
  
  const handleDelete = async (article) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/delete_product', {
        article: article,
      });
      setProducts(products.filter(product=>product.article!==article))
      if (response.status >= 200 && response.status < 300) {
        console.log('Product deleted successfully');
      } else {
        console.error(`Error: ${response.data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error(`Error: ${error.message || 'Unknown error'}`);
    }
  };

  const handleAddProduct = async () => {
    if (products.some(product => product.url === productUrl)) {
      alert("Такой продукт уже существует.");
      setProductUrl('')
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
          className="link-input"
        />
        <button class="btn" onClick={handleAddProduct}>Добавить товар</button>
        <button class="btn" onClick={updateData}>Обновить данные</button>
        <h1>Товары</h1>
        <div className="filtered-btn">
          <button onClick={() => setFilter(0)} className={filter === 0 ? 'active btn' : 'btn'}>Все товары</button>
          <button onClick={() => setFilter(1)} className={filter === 1 ? 'active btn' : 'btn'}>Ушли из продажи</button>
          <button onClick={() => setFilter(2)} className={filter === 2 ? 'active btn' : 'btn'}>Снова в наличии</button>
        </div>
        <Products products={products} filter={filter} handleDelete={handleDelete}/>
      </div>
    </div>
  );
};

export default App;
