-- drop db if exists,--
DROP DATABASE IF EXISTS bamazonDB; 
  --create db --
CREATE DATABASE bamazonDB; 

-- use bamazon db --
USE bamazonDB;

-- products table --
CREATE TABLE products (
  item_id INT(10) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT (100) NOT NULL,
  PRIMARY KEY (item_id)
);


-- SELECT * FROM products;

-- default products vals -- 
-- populating base product sales data assuming past sales have occurred so that profitability won't be all deeply negative -- 
INSERT INTO products (product_name, department_name, price, stock_quantity)
	VALUES ("'The Beatles' Vinyl Record", "Music", 100.00, 10), ("Pogo Stick", "Outdoors", 30.00, 200),
         ("Tent", "Camping", 80.00, 40), ("iPhone 7 Case", "Electronics", 20.99, 100), 
        ("Car Mat - 4 Pack", "Automobile", 30.00, 107), ("Mouse", "Computer Electornics", 79.99, 10), ("iPhone 6 Case", "Accessories", 29.99, 40), 
        ("Water Bottle", "Accessories", 19.99, 20), ("MacBook Pro", "Computer Electornics", 999.99, 4), 
        ("Chromecast", "Computer Electornics", 49.99, 15), ("24' LCD Monitor", "Computer Electornics", 249.99, 5);
    
-- ALTER TABLE products ADD product_sales DECIMAL(10,2) NOT NULL;



CREATE TABLE departments(
    department_id INT(10) AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    over_head_costs DECIMAL(10,2) NOT NULL,
    total_profit DECIMAL(10,2) NOT NULL,
    PRIMARY KEY(department_id));

INSERT INTO departments(department_name, over_head_costs, total_profit)
VALUES ("Music", 50000.00, 15000.00),
    ("Electronics", 20000.00, 12000.00),
    ("Automobile", 30000.00, 15000.00),
    ("living Room", 3000.00, 12000.00),
    ("Accessories", 1200.00, 15000.00),
    ("Camping", 40000.00, 12000.00),
    ("Computer Electornics", 35000.00, 15000.00),
    ("Outdoors", 12000.00, 12000.00);

  









