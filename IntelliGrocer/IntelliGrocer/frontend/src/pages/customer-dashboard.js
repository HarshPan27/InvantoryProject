// src/components/CustomerDashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import axios from "axios";
import "../styles/CustomerDashboard.css";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

// Custom arrow components for react-slick
const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", left: "10px", zIndex: 1 }}
      onClick={onClick}
    >
      <img
        src="https://cdn-icons-png.flaticon.com/512/271/271220.png"
        alt="prev arrow"
        style={{ width: "30px", height: "30px" }}
      />
    </div>
  );
};

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", right: "10px", zIndex: 1 }}
      onClick={onClick}
    >
      <img
        src="https://cdn-icons-png.flaticon.com/512/271/271228.png"
        alt="next arrow"
        style={{ width: "30px", height: "30px" }}
      />
    </div>
  );
};

// Updated Featured Sales with Cosmetics Sale added and cosmetic emphasis applied
const featuredSales = [
  {
    _id: "sale1",
    name: "Choclate for Easter",
    image:
      "https://d3cif2hu95s88v.cloudfront.net/live-site-2016/product-image/IMG/16040616931_1-350x350.jpg",
  },
  {
    _id: "sale2",
    name: "Electronics Sale",
    image:
      "https://ecelectronics.com/wp-content/uploads/2020/04/Modern-Electronics-EC-.jpg",
  },
  {
    _id: "sale3",
    name: "Selected Grocery Sale",
    image:
      "https://media.self.com/photos/599c997a774b667d3bbe1214/4:3/w_1264,h_948,c_limit/groceries-family-month.jpg",
  },
  {
    _id: "sale4",
    name: "Cosmetics Sale",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIz8BXfS5rSkLEtf7grCOqtmb-Olfs5sxhXA&s",
  },
];

// Dummy fallback inventory
const dummyInventory = [
  {
    _id: "dummy1",
    name: "Green Apple",
    description: "Fresh and crispy green apples.",
    image: "https://via.placeholder.com/300?text=Green+Apple",
    price: 1.99,
    quantity: 100,
  },
  {
    _id: "dummy2",
    name: "Organic Spinach",
    description: "Healthy organic spinach leaves.",
    image: "https://via.placeholder.com/300?text=Spinach",
    price: 2.49,
    quantity: 50,
  },
];

