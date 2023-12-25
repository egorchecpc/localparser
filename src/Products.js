import "./App.css";
import basket from './basket.png'
const Products = ({products, filter, handleDelete}) => {
  let filtredProducts = [] 
  switch(filter) {
    case 1:  
      filtredProducts = products.filter(product=>product.wilted == true)
      break;
  
    case 2:  
      filtredProducts = products.filter(product=>product.gone == true)
      break;
  
    default:
      filtredProducts = products
      break;
  }

  const copyArticle = (event, articleText, link) => {
    // Prevent the default link behavior
    event.preventDefault();

    // Copy the article text to the clipboard
    const tempTextArea = document.createElement("textarea");
    tempTextArea.value = articleText;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand("copy");
    document.body.removeChild(tempTextArea);

    // Open the link in a new tab
    window.open(link, "_blank");
  };

  
  const reversedProducts = [...filtredProducts].reverse();
  return (
    <div className="product-list">
          {reversedProducts.map((product, index) => (
            <div
              key={index}
              className={`product-item ${
                product.changed ? "changed-product" : ""
              }`}
            >
              <div>
                <a
                  href="https://my.prom.ua/cms/product"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(event) =>
                    copyArticle(event, product.article, "https://my.prom.ua/cms/product")
                  }
                >
                  <p>Артикул: {product.article}</p>
                </a>
                <p>Название: {product.title}</p>
                <p>Количество: {product.span_text}</p>
                <p
                  className={product.stock_status.toLowerCase() == "в наявності" ? "green" : "red"}
                >
                  Наличие: {product.stock_status}
                </p>
              </div>
              <div>
                <button onClick={()=>handleDelete(product.article)} className="delete-btn">
                  <img className='basket'src={basket} alt='basket'/>
                </button>
              </div>
            </div>
          ))}
    </div>
  );
};

export default Products;
