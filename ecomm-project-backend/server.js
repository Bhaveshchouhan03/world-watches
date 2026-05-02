// const express = require("express");
// const mysql = require("mysql2");
// const cors = require("cors");

// const app = express();
// app.use(cors());
// app.use(express.json());

// // ✅ DB connection
// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "(@Bc0312", // Password check kar lena sahi hai na
//   database: "startersql"
// });

// db.connect((err) => {
//   if (err) {
//     console.error("DB Connection Error:", err.message);
//   } else {
//     console.log("MySQL Connected successfully!");
//   }
// });

// // ✅ Products API
// app.get("/products", (req, res) => {
//   db.query("SELECT * FROM products", (err, result) => {
//     if (err) {
//       res.status(500).send({ error: "Products fetch karne mein error aaya", details: err });
//     } else {
//       res.send(result);
//     }
//   });
// });

// app.get("/products/:id", (req, res) => {
//     const productId = req.params.id;

//     // MySQL query example
//     db.query("SELECT * FROM products WHERE id = ?", [productId], (err, result) => {
//         if (err) {
//             res.status(500).send(err);
//         } else if (result.length === 0) {
//             res.status(404).send("Product not found");
//         } else {
//             res.send(result[0]);
//         }
//     });
// });


// // ✅ Users API (Ye add kiya hai)
// app.get("/users", (req, res) => {
//   db.query("SELECT * FROM users", (err, result) => {
//     if (err) {
//       res.status(500).send({ error: "Users fetch karne mein error aaya", details: err });
//     } else {
//       res.send(result);
//     }
//   });
// });

// // sellers API
// app.get("/sellers", (req, res) => {
//   db.query("SELECT * FROM sellers", (err, result) => {
//     if (err) {
//       res.status(500).send({ error: "sellers fetch karne mein error aaya", details: err });
//     } else {
//       res.send(result);
//     }
//   });
// });

// // cart API
// app.get("/cart", (req, res) => {
//   db.query("SELECT * FROM cart", (err, result) => {
//     if (err) {
//       res.status(500).send({ error: "cart fetch karne mein error aaya", details: err });
//     } else {
//       res.send(result);
//     }
//   });
// });

// app.post("/cart", (req, res) => {
//   const { userId, productId, quantity } = req.body;

//   db.query(
//     "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
//     [userId, productId, quantity],
//     (err, result) => {
//       if (err) {
//         console.log(err);
//         res.status(500).send(err);
//       } else {
//         res.send(result);
//       }
//     }
//   );
// });

// // orders API
// app.get("/orders", (req, res) => {
//   db.query("SELECT * FROM orders", (err, result) => {
//     if (err) {
//       res.status(500).send({ error: "orders fetch karne mein error aaya", details: err });
//     } else {
//       res.send(result);
//     }
//   });
// });

// // ✅ Server
// app.listen(5000, () => {
//   console.log("Server running on http://localhost:5000");
// });




















const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ DB connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "(@Bc0312",
  database: "startersql"
});

db.connect((err) => {
  if (err) {
    console.error("DB Connection Error:", err.message);
  } else {
    console.log("MySQL Connected successfully!");
  }
});


// ================== PRODUCTS ==================

// Get all products
app.get("/products", (req, res) => {
  db.query("SELECT * FROM products", (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(result);
    }
  });
});

// Get single product
app.get("/products/:id", (req, res) => {
  const productId = req.params.id;

  db.query("SELECT * FROM products WHERE id = ?", [productId], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else if (result.length === 0) {
      res.status(404).send("Product not found");
    } else {
      res.send(result[0]);
    }
  });
});


// ================== USERS ==================

app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(result);
    }
  });
});


// Create a new user (POST request handle karne ke liye)
app.post("/users", (req, res) => {
  const { name, email, password } = req.body; // Frontend se aane wala data

  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  
  db.query(sql, [name, email, password], (err, result) => {
    if (err) {
      console.error("Insert Error:", err);
      return res.status(500).send(err);
    }
    res.status(201).send({ message: "User created successfully", userId: result.insertId });
  });
});

// Server start command (ensure karein ki ye file ke end mein ho)
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

// ================== SELLERS ==================

app.get("/sellers", (req, res) => {
  db.query("SELECT * FROM sellers", (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(result);
    }
  });
});


// ================== CART ==================

app.post("/cart", (req, res) => {
  console.log("🔥 POST CART HIT");

  const { userId, productId, quantity } = req.body;

  db.query(
    "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
    [userId, productId, quantity],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: err });
      } else {
        res.json({ message: "Item added to cart", result }); // ✅ JSON
      }
    }
  );
});

