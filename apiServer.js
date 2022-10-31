const express = require("express")
const bodyParser = require("body-parser")
const cors = require('cors')
const app = express()
const sqlite = require("sqlite3").verbose();

const db = new sqlite.Database("./priceCheckerDatabase.db", sqlite.OPEN_READWRITE, (err) => {
    if(err)
        return console.error(err)
})

app.use(cors())
var jsonParser = bodyParser.json()

/*
app.use(express.json({
    type: ['application/json', 'text/plain']
  }))
*/

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
        return res.json({status:400, success: false})
    }
})

app.delete('/item/:sku' , (req,res) => {
    try{
        var sku = req.params.sku;
        let sql = "DELETE FROM Item WHERE sku = '" + sku + "'";

        db.run(sql, [], err => {
            if(err)
                return res.json({ status: 300, success: false, error: err })
            else
                return res.json({ status: 200, success: true })
        })
    }catch (error){
        return res.json({status:400, success: false})
    }
})

app.put("/item/:sku", jsonParser, (req,res) => {
    try{
        console.log(req.body);
        const { name, price, isCraftable, type, quality, classItem } = req.body;
        var sku = req.params.sku;
        console.log(sku);
        //let sql = "UPDATE Item SET name = ?, price = ?, isCraftable = ?, type = ?, quality = ?, class = ? WHERE sku = ?";

        let sql = "UPDATE Item SET name = ?, price = ?, isCraftable = ?, type = ?, quality = ?, class = ? WHERE sku = ?";
        db.run(sql, [name,price, isCraftable,type, quality, classItem,sku], err => {
            if(err)
            {
                console.log("300");
                return res.json({ status: 300, success: false, error: err })
            }
            else{
                console.log("200");
                return res.json({
                    status: 200,
                    success: true
                })
            }
        })
        }catch{
            return res.json({
                status: 400,
                success: false
            })
        }

        /*
        db.run(sql, [name,price,isCraftable,type,quality,classItem,sku], err => {
            if(err)
            {
                console.log("300");
                return res.json({ status: 300, success: false, error: err })
            }
            else{
                console.log("200");
                return res.json({
                    status: 200,
                    success: true
                })
            }
        })
    }catch{
        return res.json({
            status: 400,
            success: false
        })
    }
    */
})

app.post('/item', jsonParser, (req,res) => {
    try{
        const { sku, name, price, isCraftable, type, quality } = req.body
        let sql = "INSERT INTO Item VALUES(?,?,?,?,?,?,?)"

        db.run(sql, [sku, name, price, isCraftable, type, quality, 'ext'], err =>{
            if(err)
                return res.json({ status: 300, success: false, error: err })
            else{
                return res.json({
                    status: 200,
                    success: true
                })
            }
        })
    }catch(error){
        return res.json({
            status: 400,
            success: false
        })
    }
})
app.listen(3000)