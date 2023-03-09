//#region Require
const express = require("express");
const session = require("express-session");
const formidable = require("express-formidable");
const cookieParser = require("cookie-parser");

const mysql = require("mysql2");
const fs = require("fs");

const config = require("./config");
const EmailSender = require("./email_sender");
//#endregion

//#region  Init pool, app
const pool = mysql.createConnection(config.db_connect);
const app = express();
//#endregion

//#region app.use
app.use(formidable());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(
  session({
    secret: "14.1",
  })
);
//#endregion

// Login
app.post("/api/login", async (req, res) => {
  let data = req.fields;

  // validation*

  try{
    pool.query(`SELECT family_id, id, role FROM user WHERE login = "${data["login"]}" AND password = "${data["password"]}" AND family_id = ${data["family_id"]};`, 
      function(err, results) {
        console.log("results:",results); 
        console.log("error:",err);
        if(err == null && results.length == 1){
          req.session.userFamilyId = results[0]["family_id"];
          req.session.userId = results[0]["id"];
          req.session.userRole = results[0]["role"];
          res.sendStatus(200);
        }else{
          res.sendStatus(400);
        }
    });
  }catch(e){
    console.log(e);
    res.sendStatus(400);
  }
});

// Logout
app.post("/api/logout", async (req, res) => {
  req.session.destroy((error)=>{res.send((error == undefined)? 200:400)});
});

// Registration                     In Progress 
app.post("/api/register", async (req, res) => {
  let data = req.fields;
  
  // validation*

  let code = Math.floor(1000 + Math.random() * 9000);
  try {
    
      pool.query(`INSERT INTO family ( name ,email ) VALUES ( '' ,'${data["email"]}' );`, 
        function(err, results) {
          console.log("results:",results); 
          console.log("error:",err);
          if(err == undefined){

            pool.query(`INSERT INTO USER ( name, surname, login, password, role, family_id, balance)
              VALUES ('${data["first_name"]}', '${data["last_name"]}', '${data["login"]}', '${data["password"]}', ('parent'), ${results[0]["insertId"]}, NULL );`, 
              function(err, results) {
                console.log("results:",results); 
                console.log("error:",err);
                if(err == undefined){
                  
                }else{
                  res.sendStatus(400);
                  return;
                }
            });

          }else{
            res.sendStatus(400);
            return;
          }
      });
    await EmailSender.SendEmail(data["email"]);

  } catch (ex) {
    console.log(ex);
    res.sendStatus(400);
    return;
  }
  res.sendStatus(200);
});

// Create Task
app.post("/api/create_task", async (req, res) => {
  if (req.session.userRole == config.data.ParentRole){
    let data = req.fields;

    // validation*

    try{
      pool.query(`INSERT INTO task_list( family_id, title, description, reward, start_date, end_date, children_task_list, user_id, created_at ) VALUES ( ${req.session.userFamilyId}, '${data["task_title"]}', '${data["task_desc"]}', ${data["task_reward"]}, ${data["task_start_date"]}, ${data["task_end_date"]}, '${data["task_children_list"]}', ${req.session.userId}, NOW() );`, 
        function(err, results) {
          console.log("results:",results); 
          console.log("error:",err);
          if(err == null){
            res.sendStatus(200);
          }else{
            res.sendStatus(400);
          }
      });
    }catch(e){
      console.log(e);
      res.sendStatus(400);
    }
  }else{
    res.sendStatus(400);
  }
});
// Create User
app.post("/api/create_user", async (req, res) => {
  if (req.session.userRole == config.data.ParentRole){
    let data = req.fields;

    // validation*

    try{
      pool.query(`INSERT INTO USER ( name, surname, login, password, role, family_id, balance)
        VALUES ('${data["first_name"]}', '${data["last_name"]}', '${data["login"]}', '${data["password"]}', ('${(data["role"]==0) ? config.data.ChildRole:config.data.ParentRole}'), ${results.session.userFamilyId}, 0 );`, 
        function(err, results) {
          console.log("results:",results); 
          console.log("error:",err);
          if(err == undefined){
            
          }else{
            res.sendStatus(400);
            return;
          }
      });
    }catch(e){
      console.log(e);
      res.sendStatus(400);
    }
  }else{
    res.sendStatus(400);
  }
});

app.listen(config.server.port, () => console.log("Server is running..."));