app.get("/cart", (req, res) => {
  console.log("🔥 JOIN API HIT"); // 👈 ye daalo

  const userId = req.query.userId;

  db.query(
    `SELECT 
        cart.id,
        cart.quantity,
        products.name,
        products.price,
        products.image
     FROM cart
     JOIN products ON cart.product_id = products.id
     WHERE cart.user_id = ?`,
    [userId],
    (err, result) => {
      console.log("RESULT:", result); // 👈 ye bhi

      if (err) {
        console.log("Fetch Error:", err);
        res.status(500).send(err);
      } else {
        res.send(result);
      }
    }
  );
});

// ✅ Remove item from cart
app.delete("/cart/:id", (req, res) => {
  const cartId = req.params.id;

  console.log("🗑️ DELETE CART ID:", cartId);

  db.query(
    "DELETE FROM cart WHERE id = ?",
    [cartId],
    (err, result) => {
      if (err) {
        console.log("Delete Error:", err);
        res.status(500).json({ error: err });
      } else {
        res.json({ message: "Item removed from cart" });
      }
    }
  );
});

// ================== ORDERS ==================

app.get("/orders", (req, res) => {
  db.query("SELECT * FROM orders", (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(result);
    }
  });
});

// ================== ORDER NOW ==================

app.post("/orders", (req, res) => {
  const { userId } = req.body;

  console.log("🛒 ORDER REQUEST:", userId);

  // 1. Get cart items with product details
  db.query(
    `SELECT cart.product_id, cart.quantity, products.price
     FROM cart
     JOIN products ON cart.product_id = products.id
     WHERE cart.user_id = ?`,
    [userId],
    (err, cartItems) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: err });
      }

      if (cartItems.length === 0) {
        return res.json({ message: "Cart is empty" });
      }

      // 2. Calculate total
      let total = 0;
      cartItems.forEach(item => {
        total += item.price * item.quantity;
      });

      // 3. Create order
      db.query(
        "INSERT INTO orders (user_id, total_amount) VALUES (?, ?)",
        [userId, total],
        (err, orderResult) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ error: err });
          }

          const orderId = orderResult.insertId;

          // 4. Insert order items
          const values = cartItems.map(item => [
            orderId,
            item.product_id,
            item.quantity,
            item.price
          ]);

          db.query(
            "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?",
            [values],
            (err) => {
              if (err) {
                console.log(err);
                return res.status(500).json({ error: err });
              }

              // 5. Clear cart
              db.query(
                "DELETE FROM cart WHERE user_id = ?",
                [userId],
                (err) => {
                  if (err) {
                    console.log(err);
                    return res.status(500).json({ error: err });
                  }

                  res.json({
                    message: "🎉 Order placed successfully",
                    orderId: orderId,
                    total: total
                  });
                }
              );
            }
          );
        }
      );
    }
  );
});
// ================== ORDERS API ==================

// 1. Place Order (POST) - Ab user_id bhi save hoga
app.post("/orders", (req, res) => {
    // Frontend se image_url, price ke saath userId bhi bhejna padega
    const { image_url, price, userId } = req.body;

    if (!price || !userId) {
        return res.status(400).send({ message: "Price and User ID are required" });
    }

    // SQL query mein user_id add kar diya hai
    const sql = "INSERT INTO orders (image_url, price, user_id) VALUES (?, ?, ?)";
    
    db.query(sql, [image_url, price, userId], (err, result) => {
        if (err) {
            console.error("Order Insert Error:", err.message);
            return res.status(500).send(err);
        }
        res.status(201).send({ 
            message: "Order placed!", 
            orderId: result.insertId 
        });
    });
});

// 2. Get My Orders (GET) - Specific user ke orders fetch karne ke liye
app.get("/orders", (req, res) => {
  console.warn(result);
    const userId = req.query.userId;

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    // Query filters orders by user_id
    const sql = "SELECT id as order_id, image_url, price, status FROM orders WHERE user_id = ?";

    db.query(sql, [userId], (err, result) => {
        if (err) {
            console.error("Fetch Orders Error:", err);
            return res.status(500).send(err);
        }
        res.send(result);
    });
});




// ✅ DELETE/Cancel an order
app.delete("/orders/:order_id", (req, res) => {
  const orderId = req.params.order_id;

  db.query(
    "DELETE FROM orders WHERE order_id = ?",
    [orderId],
    (err, result) => {
      if (err) {
        console.log("Delete Order Error:", err);
        res.status(500).json({ error: err });
      } else {
        res.json({ message: "Order cancelled successfully" });
      }
    }
  );
});


// ================== SERVER ==================

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});