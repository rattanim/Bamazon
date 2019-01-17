var mysql = require("mysql");
var Table = require("cli-table");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
});
connection.connect(function (err) {
    if (err) throw err;
    displayProducts();
  });
  function displayProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
      console.log("-----------------------------------");
      console.log("Welcome!\nThis is a list of all our latest products for sale:");
      console.log("-----------------------------------");
      for (var i = 0; i < res.length; i++) {
        console.log(res[i].id + " | " + res[i].item + " | " + res[i].department + " | " + res[i].price + " | " + res[i].quantity);
      }
      console.log("-----------------------------------");
    });
    customerQuestions1(res); 
}
function customerQuestions1(inventory) {
    inquirer.prompt([
      {
        name: "productID",
        type: "input",
        message: "What is the ID of the product you want to buy?",

        validate: function(val) {
          return !isNaN(val) ;      
      }
    }
]).then(function (val) {
    var chosenItem = parseInt(val.choice);
    var product = checkInventory(chosenItem, inventory);

    if (product) {

        customerQuestions2(product);
    }
    else {
        console.log("\nThat item is not in the inventory yet.");
        displayProducts();
      }
    });
  }
  function customerQuestions2(product) {
    inquirer.prompt([
      {
        name: "units",
        type: "input",
        message: "how many items of this product would you like to purchase?",
        validate: function(val) {
          return val > 0;
        }
      }
    ])
      .then(function (val) {
        var chosenQuanity = parseInt(val.units);

        if (chosenQuanity > product.quantity) {
            console.log("\nUh Oh! Not enough quantity!");
            displayProducts();
          }
          else {
            makePurchase(product, quantity);
        }
      });
  } 
  function makePurchase(product, quantity) {
    connection.query(
      "UPDATE products SET quantity = quantity - ? WHERE id = ?" [quantity,product],
      function(err, res) {
        // Let the user know the purchase was successful, re-run loadProducts
        console.log("Thank you for your money!  Want to buy something else?");
        displayProducts();
      }
    )
  }
  function checkInventory(chosenItem, inventory) {
    for (var i = 0; i < inventory.length; i++) {
      if (inventory[i].item_id === chosenItem) {
        return inventory[i];
    } else {
    console.log("Amount you want is more than what we have - try again");
    return null;
}
}
} 