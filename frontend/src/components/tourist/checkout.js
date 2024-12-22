import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook

const Checkout = () => {
  const [walletBalance, setWalletBalance] = useState(0);
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [creditCardInfo, setCreditCardInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); // Initialize the navigate function

  // Fetch wallet balance and cart details
  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          // Fetch wallet balance
          const walletResponse = await fetch(`/api/tourist/wallet/${userId}`);
          const walletData = await walletResponse.json();
          if (walletData.wallet) {
            setWalletBalance(walletData.wallet);
          }

          // Fetch cart items
          const cartResponse = await fetch(`/api/tourist/view-cart/${userId}`);
          const cartData = await cartResponse.json();
          setCart(cartData);
          calculateTotalAmount(cartData); // Calculate total amount
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, []);

  // Function to calculate total amount
  const calculateTotalAmount = (cartItems) => {
    const total = cartItems.reduce((sum, item) => {
      return sum + item.product.price * item.count;
    }, 0);
    setTotalAmount(total);
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Wallet balance check
    if (paymentMethod === "Wallet" && walletBalance < totalAmount) {
      setErrorMessage("Your wallet balance is insufficient for this order.");
      return;
    }

    const userId = localStorage.getItem("userId");
    const orderDetails = {
      tourist: userId,
      paymentMethod,
      deliveryAddress,
      creditCardInfo: paymentMethod === "Credit Card" ? creditCardInfo : null,
      totalAmount,
      cart,
    };

    try {
      const response = await fetch(`/api/tourist/create-order/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderDetails),
      });

      const result = await response.json();
      if (result.success) {
        alert("Order placed successfully!");
        navigate("/tourist/touristDashboard"); // Navigate to the tourist dashboard on success
      } else {
        alert("Error placing order.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      <form onSubmit={handleFormSubmit}>
        <h3>Select Payment Method:</h3>
        <div>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="COD"
              onChange={handlePaymentMethodChange}
            />
            Cash on Delivery (COD)
          </label>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="Credit Card"
              onChange={handlePaymentMethodChange}
            />
            Credit Card
          </label>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="Wallet"
              onChange={handlePaymentMethodChange}
            />
            Wallet
          </label>
        </div>

        {paymentMethod && (
          <div>
            <h3>Delivery Address:</h3>
            <textarea
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Enter your delivery address"
              required
            ></textarea>
          </div>
        )}

        {paymentMethod === "Credit Card" && (
          <div>
            <h3>Credit Card Information:</h3>
            <input
              type="text"
              placeholder="Card Number"
              value={creditCardInfo.cardNumber}
              onChange={(e) =>
                setCreditCardInfo({ ...creditCardInfo, cardNumber: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Expiry Date (MM/YY)"
              value={creditCardInfo.expiryDate}
              onChange={(e) =>
                setCreditCardInfo({ ...creditCardInfo, expiryDate: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="CVV"
              value={creditCardInfo.cvv}
              onChange={(e) =>
                setCreditCardInfo({ ...creditCardInfo, cvv: e.target.value })
              }
              required
            />
          </div>
        )}

        {paymentMethod === "Wallet" && (
          <div>
            <h3>Wallet Balance: ${walletBalance}</h3>
          </div>
        )}

        <div>
          <h3>Total Amount: ${totalAmount}</h3>
        </div>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        {paymentMethod && (
          <button type="submit">Place Order</button>
        )}
      </form>
    </div>
  );
};

export default Checkout;
