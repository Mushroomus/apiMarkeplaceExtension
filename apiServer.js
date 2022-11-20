const express = require("express")
const bodyParser = require("body-parser")
const cors = require('cors')
const app = express()
const sqlite = require("sqlite3").verbose();
const fs = require('fs')

let config = null
try {
    config = JSON.parse(fs.readFileSync('config.json'))
} catch(ex) {
    console.error('Error reading configuration:', ex.message)
    process.exit(0)
}

console.log(config.dbLocation);

const db = new sqlite.Database(config.dbLocation, sqlite.OPEN_READWRITE, (err) => {
    if(err)
        return console.error(err)
})

app.use(cors())
var jsonParser = bodyParser.json()

app.get('/item/:sku', (req,res) => {
    try{
        var sku = req.params.sku;
        let sql = "SELECT name, price, isCraftable, type, quality, class FROM Item WHERE sku = ?";

        db.all(sql, [sku], (err,rows) => {
            if(err)
                return res.json({ status: 300, success: false, error: err })
            
            if(rows.length < 1)
                return res.json({message: 'item does not exist'})
            else
                return res.json({message: 'item exists', data: rows})
        })
    } catch (error) {
        return res.json({ message: 'Something went wrong', status:400, success: false})
    }
})

app.delete('/item/:sku' , (req,res) => {
    try{
        var sku = req.params.sku;
        let sql = "DELETE FROM Item WHERE sku = '" + sku + "'";

        db.run(sql, [], err => {
            if(err)
                return res.json({ message: 'Something went wrong', status: 300, success: false, error: err })
            else
                return res.json({ message: 'Item was deleted', status: 200, success: true })
        })
    }catch (error){
        return res.json({ message: 'Something went wrong', status:400, success: false})
    }
})

app.put("/item/:sku", jsonParser, (req,res) => {
    try{
        const { name, price, isCraftable, type, quality, classItem } = req.body;
        var sku = req.params.sku;

        let sql = "UPDATE Item SET name = ?, price = ?, isCraftable = ?, type = ?, quality = ?, class = ? WHERE sku = ?";
        db.run(sql, [name,price, isCraftable,type, quality, classItem,sku], err => {
            if(err)
                return res.json({ message: 'Something went wrong', status: 300, success: false, error: err })
            else
                return res.json({ message: 'Item was updated', status: 200, success: true })
        })
    }catch (error) {
        return res.json({ message: 'Something went wrong', status: 400, success: false })
    }
})

app.post('/item', jsonParser, (req,res) => {
    try{
        const { sku, name, price, isCraftable, type, quality } = req.body
        let sql = "INSERT INTO Item VALUES(?,?,?,?,?,?,?)"

        db.run(sql, [sku, name, price, isCraftable, type, quality, 'Ext'], err =>{
            if(err)
                return res.json({ message: 'Something went wrong', status: 300, success: false, error: err })
            else
                return res.json({ message: 'Item was added', status: 200, success: true })
        })
    }catch(error){
        return res.json({ message: 'Something went wrong', status: 400, success: false })
    }
})
app.listen(3000)