const CustomerDashboard = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [username, setUsername] = useState(
    localStorage.getItem("username") || "Guest"
  );
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [phone, setPhone] = useState(localStorage.getItem("phone") || "");
  const [address, setAddress] = useState(localStorage.getItem("address") || "");
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderHistory, setOrderHistory] = useState([]);
  const [cart, setCart] = useState([]);
  const [orderSuccess, setOrderSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [salesData, setSalesData] = useState(null);

  // Retrieve user data from localStorage
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) setEmail(storedEmail);
    const storedPhone = localStorage.getItem("phone");
    if (storedPhone) setPhone(storedPhone);
    const storedAddress = localStorage.getItem("address");
    if (storedAddress) setAddress(storedAddress);
    const storedRole = localStorage.getItem("role");
    if (storedRole) setRole(storedRole);
  }, []);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true); // ✅ Show loading before fetching
        const response = await axios.get("http://localhost:5001/api/inventory");
        console.log(" Inventory fetched:", response.data);
        setInventory(response.data || []);
      } catch (error) {
        console.error(" Error fetching inventory:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchInventory();
  }, []);

  // Dummy order history (replace with real API call if available)
  useEffect(() => {
    setOrderHistory([
      { id: 1, item: "Product A", date: "2025-01-01" },
      { id: 2, item: "Product B", date: "2025-01-15" },
    ]);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("phone");
    localStorage.removeItem("address");
    localStorage.removeItem("role");
    navigate("/");
  };

  // Slider settings for Featured Sales with custom arrows
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const addToCart = (item) => {
    setCart((prevCart) => [...prevCart, item]);
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => {
      const index = prevCart.findIndex((item) => item._id === itemId);
      if (index !== -1) {
        const updatedCart = [...prevCart];
        updatedCart.splice(index, 1);
        return updatedCart;
      }
      return prevCart;
    });
  };
  const handlePurchase = async () => {
    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    const totalRevenue = cart.reduce((total, item) => total + (Number(item.basePrice) || 0), 0);

    if (totalRevenue <= 0) {
        alert(" Error: Total revenue must be greater than 0.");
        return;
    }

    console.log("📢 Sending Order Data:", cart);
    console.log("📢 Sending Total Revenue:", totalRevenue);

    const orderData = {
        userId: localStorage.getItem("userId") || "dummyUser",
        items: cart.map((item) => ({ itemId: item._id, quantity: 1 })),
    };

    try {
        // ✅ Step 1: Place Order
        const response = await axios.post("http://localhost:5001/api/orders", orderData);
        console.log("✅ Order Response:", response.data);

        // ✅ Step 2: Update Sales Report
        await axios.post("http://localhost:5001/api/sales/update", { totalRevenue });

        // ✅ Step 3: Fetch Updated Inventory
        axios.get("http://localhost:5001/api/InvantoryItem")
            .then(res => {
                console.log(" Updated Inventory:", res.data);
                setInventory(res.data);
            })
            .catch(err => console.error(" Error fetching inventory:", err));

        alert("✅ Purchase successful! Sales report updated.");
        setCart([]); // ✅ Clear cart

    } catch (error) {
        console.error(" Error processing purchase:", error.response?.data || error.message);
        alert(`Error processing purchase: ${error.response?.data?.error || "Unknown error"}`);
    }
};
  
  // ✅ Fetch Sales Data
  const fetchSalesData = () => {
    axios.get("http://localhost:5001/api/sales/analytics")
      .then(response => setSalesData(response.data))
      .catch(error => console.error("Error fetching sales data:", error));
  };
  

   // Handle Refund (Restocks Item & Updates Pricing)
   const handleRefund = async (itemId) => {
    try {
      await axios.post("http://localhost:5001/api/pricing/update-sales", {
        itemId,
        quantity: 1,
        action: "refund"
      });

      alert(" Refund processed! Prices will update.");
    } catch (error) {
      console.error(" Error processing refund:", error);
      alert("Error processing refund.");
    }
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const saveProfile = () => {
    if (!validatePhone(phone)) {
      setProfileError("Please enter a valid 10-digit phone number.");
      setTimeout(() => setProfileError(""), 3000);
      return;
    }
    const updatedData = { username, email, phone, address, role };
    axios
      .patch("http://localhost:5001/api/auth/update", updatedData)
      .then((response) => {
        localStorage.setItem("username", username);
        localStorage.setItem("email", email);
        localStorage.setItem("phone", phone);
        localStorage.setItem("address", address);
        localStorage.setItem("role", role);
        setIsEditing(false);
        setProfileSuccess("Changes have been saved successfully!");
        setProfileError("");
        setTimeout(() => setProfileSuccess(""), 3000);
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        setProfileError("Error updating profile. Please try again.");
        setTimeout(() => setProfileError(""), 3000);
      });
  };

  const filteredInventory = Array.isArray(inventory) 
    ? inventory.filter((product) =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="customer-dashboard">
      {/* Sidebar Navigation */}
      <div className="sidebar">
        <h2 className="sidebar-title">IntelliGrocer</h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <ul className="sidebar-menu">
          <li
            className={`nav-item ${activeSection === "home" ? "active" : ""}`}
            onClick={() => setActiveSection("home")}
          >
            Home
          </li>
          <li
            className={`nav-item ${activeSection === "orders" ? "active" : ""}`}
            onClick={() => setActiveSection("orders")}
          >
            Orders
          </li>
          <li
            className={`nav-item ${
              activeSection === "categories" ? "active" : ""
            }`}
            onClick={() => setActiveSection("categories")}
          >
            Categories
          </li>
         
          <li
            className={`nav-item ${activeSection === "profile" ? "active" : ""}`}
            onClick={() => setActiveSection("profile")}
          >
            Profile
          </li>
          <li className="nav-item logout" onClick={handleLogout}>
            Logout
          </li>
        </ul>
      </div>

      {/* Main Dashboard Content */}
      <div className="dashboard-content">
        {activeSection === "home" && (
          <>
            <div className="welcome-text">
              <h1>Welcome, {username}!</h1>
            </div>
            {/* Featured Sales Slider */}
            <section className="featured-section">
              <h2>Featured Sales</h2>
              {featuredSales.length ? (
                <Slider {...sliderSettings}>
                  {featuredSales.map((product) => (
                    <div key={product._id} className="slider-item">
                      <img src={product.image} alt={product.name} />
                      <p
                        style={
                          product._id === "sale4"
                            ? { fontWeight: "bold", fontSize: "1.1em" }
                            : {}
                        }
                      >
                        {product.name}
                      </p>
                    </div>
                  ))}
                </Slider>
              ) : (
                <p>No featured sales available.</p>
              )}
            </section>
            {/* Product Grid */}
            <section className="products-section">
          <h2>Products</h2>
          <div className="product-grid">
            {filteredInventory.length ? (
              filteredInventory.map((product) => (
                <div key={product._id} className="product-card">
                  <img src={product.image || "https://via.placeholder.com/300"} alt={product.name} />
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  {/*  Fix price display (handles missing basePrice) */}
                  <p>Price: ${product.basePrice ? product.basePrice.toFixed(2) : "N/A"}</p>
                  <p>Stock Level: {product.stockLevel ?? "N/A"}</p>
                  <button onClick={() => addToCart(product)}>Add to Cart</button>
                </div>
              ))
            ) : (
  <p>No products available.</p>
)}
              </div>
            </section>
          </>
        )}

        {activeSection === "orders" && (
          <section className="orders-section">
            <h2>Your Order History</h2>
            {orderHistory.length ? (
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Product</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orderHistory.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.item}</td>
                      <td>{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No orders found.</p>
            )}
          </section>
        )}

        {activeSection === "categories" && (
          <section className="categories-section">
            <h2>Product Categories</h2>
            <p>List of product categories goes here.</p>
          </section>
        )}

        

        {activeSection === "profile" && (
          <section className="profile-section">
            <h2>Your Profile</h2>
            {isEditing ? (
              <div className="profile-form">
                <div className="form-group">
                  <label>Username:</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Phone:</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Address:</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Role:</label>
                  <input type="text" value={role} readOnly />
                </div>
                <button onClick={saveProfile}>Save Changes</button>
                <button onClick={() => setIsEditing(false)}>Cancel</button>
                {profileSuccess && (
                  <p className="profile-success">{profileSuccess}</p>
                )}
                {profileError && (
                  <p className="profile-error">{profileError}</p>
                )}
              </div>
            ) : (
              <div className="profile-details">
                <p>
                  <strong>Username:</strong> {username}
                </p>
                <p>
                  <strong>Email:</strong> {email || "Not provided"}
                </p>
                <p>
                  <strong>Phone:</strong> {phone || "Not provided"}
                </p>
                <p>
                  <strong>Address:</strong> {address || "Not provided"}
                </p>
                <p>
                  <strong>Role:</strong> {role || "Not provided"}
                </p>
                <button onClick={() => setIsEditing(true)}>Edit Profile</button>
              </div>
            )}
          </section>
        )}
      </div>

      {cart.length > 0 && (
        <div className="cart-section-static">
          <h2>Your Cart</h2>
          <ul>
            {cart.map((item, index) => (
              <li key={index}>
                {item.name} - ${item.basePrice ? item.basePrice.toFixed(2) : "N/A"}
                <button onClick={() => removeFromCart(item._id)}>Remove</button>
              </li>
            ))}
          </ul>
          <button onClick={handlePurchase}>Place Order</button>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
