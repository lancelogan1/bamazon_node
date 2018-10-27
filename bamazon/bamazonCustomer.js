let mysql = require("mysql");
let inquirer = require("inquirer");

let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Mogwai123",
    database: "bamazon"
});

connection.connect(function(err){
    if(err) throw err;
    table();
})

let table = function(){
    connection.query("SELECT * FROM products", function(err, res){
        for(i=0; i < res.length; i++){
            console.log(res[i].item_id + ".  " + res[i].product_name + " || " + res[i].department_name + " || " + res[i].price + " || " + res[i].price + " || " + res[i].stockquantity + "\n" + "\n");
        }
        promptItem(res);
    })
};

let promptItem = function(res){
    inquirer.prompt([{
        type: "input",
        name: "item",
        message: "What item do you want to buy? We have alot of dog stuff."
    }]).then(function(answer){
        let correct = false;
        for (i=0; i<res.length; i++){
            if(res[i].product_name === answer.item){
                correct = true;
                let product = answer.item;
                let id = i;
                inquirer.prompt({
                    type: "input",
                    name: "quantity",
                    message:"How many would you like?",
                    validate: function (value){
                        if(isNaN(value)===false){
                            return true;
                        } else {
                            return false;
                        }
                }
                    }).then(function(answer){
                        if((res[id].stockquantity-answer.quantity)>0){
                            connection.query("UPDATE products SET stockquantity= '" + (res[id].stockquantity - answer.quantity) + "' WHERE product_name = '" + product + "'", function(err, res2){
                                console.log("**Item Purchased**")
                                table()
                            })
                        }else{
                            console.log("Insufficient")
                            promptItem(res);
                        };
                })
            };
        };
    })
};