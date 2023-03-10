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
app.use(session({secret: "14.1",}));
app.use("/api/*", function (req, res, next) {
  var uid = req.originalUrl;

  if(uid == config.routes.login || uid == config.routes.register){
    next();
    return;
  }
  if (!req.session.logined == true) {
    res.status(403).send({ message: "No token provided!" });
    return;
  } else {
    next();
  }
});

//#endregion

// Login args(login, password, family_id)
app.post(config.routes.login, async (req, res) => {
  if(req.session.logined == true){
    res.sendStatus(200).send({ message: "Success!" });
    return;
  }
  let data = req.fields;

  // validation*

  pool.query(`SELECT family_id, id, role FROM user WHERE login = "${data["login"]}" AND password = "${data["password"]}" AND family_id = ${data["family_id"]};`, 
    function(err, results) {
      // console.log("results:",results); 
      if(err == null && results.length == 1){
        //#region Configure Session
        req.session.logined = true;
        req.session.userFamilyId = results[0]["family_id"];
        req.session.userId = results[0]["id"];
        req.session.userRole = results[0]["role"];
        //#endregion
        res.sendStatus(200).send({ message: "Success!" });
      }else{
        console.log("error:",err);
        res.sendStatus(400).send({ message: "Wrong login,password or family code" });
      }
  });
});

// Logout args()
app.post(config.routes.login, async (req, res) => {
  req.session.destroy((error)=>{res.send((error == undefined)? 200:400).send({ message: (error == undefined)? "Success!":"Oops!" });});
});

// Registration args(email, first_name, last_name, login, password)
app.post(config.routes.register, async (req, res) => {
  let data = req.fields;
  
  // validation*

  //let code = Math.floor(1000 + Math.random() * 9000);
  pool.query(`INSERT INTO family ( name ,email ) VALUES ( "" ,"${data["email"]}" );`, 
    function(err, results) {
      // console.log("results:",results); 
      if(err == undefined){
        pool.query(`INSERT INTO USER ( name, surname, login, password, role, family_id, balance)
          VALUES ("${data["first_name"]}", "${data["last_name"]}", "${data["login"]}", "${data["password"]}", ("parent"), ${results["insertId"]}, NULL );`, 
          function(err, results2) {
            // console.log("results:",results2); 
            if(err == undefined){
              EmailSender.SendEmail(data["email"],results["insertId"]);
              res.sendStatus(200).send({ message: "Success!" });
              return;
            }else{
              console.log("error:",err);
              res.sendStatus(400).send({ message: "Oops2!" });
              return;
            }
        });

      }else{
        console.log("error:",err);
        res.sendStatus(400).send({ message: "Oops1!" });
        return;
      }
  });

});

// Create Task args(task_title, task_desc, task_reward, task_start_date, task_end_date, task_children_list)
app.post(config.routes.create_task, async (req, res) => {
  if (req.session.userRole == config.data.ParentRole){
    let data = req.fields;

    // validation*

    pool.query(`INSERT INTO task_list( family_id, title, description, reward, start_date, end_date, children_task_list, user_id, created_at ) 
    VALUES ( ${req.session.userFamilyId}, "${data["task_title"]}", "${data["task_desc"]}", ${data["task_reward"]}, "${data["task_start_date"]}", "${data["task_end_date"]}", "${data["task_children_list"]}", ${req.session.userId}, NOW() );`, 
      function(err, results) {
        // console.log("results:",results); 
        if(err == null){
          res.sendStatus(200).send({ message: "Success!" });
        }else{
          console.log("error:",err);
          res.sendStatus(400).send({ message: "Oops!" });
        }
    });

  }else{
    res.sendStatus(400);
  }
});

// Create User args(first_name, last_name, login, password)
app.post(config.routes.create_user, async (req, res) => {
  if (req.session.userRole == config.data.ParentRole){
    let data = req.fields;

    // validation*

    pool.query(`INSERT INTO USER ( name, surname, login, password, role, family_id, balance)
      VALUES ("${data["first_name"]}", "${data["last_name"]}", "${data["login"]}", "${data["password"]}", ("${(data["role"]==0) ? config.data.ChildRole:config.data.ParentRole}"), ${results.session.userFamilyId}, 0 );`, 
      function(err, results) {
        // console.log("results:",results); 
        if(err == undefined){
          res.sendStatus(200).send({ message: "Success!" });
        }else{
          console.log("error:",err);
          res.sendStatus(400).send({ message: "Oops!" });
        }
    });
    
  }else{
    res.sendStatus(400);
  }
});

// Add Expense args(expense_category, expense_amount)
app.post(config.routes.add_expense, async (req, res) => {
  if (req.session.userRole == config.data.ChildRole){
    let data = req.fields;

    // validation*

    pool.query(`INSERT INTO expenses ( child_id, category, amount, created_at )
      VALUES ("${results.session.userId}", "${data["expense_category"]}", "${data["expense_amount"]}", NOW() );`, 
      function(err, results) {
        // console.log("results:",results); 
        if(err == undefined){
          // ChangeBalance                      !!!!
          res.sendStatus(200).send({ message: "Success!" });
        }else{
          console.log("error:",err);
          res.sendStatus(400).send({ message: "Oops!" });
        }
    });
  }else{
    res.sendStatus(400).send({ message: "You are not a parent." });
  }
});

app.listen(config.server.port, () => console.log("Server is running..."));