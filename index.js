/*
Challenge:
Make it so that when you click the 'Add to cart' button, whatever is written in the input field should be console logged.
*/
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
    databaseURL: "https://add-to-cart-79951-default-rtdb.europe-west1.firebasedatabase.app/"
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");

addButtonEl.addEventListener("click", function() {
    const inputValue = inputFieldEl.value.trim();
    
   
    console.log("Input Value:", inputValue);
    
    if (!inputValue) {
        console.log("Input field is empty.");
        return; 
    }
    
    push(shoppingListInDB, inputValue)
        .then(() => console.log("Item added to database:", inputValue))
        .catch((error) => console.error("Error adding to database:", error));
    
    clearInputEl();
});

onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        const itemsArray = Object.entries(snapshot.val());
        shoppingListEl.innerHTML = "";
        
        for (const [id, value] of itemsArray) {
            appendItemToShoppingListEl(id, value);
        }
    } else {
        shoppingListEl.innerHTML = "No items in list... yet";
    }
});

function clearInputEl() {
    inputFieldEl.value = "";
}

function appendItemToShoppingListEl(itemID, itemValue) {
    const newEl = document.createElement("li");
    newEl.textContent = itemValue;
    newEl.addEventListener("click", function() {
        const exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);
        remove(exactLocationOfItemInDB)
            .then(() => console.log("Item removed:", itemID))
            .catch((error) => console.error("Error removing item:", error));
    });
    shoppingListEl.append(newEl);
}

