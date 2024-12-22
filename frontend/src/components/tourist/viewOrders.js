import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [filter, setFilter] = useState("current"); // State to manage filter ("current" or "past")
  const navigate = useNavigate(); // To navigate to different pages if needed

  useEffect(() => {
    const fetchOrders = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          // Fetch orders for the logged-in tourist
          const response = await fetch(`/api/tourist/view-orders/${userId}`);
          const result = await response.json();

          if (response.ok) {
            setOrders(result.orders); // Set the orders to the state
            filterOrders(result.orders, filter); // Apply the initial filter
          } else {
            setErrorMessage(result.message || "Failed to fetch orders");
          }
        } catch (error) {
          console.error("Error fetching orders:", error);
          setErrorMessage("An error occurred while fetching orders.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchOrders();
  }, [filter]); // Re-fetch orders when the filter changes

  // Function to handle the cancelation of an order
  const cancelOrder = async (orderId) => {
    const userId = localStorage.getItem("userId");
    try {
      const response = await fetch(`/api/tourist/cancel-order/${orderId}`, {
        method: "PATCH",
      });

      const result = await response.json();

      if (response.ok) {
        // Update the order status in the state after canceling
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: "Cancelled" } : order
          )
        );
        filterOrders(orders, filter); // Reapply the filter after the cancellation
      } else {
        setErrorMessage(result.message || "Failed to cancel the order");
      }
    } catch (error) {
      console.error("Error canceling order:", error);
      setErrorMessage("An error occurred while canceling the order.");
    }
  };

  // Function to apply the filter (based on status)
  const filterOrders = (orders, filter) => {
    if (filter === "current") {
      setFilteredOrders(orders.filter(order => order.status === "In Progress"));
    } else if (filter === "past") {
      setFilteredOrders(
        orders.filter(order => order.status === "Cancelled" || order.status === "Delivered")
      );
    }
  };

  // Function to handle filter change
  const handleFilterChange = (e) => {
    const newFilter = e.target.value;
    setFilter(newFilter); // Update the filter state
    filterOrders(orders, newFilter); // Reapply the filter with the updated value
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="orders-container">
      <h1>Your Orders</h1>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {/* Dropdown select for filter */}
      <div className="filter-container">
        <label htmlFor="orderFilter" className="filter-label">Filter Orders:</label>
        <select
          id="orderFilter"
          value={filter}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="current">Current Orders</option>
          <option value="past">Past Orders</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <div>No orders found</div>
      ) : (
        <div>
          {filteredOrders.map((order) => (
            <div key={order._id} className="order-item">
              <h2>Order #{order._id}</h2>
              <p>Status: {order.status}</p>
              <p>Payment Method: {order.paymentMethod}</p>
              <p>Total Amount: ${order.totalAmount}</p>
              <p>Delivery Address: {order.deliveryAddress}</p>
              <div>
                <h3>Cart Items:</h3>
                <ul>
                  {order.cart.map((cartItem, index) => (
                    <li key={index}>
                      {cartItem.product.name} - ${cartItem.product.price} x {cartItem.count}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cancel Button */}
              {order.status !== "Cancelled" && (
                <button onClick={() => cancelOrder(order._id)}>Cancel</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewOrders;
