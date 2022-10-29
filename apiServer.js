const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const sqlite = require("sqlite3").verbose();

const db = new sqlite.Database("./priceCheckerDatabase.db", sqlite.OPEN_READWRITE, (err) => {
    if(err)
        return console.error(err)
})

//app.use(bodyParser.json())
app.use(express.json({
    type: ['application/json', 'text/plain']
  }))

app.post('/item', (req,res) => {
    try{
        console.log("new post");
        console.log(req.body);

        const { sku, name, price, isCraftable, quality } = req.body
        let sql = "INSERT INTO Item VALUES(?,?,?,?,?,?,?)"

        db.run(sql, [sku, name, price, isCraftable, 'ext', quality, 'ext'], err =>{
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