require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ================== OPENAI ==================

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ================== MYSQL CONNECTION ==================

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD || "(@Bc0312",
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

  db.query(
    "SELECT * FROM products WHERE id = ?",
    [productId],
    (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }

      if (!result.length) {
        return res.status(404).send("Product not found");
      }

      res.send(result[0]);
    }
  );
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

  const sql =
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

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

// Seller signup
app.post("/seller", (req, res) => {
  const { name, email, password } = req.body;

  // Generate random hex id (sellers table uses varchar(10) for id)
  const id = require("crypto").randomBytes(2).toString("hex");

  const sql =
    "INSERT INTO sellers (id, name, email, password) VALUES (?, ?, ?, ?)";

  db.query(sql, [id, name, email, password], (err, result) => {
    if (err) {
      console.error("Seller Insert Error:", err);
      return res.status(500).send(err);
    }

    res.status(201).send({
      id,
      name,
      email,
      password,
    });
  });
});

// Seller login (GET with email & password filter)
app.get("/seller", (req, res) => {
  const { email, password } = req.query;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  db.query(
    "SELECT * FROM sellers WHERE email = ? AND password = ?",
    [email, password],
    (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }

      res.send(result);
    }
  );
});

// ================== PRODUCT CRUD (for sellers) ==================

app.post("/products", (req, res) => {
  const { name, price, category, color, image, description } = req.body;

  const sql =
    "INSERT INTO products (name, price, category, color, image, description) VALUES (?, ?, ?, ?, ?, ?)";

  db.query(
    sql,
    [name, price, category, color, image, description],
    (err, result) => {
      if (err) {
        console.error("Product insert error:", err);
        return res.status(500).send(err);
      }

      res.status(201).send({
        id: result.insertId,
        name,
        price,
        category,
        color,
        image,
        description,
      });
    }
  );
});

app.put("/products/:id", (req, res) => {
  const productId = req.params.id;
  const { name, price, category, color, image, description } = req.body;

  const sql =
    "UPDATE products SET name=?, price=?, category=?, color=?, image=?, description=? WHERE id=?";

  db.query(
    sql,
    [name, price, category, color, image, description, productId],
    (err, result) => {
      if (err) {
        console.error("Product update error:", err);
        return res.status(500).send(err);
      }

      if (!result.affectedRows) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.send({ id: productId, name, price, category, color, image, description });
    }
  );
});

app.delete("/products/:id", (req, res) => {
  const productId = req.params.id;

  db.query(
    "DELETE FROM products WHERE id = ?",
    [productId],
    (err, result) => {
      if (err) {
        console.error("Product delete error:", err);
        return res.status(500).send(err);
      }

      if (!result.affectedRows) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json({ message: "Product deleted successfully" });
    }
  );
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

        return res.status(500).json({
          error: err,
        });
      }

      res.json({
        message: "Item added to cart",
        result,
      });
    }
  );
});

