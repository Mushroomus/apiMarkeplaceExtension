const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const sqlite = require("sqlite3").verbose();
const fs = require("fs");

const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Marketplace API",
    },
  },
  apis: ["apiServer.js"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

let config = null;
try {
  config = JSON.parse(fs.readFileSync("config.json"));
} catch (ex) {
  console.error("Error reading configuration:", ex.message);
  process.exit(0);
}

console.log(config.dbLocation);

const db = new sqlite.Database(
  config.dbLocation,
  sqlite.OPEN_READWRITE,
  (err) => {
    if (err) return console.error(err);
  }
);

app.use(cors());
var jsonParser = bodyParser.json();

/**
 * @swagger
 * tags:
 * name: Item
 * description: API endpoints for managing items
 *
 * /item/{sku}:
 *   get:
 *     summary: Get item by SKU
 *     description: Retrieve information about a specific item by SKU.
 *     tags: [Item]
 *     parameters:
 *       - in: path
 *         name: sku
 *         required: true
 *         schema:
 *           type: string
 *         description: SKU of the item to retrieve.
 *     responses:
 *       200:
 *         description: Returns item information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "item was found"
 *                   description: Indicating item exists in database.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "Fancy Fedora"
 *                         description: Name of the item.
 *                       price:
 *                         type: number
 *                         example: 3.12
 *                         description: Price of the item.
 *                       isCraftable:
 *                         type: string
 *                         example: "Yes"
 *                         description: Indicates whether the item is craftable or not.
 *                       type:
 *                         type: string
 *                         example: "Cosmetics"
 *                         description: Type of the item.
 *                       quality:
 *                         type: string
 *                         example: "Unique"
 *                         description: Quality of the item.
 *                       class:
 *                         type: string
 *                         example: "Spy"
 *                         description: Class of the item.
 *         examples:
 *           application/json:
 *             message: "Item was found"
 *             data : [
 *               {
 *                 "name": "Fancy Fedora",
 *                 "price": 3.12,
 *                 "isCraftable": "Yes",
 *                 "type": "Cosmetics",
 *                 "quality": "Unique",
 *                 "class": "Spy"
 *               }
 *             ]
 *       402:
 *         description: Item not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Item not found"
 *                   description: Indicating item does not exists in database.
 *         examples:
 *           application/json:
 *             message: "Item not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error occured"
 *                   description: A message indicating the return message.
 *         examples:
 *           application/json:
 *             message: "Error occured"
 *   put:
 *     summary: Update item by SKU
 *     description: Update item by SKU.
 *     tags: [Item]
 *     parameters:
 *       - in: path
 *         name: sku
 *         required: true
 *         schema:
 *           type: string
 *         description: SKU of the item to retrieve.
 *       - in: body
 *         name: body
 *         description: Request payload for updating an item.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               default: "Item Name"
 *             price:
 *               type: number
 *               default: 0.00
 *             isCraftable:
 *               type: string
 *               default: "Yes"
 *             type:
 *               type: string
 *               default: "Cosmetics"
 *             quality:
 *               type: string
 *               default: "Vintage"
 *             classItem:
 *               type: string
 *               default: "Scout"
 *     responses:
 *       200:
 *         description: Returns message that item was updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Item updated"
 *                   description: A message indicating the return message.
 *         examples:
 *           application/json:
 *             message: "Item updated"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error occured"
 *                   description: A message indicating the return message.
 *         examples:
 *           application/json:
 *             message: "Error occured"
 *
 *   delete:
 *     summary: Delete item by SKU
 *     description: Delete item by SKU.
 *     tags: [Item]
 *     parameters:
 *       - in: path
 *         name: sku
 *         required: true
 *         schema:
 *           type: string
 *         description: SKU of the item to retrieve.
 *     responses:
 *       200:
 *         description: Returns message that item was deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Item deleted"
 *                   description: A message indicating the return message.
 *         examples:
 *           application/json:
 *             message: "Item deleted"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error occured"
 *                   description: A message indicating the return message.
 *         examples:
 *           application/json:
 *             message: "Error occured"
 * /item:
 *   post:
 *     summary: Create item by SKU
 *     description: Create item by SKU.
 *     tags: [Item]
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Request payload for creating an item.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             sku:
 *               type: string
 *               default: "123;4"
 *             name:
 *               type: string
 *               default: "Item Name"
 *             price:
 *               type: number
 *               default: 0.00
 *             isCraftable:
 *               type: string
 *               default: "No"
 *             type:
 *               type: string
 *               default: "Cosmetics"
 *             quality:
 *               type: string
 *               default: "Genuine"
 *             classItem:
 *               type: string
 *               default: "Pyro"
 *     responses:
 *       200:
 *         description: Returns message that item was created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Item created"
 *                   description: A message indicating the return message.
 *         examples:
 *           application/json:
 *             message: "Item created"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error occured"
 *                   description: A message indicating the return message.
 *         examples:
 *           application/json:
 *             message: "Error occured"
 */

app.get("/item/:sku", (req, res) => {
  try {
    var sku = req.params.sku;
    let sql =
      "SELECT name, price, isCraftable, type, quality, class FROM Item WHERE sku = ?";

    db.all(sql, [sku], (err, rows) => {
      if (err) return res.status(500).json({ message: "Error occured" });

      if (rows.length < 1)
        return res.status(402).json({ message: "Item not found" });
      else
        return res.status(200).json({ message: "Item was found", data: rows });
    });
  } catch (error) {
    return res.status(500).json({ message: "Error occured" });
  }
});

app.delete("/item/:sku", (req, res) => {
  try {
    var sku = req.params.sku;
    let sql = "DELETE FROM Item WHERE sku = '" + sku + "'";

    db.run(sql, [], (err) => {
      if (err)
        return res.status(500).json({
          message: "Error occured",
        });
      else
        return res.status(200).json({
          message: "Item deleted",
        });
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error occured",
    });
  }
});

app.put("/item/:sku", jsonParser, (req, res) => {
  try {
    const { name, price, isCraftable, type, quality, classItem } = req.body;
    var sku = req.params.sku;

    let sql =
      "UPDATE Item SET name = ?, price = ?, isCraftable = ?, type = ?, quality = ?, class = ? WHERE sku = ?";
    db.run(
      sql,
      [name, price, isCraftable, type, quality, classItem, sku],
      (err) => {
        if (err)
          return res.status(500).json({
            message: "Error occured",
          });
        else
          return res.status(200).json({
            message: "Item updated",
          });
      }
    );
  } catch (error) {
    return res.status(500).json({
      message: "Error occured",
    });
  }
});

app.post("/item", jsonParser, (req, res) => {
  try {
    const { sku, name, price, isCraftable, type, quality } = req.body;
    let sql = "INSERT INTO Item VALUES(?,?,?,?,?,?,?)";

    db.run(
      sql,
      [sku, name, price, isCraftable, type, quality, "Ext"],
      (err) => {
        if (err)
          return res.status(500).json({
            message: "Error occured",
          });
        else
          return res.status(200).json({
            message: "Item created",
          });
      }
    );
  } catch (error) {
    return res.status(500).json({
      message: "Error occured",
    });
  }
});

app.listen(3000);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
