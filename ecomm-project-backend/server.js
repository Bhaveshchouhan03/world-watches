const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "(@Bc0312",
  database: "startersql",
});

db.connect((err) => {
  if (err) {
    console.error("DB Connection Error:", err.message);
  } else {
    console.log("MySQL connected successfully");
  }
});

// ================== PRODUCTS ==================

app.get("/products", (req, res) => {
  db.query("SELECT * FROM products", (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }

    res.send(result);
  });
});

app.get("/products/:id", (req, res) => {
  const productId = req.params.id;

  db.query("SELECT * FROM products WHERE id = ?", [productId], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (!result.length) {
      return res.status(404).send("Product not found");
    }

    res.send(result[0]);
  });
});

// ================== USERS ==================

app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }

    res.send(result);
  });
});

app.post("/users", (req, res) => {
  const { name, email, password } = req.body;
  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

  db.query(sql, [name, email, password], (err, result) => {
    if (err) {
      console.error("Insert Error:", err);
      return res.status(500).send(err);
    }

    res.status(201).send({
      message: "User created successfully",
      userId: result.insertId,
    });
  });
});

// ================== SELLERS ==================

app.get("/sellers", (req, res) => {
  db.query("SELECT * FROM sellers", (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }

    res.send(result);
  });
});

// ================== CART ==================

app.post("/cart", (req, res) => {
  const { userId, productId, quantity } = req.body;

  db.query(
    "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
    [userId, productId, quantity],
    (err, result) => {
      if (err) {
        console.error("Cart insert error:", err);
        return res.status(500).json({ error: err });
      }

      res.json({ message: "Item added to cart", result });
    }
  );
});

app.get("/cart", (req, res) => {
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
      if (err) {
        console.error("Cart fetch error:", err);
        return res.status(500).send(err);
      }

      res.send(result);
    }
  );
});

app.delete("/cart/:id", (req, res) => {
  const cartId = req.params.id;

  db.query("DELETE FROM cart WHERE id = ?", [cartId], (err) => {
    if (err) {
      console.error("Cart delete error:", err);
      return res.status(500).json({ error: err });
    }

    res.json({ message: "Item removed from cart" });
  });
});

// ================== ORDERS ==================

app.post("/orders", (req, res) => {
  const rawUserId = req.body.userId;
  const userId =
    rawUserId && typeof rawUserId === "object" ? rawUserId.id : rawUserId;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  db.query(
    `SELECT
      cart.quantity,
      products.image,
      products.price
    FROM cart
    JOIN products ON cart.product_id = products.id
    WHERE cart.user_id = ?`,
    [userId],
    (err, cartItems) => {
      if (err) {
        console.error("Order cart fetch error:", err);
        return res.status(500).json({ error: err });
      }

      if (!cartItems.length) {
        return res.status(400).json({ error: "Cart is empty" });
      }

      const orderValues = cartItems.map((item) => [
        item.image,
        Number(item.price) * Number(item.quantity || 1),
        userId,
      ]);

      db.beginTransaction((transactionErr) => {
        if (transactionErr) {
          console.error("Order transaction error:", transactionErr);
          return res.status(500).json({ error: transactionErr });
        }

        db.query(
          "INSERT INTO orders (image_url, price, user_id) VALUES ?",
          [orderValues],
          (insertErr, result) => {
            if (insertErr) {
              return db.rollback(() => {
                console.error("Order insert error:", insertErr);
                res.status(500).json({ error: insertErr });
              });
            }

            db.query(
              "DELETE FROM cart WHERE user_id = ?",
              [userId],
              (deleteErr) => {
                if (deleteErr) {
                  return db.rollback(() => {
                    console.error("Cart clear after order error:", deleteErr);
                    res.status(500).json({ error: deleteErr });
                  });
                }

                db.commit((commitErr) => {
                  if (commitErr) {
                    return db.rollback(() => {
                      console.error("Order commit error:", commitErr);
                      res.status(500).json({ error: commitErr });
                    });
                  }

                  res.status(201).json({
                    message: "Order placed successfully",
                    orderId: result.insertId,
                  });
                });
              }
            );
          }
        );
      });
    }
  );
});

app.get("/orders", (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const sql = `
    SELECT
      order_id AS id,
      image_url,
      price AS totalPrice,
      status
    FROM orders
    WHERE user_id = ?
    ORDER BY order_id DESC
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Fetch orders error:", err);
      return res.status(500).send(err);
    }

    res.send(result);
  });
});

app.delete("/orders/:orderId", (req, res) => {
  const orderId = req.params.orderId;

  db.query("DELETE FROM orders WHERE order_id = ?", [orderId], (err, result) => {
    if (err) {
      console.error("Delete order error:", err);
      return res.status(500).json({ error: err });
    }

    if (!result.affectedRows) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order cancelled successfully" });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