app.get("/cart", (req, res) => {
  const userId = req.query.userId;

  db.query(
    `
    SELECT
      cart.id,
      cart.quantity,
      products.name,
      products.price,
      products.image
    FROM cart
    JOIN products
    ON cart.product_id = products.id
    WHERE cart.user_id = ?
    `,
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

  db.query(
    "DELETE FROM cart WHERE id = ?",
    [cartId],
    (err) => {
      if (err) {
        console.error("Cart delete error:", err);

        return res.status(500).json({
          error: err,
        });
      }

      res.json({
        message: "Item removed from cart",
      });
    }
  );
});

// ================== ORDERS ==================

app.post("/orders", (req, res) => {
  const rawUserId = req.body.userId;

  const userId =
    rawUserId && typeof rawUserId === "object"
      ? rawUserId.id
      : rawUserId;

  if (!userId) {
    return res.status(400).json({
      error: "User ID is required",
    });
  }

  db.query(
    `
    SELECT
      cart.quantity,
      products.image,
      products.price
    FROM cart
    JOIN products
    ON cart.product_id = products.id
    WHERE cart.user_id = ?
    `,
    [userId],
    (err, cartItems) => {
      if (err) {
        console.error("Order cart fetch error:", err);

        return res.status(500).json({
          error: err,
        });
      }

      if (!cartItems.length) {
        return res.status(400).json({
          error: "Cart is empty",
        });
      }

      const orderValues = cartItems.map((item) => [
        item.image,
        Number(item.price) * Number(item.quantity || 1),
        userId,
      ]);

      db.beginTransaction((transactionErr) => {
        if (transactionErr) {
          console.error(
            "Order transaction error:",
            transactionErr
          );

          return res.status(500).json({
            error: transactionErr,
          });
        }

        db.query(
          "INSERT INTO orders (image_url, price, user_id) VALUES ?",
          [orderValues],
          (insertErr, result) => {
            if (insertErr) {
              return db.rollback(() => {
                console.error(
                  "Order insert error:",
                  insertErr
                );

                res.status(500).json({
                  error: insertErr,
                });
              });
            }

            db.query(
              "DELETE FROM cart WHERE user_id = ?",
              [userId],
              (deleteErr) => {
                if (deleteErr) {
                  return db.rollback(() => {
                    console.error(
                      "Cart clear after order error:",
                      deleteErr
                    );

                    res.status(500).json({
                      error: deleteErr,
                    });
                  });
                }

                db.commit((commitErr) => {
                  if (commitErr) {
                    return db.rollback(() => {
                      console.error(
                        "Order commit error:",
                        commitErr
                      );

                      res.status(500).json({
                        error: commitErr,
                      });
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
    return res.status(400).json({
      error: "User ID is required",
    });
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

  db.query(
    "DELETE FROM orders WHERE order_id = ?",
    [orderId],
    (err, result) => {
      if (err) {
        console.error("Delete order error:", err);

        return res.status(500).json({
          error: err,
        });
      }

      if (!result.affectedRows) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      res.json({
        message: "Order cancelled successfully",
      });
    }
  );
});

// ================== AI AGENT ==================

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function parseProductPrice(value) {
  const numericPrice = Number.parseFloat(String(value ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(numericPrice) ? numericPrice : 0;
}

function detectBudget(message) {
  const budgetMatch = String(message)
    .toLowerCase()
    .match(/(?:under|below|within|less than|max|budget)\s*(?:rs\.?|rupees?|inr)?\s*([0-9][0-9,]*)/i);

  if (!budgetMatch) {
    return null;
  }

  const budget = Number.parseInt(budgetMatch[1].replace(/,/g, ""), 10);
  return Number.isFinite(budget) ? budget : null;
}

function buildLocalAiReply(message, products) {
  const normalizedMessage = String(message ?? "").toLowerCase();
  const keywords = normalizedMessage
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2);
  const budget = detectBudget(normalizedMessage);
  const isLuxury = normalizedMessage.includes("luxury") || normalizedMessage.includes("premium") || normalizedMessage.includes("rolex");

  const scoredProducts = products.map((product) => {
    const searchableText = [
      product.name,
      product.category,
      product.color,
      product.description,
    ]
      .join(" ")
      .toLowerCase();

    let score = 0;

    keywords.forEach((keyword) => {
      if (searchableText.includes(keyword)) {
        score += 2;
      }
    });

    if (budget !== null && product.numericPrice <= budget) {
      score += 3;
    }

    if (isLuxury && product.numericPrice >= 50000) {
      score += 10; // Boost luxury watches
    }

    if (normalizedMessage.includes('rolex') && product.name.toLowerCase().includes('rolex')) {
      score += 20; // Specific boost for Rolex
    }

    return {
      ...product,
      score,
    };
  });

  let matches = scoredProducts;

  if (budget !== null) {
    const budgetMatches = scoredProducts.filter((product) => product.numericPrice <= budget);
    if (budgetMatches.length) {
      matches = budgetMatches;
    }
  }

  const keywordMatches = matches.filter((product) => product.score > 0);
  if (keywordMatches.length) {
    matches = keywordMatches;
  }

  const rankedProducts = matches
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      if (isLuxury) {
        return b.numericPrice - a.numericPrice; // Sort expensive first
      }
      return a.numericPrice - b.numericPrice;
    })
    .slice(0, 3);

  if (!rankedProducts.length) {
    const fallbackProducts = scoredProducts
      .sort((a, b) => isLuxury ? b.numericPrice - a.numericPrice : a.numericPrice - b.numericPrice)
      .slice(0, 3)
      .map(
        (product) =>
          `- ${product.name} for ${currencyFormatter.format(product.numericPrice)} (${product.color})`
      )
      .join("\n");

    return `I could not find an exact match for "${message}", but here are some strong options from the catalog:\n${fallbackProducts}`;
  }

  const recommendations = rankedProducts
    .map(
      (product) =>
        `- ${product.name} for ${currencyFormatter.format(product.numericPrice)} (${product.color})`
    )
    .join("\n");

  const intro =
    budget !== null
      ? `Here are the best watches I found under ${currencyFormatter.format(budget)}:\n`
      : `Here are some good matches for your request:\n`;

  return `${intro}${recommendations}`;
}



let conversationHistory = [];

app.post("/ai/chat", (req, res) => {

  const { message, userId } = req.body;

  if (!message) {

    return res.status(400).json({
      error: "Message missing"
    });

  }

  db.query(
    "SELECT id, name, price, color, category, description FROM products",

    async (err, products) => {

      if (err) {

        console.log(err);

        return res.status(500).json({
          error: "Database error"
        });

      }

      const normalizedProducts = products.map((product) => ({
        ...product,
        numericPrice: parseProductPrice(product.price),
      }));

      const fallbackReply = buildLocalAiReply(message, normalizedProducts);

      if (!process.env.OPENAI_API_KEY) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        
        const words = fallbackReply.split(' ');
        for (const word of words) {
           res.write(`data: ${JSON.stringify({ text: word + ' ' })}\n\n`);
        }
        res.write(`data: [DONE]\n\n`);
        return res.end();
      }

      try {

        let orderInfo = "No recent orders found for this user or user not logged in.";
        if (userId) {
          try {
            const orders = await new Promise((resolve, reject) => {
              db.query(
                "SELECT order_id AS id, price AS totalPrice, status FROM orders WHERE user_id = ? ORDER BY order_id DESC LIMIT 5",
                [userId],
                (err, result) => {
                  if (err) reject(err);
                  else resolve(result);
                }
              );
            });
            if (orders && orders.length > 0) {
              orderInfo = orders.map((o) => `Order ID: ${o.id}, Status: ${o.status || 'Shipped'}, Total Price: ₹${o.totalPrice}`).join("\n");
            }
          } catch (err) {
            console.error("Failed to fetch user orders for AI", err);
          }
        }

        // const productInfo = normalizedProducts.map((product) => `Product: ${product.name}\nPrice: ${currencyFormatter.format(product.numericPrice)}\nColor: ${product.color}\nCategory: ${product.category}\nDescription: ${product.description}`).join("\n\n");

const productInfo = products.map((p) => {

  return `
Product: ${p.name}
Price: ₹${p.price}
Description: ${p.description}
Category: ${p.category}
`;

}).join("\n");

/*
            (product) => `Product: ${product.name}
Price: ₹${p.price}
`;

*/

        conversationHistory.push({
          role: "user",
          content: message
        });

        const completion =
          await client.chat.completions.create({

            model: "gpt-4.1-mini",

            messages: [

              {
                role: "system",
                content: `
You are a professional luxury watch shopping assistant.

Your personality:
- Friendly
- Smart
- Professional
- Premium
- Helpful

Your work:
- Help users find watches
- Recommend stylish watches
- Compare products
- Help with pricing
- Suggest premium collections
- Encourage purchases naturally
- Answer shortly and clearly

Rules:
- Talk like a real luxury store assistant
- Be interactive
- Use attractive language
- Recommend products confidently
- Never say "I am AI"
- Keep replies modern and premium
- If user asks for cheap watches, recommend budget products
- If user asks luxury, recommend premium products
- If user asks black watches, prioritize black products
- If user asks Rolex, recommend Rolex first
- AI Search: Act as a smart search engine. If the user specifies criteria like color (e.g., black) or budget (e.g., under 50000), rigorously filter the Available Products to ONLY show matching items.
- AI Sales Agent: Actively SELL the products naturally. Describe their premium features, explain why they are a great choice (e.g., "This Rolex model is one of the most premium choices for formal styling"), and confidently encourage the user to buy them.


User's Recent Orders (use this to answer order tracking questions):
${orderInfo}

Available Products:
${productInfo}
`
              },

              ...conversationHistory
            ],
            stream: true,
          });

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        let fullReply = "";
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            fullReply += content;
            res.write(`data: ${JSON.stringify({ text: content })}\n\n`);
          }
        }

        conversationHistory.push({
          role: "assistant",
          content: fullReply
        });

        res.write(`data: [DONE]\n\n`);
        res.end();

      } catch (error) {
        console.log("AI fallback used:", error.message);

        if (!res.headersSent) {
          res.setHeader('Content-Type', 'text/event-stream');
          res.setHeader('Cache-Control', 'no-cache');
          res.setHeader('Connection', 'keep-alive');
        }

        const words = fallbackReply.split(' ');
        for (const word of words) {
           res.write(`data: ${JSON.stringify({ text: word + ' ' })}\n\n`);
        }
        res.write(`data: [DONE]\n\n`);
        res.end();

      }

    }

  );

});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
