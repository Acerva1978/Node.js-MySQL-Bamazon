require("dotenv").config();

var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require ('cli-table2')
//create connection to db
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: process.env.id,
  password: process.env.pw,
  database: "bamazonDB"
})

connection.connect();
 


function display(){
  connection.query("SELECT * FROM products", function(err,res){
    if (err) throw err;
    console.log("----------------------------")
    console.log("       Welcome to Bamazon      ")
    console.log("---------------------------")
    console.log("")
    console.log("Find Your product Here")
    console.log("")
  
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
  shopping();
});
};

function shopping() {
  inquirer
  .prompt({
    name: "productToBuy",
    type: "input",
    message: "Please enter the Product Id of the item you wish to purchase.!"
  })
  .then(function(answer1) {
    var selection = answer1.productToBuy;
    connection.query("SELECT * FROM products WHERE item_id=?", selection, function(
      err,
      res
    ) {
      if (err) throw err;
      if (res.length === 0) {
        console.log(
          "That Product doesn't exist, Please enter a Product Id from the list above"
        );

        shopping();
      } else {
        inquirer
          .prompt({
            name: "quantity",
            type: "input",
            message: "How many items woul you like to purchase?"
          })
          .then(function(answer2) {
            var quantity = answer2.quantity;
            if (quantity > res[0].stock_quantity) {
              console.log(
                "Insufficient quantity!" 
              );
              shopping();
            } else {
             
              console.log("");
              console.log(res[0].product_name + " purchased");
              console.log(quantity + " qty @ $" + res[0].price);
              console.log(
                "The total price of the purchase: $" + res[0].price * answer2.quantity);

              var newQuantity = res[0].stock_quantity - quantity;
              var newProductSale = res[0].price * answer2.quantity;
              connection.query(
                "UPDATE products SET stock_quantity = " +
                  newQuantity +
                  " WHERE item_id = " +
                  res[0].item_id,
                  "UPDATE products SET product_sales = " +
                  newProductSale +
                  " WHERE item_id = " +
                  res[0].item_id,
                function(err, resUpdate) {
                  if (err) throw err;
                  console.log("");
                  console.log("Your Order has been Processed");
                  console.log("Thank you for Shopping with us...!");
                  console.log("");
                  connection.end();
                }
              );
            }
          });
      }
    });
  });
};

display();