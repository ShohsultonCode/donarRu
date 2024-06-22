import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../../components/Loader';
import './Index.css';  // Import the new CSS file

const Index = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productCounts, setProductCounts] = useState({});
  const [telegramUserId, setTelegramUserId] = useState(localStorage.getItem('telegramUserId'));
  const navigate = useNavigate();

  const telegram = window.Telegram.WebApp;

  useEffect(() => {
    const fetchSelectedProducts = async () => {
      try {
        const selectedProducts = JSON.parse(localStorage.getItem('selectedProducts')) || [];
        console.log(selectedProducts);
        if (selectedProducts.length === 0) {
          setLoading(false);
          return;
        }

        const productIds = selectedProducts.map(item => item.productId);
        const response = await fetch('https://botproject.uz/api/products/ask', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(productIds)
        });
        const data = await response.json();
        if (response.ok) {
          setProducts(data.data);
          const counts = {};
          selectedProducts.forEach(item => {
            counts[item.productId] = item.count;
          });
          setProductCounts(counts);
          setLoading(false);
        } else {
          toast.error(data.message || "Mahsulot ma'lumotlarini yuklashda xatolik yuz berdi");
          setLoading(false);
        }
      } catch (error) {
        console.error("Mahsulot ma'lumotlarini yuklashda xatolik", error);
        toast.error("Mahsulot ma'lumotlarini yuklashda xatolik");
        setLoading(false);
      }
    };

    fetchSelectedProducts();

    // Clear localStorage when the app is closed
    window.addEventListener('beforeunload', () => {
      localStorage.clear();
    });
  }, []);

  const handlePay = async () => {
    try {
      const orderData = products.map((product) => ({
        name: product.product_name,
        quantity: productCounts[product._id] || 1
      }));

      // Prepare data for the second API
      const secondApiData = {
        ok: true,
        order: {
          user_id: telegramUserId,
          items: orderData
        }
      };

      const secondResponse = await fetch('https://vermino.uz/bots/orders/CatDeliver/index.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        
        body: JSON.stringify(secondApiData)
      });
      console.log(secondApiData);

      if (secondResponse.ok) {
        localStorage.removeItem('selectedProducts');
        toast.success('Вы успешно разместили свой заказ!');

        setTimeout(() => {
          navigate("/");
          telegram.close();
        }, 700);
      } else {
        toast.error('Произошла ошибка при выполнении второго заказа');
      }
    } catch (error) {
      console.error('Buyurtmani amalga oshirishda xatolik:', error);
      toast.error('Во время выполнения заказа произошла ошибка');
    }
  };

  const handleBack = () => {
    localStorage.removeItem('selectedProducts');
    navigate("/");
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center">
        <h3 className="mb-4">Подробности</h3>
        <button type="button" className="btn btn-secondary" onClick={handleBack}>Назад</button>
      </div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Имя</th>
            <th>Картина</th>
            <th>Число</th>
            <th>Расходы</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>{product.product_name}</td>
              <td>
                <img
                  src={`https://botproject.uz/api/images/${product.product_image}`}
                  className="img-fluid"
                  alt={product.product_name}
                  style={{ height: "100px", width: "100px", objectFit: "cover" }}
                />
              </td>
              <td>{productCounts[product._id] || 1}</td>
              <td>{(product.product_price * (productCounts[product._id] || 1)).toFixed(2)} сум</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn btn-primary w-100 paycha" onClick={handlePay}>Разместить заказ</button>
      <ToastContainer />
    </div>
  );
};

export default Index;
