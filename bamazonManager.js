require("dotenv").config();

var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table2");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: process.env.id,
  password: process.env.pw,
  database: "bamazonDB"
});

connection.connect(function(err) {
  if (err) throw err;
  displayMenu();
});

function displayMenu() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "Menu",
        message: "Choose you option from the below menu???",
        choices: [
          "a: View Products for Sale",
          "b: View Low Inventory",
          "c: Add to Inventory",
          "d: Add New Product",
          "e: Exit"
        ]
      }
    ])
    .then(function(choice) {
      switch (choice.Menu) {
        case "a: View Products for Sale":
          viewProductsForSale();
          break;
        case "b: View Low Inventory":
          viewLowInventory();
          break;
        case "c: Add to Inventory":
          addToInventory();
          break;
        case "d: Add New Product":
          addNewProduct();
          break;
        case "e: Exit":
          process.exit();
          break;
      }
    });
}

function viewProductsForSale(){
  connection.query("SELECT * FROM products", function(err,res){
    if (err) throw err;
    console.log("");
    console.log("Complete Inventory List");
    console.log("");
  
  var table = new Table ({
    head: ["Product Id", "Product Name", "Department Name", "Price", "Stock Quantity"],
    colwidths: [10, 30, 30, 8, 8],
    colAligns: ["left", "left", "left", "right", "center"],
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
    table.push ([res[i].item_id,res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
  }
  console.log(table.toString());
  console.log("");
  displayMenu();
});
};

function viewLowInventory() {
  var sql =
    "select item_id,product_name, price, stock_quantity from products where stock_quantity<5";
  connection.query(sql, function(err, res) {
    if (err) throw err;
    console.log("Items with inventory count lower than five.");
    console.log("Id \t Name \t Price \t Quantity\n");
    for (var i = 0; i < res.length; i++) {
      console.log(
        res[i].item_id +
          "\t" +
          res[i].product_name +
          "\t" +
          res[i].price +
          "\t" +
          res[i].stock_quantity +
          "\n"
      );
    }
    displayMenu();
  });
}



function addToInventory() {
  connection.query("SELECT * FROM products", function(err,res){
    if (err) throw err;
    
  
  var table = new Table ({
    head: ["Product Id", "Product Name", "Department Name", "Price", "Stock Quantity"],
    colwidths: [10, 30, 30, 8, 8],
    colAligns: ["left", "left", "left", "right", "center"],
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
    table.push ([res[i].item_id,res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
  
  }
  console.log(table.toString());
  console.log("");

    inquirer
      .prompt([
        {
          type: "input",
          name: "product",
          message: "Select the item number to add more to inventory??"
        },
        {
          type: "input",
          name: "quantity",
          message: "How many items would like to add to invenotry??"
        }
      ])
      .then(function(answer) {
        var purchaseItemId = answer.product;
        if (
          purchaseItemId > res.length + 1 ||
          isNaN(purchaseItemId || isNaN(answer.quantity))
        ) {
          console.log("invalid Input");
          if (purchaseItemId > res.length + 1 || isNaN(purchaseItemId))
            console.log("The item id is not valid");
          if (isNaN(answer.quantity)) console.log("Invalid quantity");
          displayMenu();
        } else {
          connection.query(
            "select stock_quantity from products where item_id = ?",
            [purchaseItemId],
            function(err, res) {
              if (err) throw err;
              var updateQuantity =
                res[0].stock_quantity + parseFloat(answer.quantity);
              connection.query(
                "update products set ? where ?",
                [
                  {
                    stock_quantity: updateQuantity
                  },
                  {
                    item_id: purchaseItemId
                  }
                ],
                function(err, res) {
                  if (err) throw err;
                  displayMenu();
                }
              );
            }
          );
        }
      });
  });
}

function addNewProduct() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "product_name",
        message: "Enter the name of product to add??"
      },
      {
        type: "input",
        name: "department_name",
        message: "Enter the department of product to add??"
      },
      {
        type: "input",
        name: "price",
        message: "Enter the price of product to add??"
      },
      {
        type: "input",
        name: "stock_quantity",
        message: "Enter the quantity of product to add??"
      }
    ])
    .then(function(answer) {
      if (isNaN(answer.price) || isNaN(answer.stock_quantity)) {
        console.log("Invalid Input");
        if (isNaN(answer.price)) console.log("Invalid Price");
        if (isNaN(answer.stock_quantity)) console.log("Invalid Quantity");
        displayMenu();
      } else {
        var newrow = {
          product_name: answer.product_name,
          department_name: answer.department_name,
          price: answer.price,
          stock_quantity: answer.stock_quantity
        };
        var sql = "insert into products set ?";
        connection.query(sql, newrow, function(err, res) {
          if (err) throw err;
          displayMenu();
        });
      }
    });
}