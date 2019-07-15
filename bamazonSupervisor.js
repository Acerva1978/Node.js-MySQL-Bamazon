require("dotenv").config();

var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require ('cli-table2')
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: process.env.id,
  password: process.env.pw,
  database: "bamazonDB"
})

function start(){
  inquirer.prompt([{
    type: "list",
    name: "doThing",
    message: "What would you like to do?",
    choices: ["View Product Sales by Department", "Create New Department", "End Session"]
  }]).then(function(ans){
    switch(ans.doThing){
      case "View Product Sales by Department": viewProductByDept();
      break;
      case "Create New Department": createNewDept();
      break;
      case "End Session": console.log('Bye!');
    }
  });
}


function viewProductByDept(){


  connection.query('SELECT * FROM departments', 'SELECT * FROM products', function(err, res){
    if(err) throw err;
    console.log('>>>>>>Product Sales by Department<<<<<<');
    console.log('----------------------------------------------------------------------------------------------------')
    
    
    var table = new Table ({
      head: ["Product Id", "Department Name", "Over Head Cost", "Product Sales", "Total Profit"],
      colwidths: [10, 30, 30, 8, 8],
      colAligns: ["left", "left", "center", "right", "center"],
      chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
           , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
           , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
           , 'right': '║' , 'right-mid': '╢' , 'middle': '│' },
      style: {
        head: ["aqua"],
        body: ["aqua"],
        compact: true
      }
    });
    for (var i = 0; i < res.length; i++){
      table.push ([res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].product_sales, res[i].product_sales - res[i].over_head_costs]);
    }
    console.log(table.toString());
    console.log("");
    start();
  })
}

  
  function createNewDept(){
    console.log('>>>>>>Creating New Department<<<<<<');
    //prompts to add deptName and numbers. if no value is then by default = 0
    inquirer.prompt([
    {
      type: "input",
      name: "deptName",
      message: "Department Name: "
    }, {
      type: "input",
      name: "overHeadCost",
      message: "Over Head Cost: ",
      default: 0,
      validate: function(val){
        if(isNaN(val) === false){return true;}
        else{return false;}
      }
    }, {
      type: "input",
      name: "prodSales",
      message: "Product Sales: ",
      default: 0,
      validate: function(val){
        if(isNaN(val) === false){return true;}
        else{return false;}
      }
    }
    ]).then(function(ans){
      connection.query('INSERT INTO Departments SET ?',{
        DepartmentName: ans.deptName,
        OverHeadCosts: ans.overHeadCost,
        TotalSales: ans.prodSales
      }, function(err, res){
        if(err) throw err;
        console.log('Another department was added.');
      })
      start();
    });
  }

start();