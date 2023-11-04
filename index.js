const express = require("express");
const app = express();
const mysql = require('mysql2');
const { faker, zh_CN } = require('@faker-js/faker') ;
const path = require('path');
const methodOverride = require('method-override')

app.set("view engine","ejs");
app.use(express.static(path.join(__dirname ,'/backend/views')));
app.use(express.static(path.join(__dirname ,'/backend/public')));
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));

// let createRandomUser =() => {
//     return [
//         faker.string.uuid(),
//         faker.internet.userName(),
//         faker.internet.email(),
//         faker.internet.password(),
//     ];
// };

// let q = "INSERT INTO user(id,username,email,password) VALUES ?";
const port = 9023;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password:"Anushkasen@0408"
  });
  
// let data =[];
// for(let i = 1; i <= 100;i++){
//     data.push(RandomUser());
// }



app.get('/', (req,res) =>{
    let q =`SELECT count(*) FROM user`;
    try{
        connection.query(q,(err,result)=>{
            if(err) {
                throw(err);
            }else{
                let count = result[0]["count(*)"];
                res.render("home.ejs", {count: count});
            }
        })
    }catch(err){
        console.log(err);
    }
})
app.get('/user', (req,res) =>{
    let q =`SELECT * FROM user`;

    try{
        connection.query(q,(err,users)=>{
            if(err) {
                throw(err);
            }else{
                res.render("show.ejs",{users});
            }
        })
    }catch(err){
        console.log(err);
    }
})

app.get("/user/:id/edit", (req,res) =>{
    let {id} = req.params;
    let q = `SELECT * FROM user
            WHERE id="${id}"`;
            try{
                connection.query(q,(err,result)=>{
                    if(err) {
                        throw(err);
                    }else{
                        console.log(result[0]);
                        let name = result[0];
                        res.render("edit.ejs",{name});
                    }
                })
            }catch(err){
                console.log(err);
            }
})

app.patch("/user/:id", (req, res) => {
    const { id } = req.params;
    const { password: formpass, username: newUsername } = req.body;

    const selectQuery = `SELECT * FROM user WHERE id = ?`;
        connection.query(selectQuery, [id], (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Error in SELECT query");
                } else {
                    if (result.length === 0) {
                        res.status(404).send("User not found");
                    } else {
                        const user = result[0];

                        if (formpass !== user.password) {
                            res.status(401).send("Wrong Password");
                        } else {
                            const updateQuery = `UPDATE user SET username = ? WHERE id = ?`;
                            connection.query(updateQuery, [newUsername, id], (err, updateResult) => {
                                if (err) {
                                    console.log(err);
                                    res.status(500).send("Error in UPDATE query");
                                } else {
                                    res.status(200).send("Username updated successfully");
                                }
                            });
                        }
                    }
                }
            });
    });

    app.get("/new/user", (req, res) => {
        res.render("add.ejs");
    });
    
    app.post('/user/add', (req, res) => {
        const { id, username, email, password } = req.body;
    
        const insertQuery = 'INSERT INTO user (id, username, email, password) VALUES (?, ?, ?, ?)';
        const values = [id, username, email, password];
    
        connection.query(insertQuery, values, (err, result) => {
            if (err) {
                console.log(err);
                res.send('Error creating the user');
            } else {
                console.log(result);
                res.send('User created successfully');
                console.log(result); 
            }
        });
    });
 app.delete('/user/:id', (req, res) => {
    const userId = req.params.id;
    
    const deleteQuery = 'DELETE FROM user WHERE id = ?';
    
    connection.query(deleteQuery, [userId], (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).send('Error deleting the user');
        } else if (result.affectedRows === 0) {
          res.status(404).send('User not found');
        } else {
          res.status(200).send('User deleted successfully');
        }
      });
    });
    
app.listen(port, () =>{
    console.log(`server is lisning to port :${port}`)
} )