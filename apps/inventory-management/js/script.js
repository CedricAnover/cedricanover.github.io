import {
    InventoryComponent,
    InventoryItem,
    createCategory,
    getInventoryData,
    storeInventoryData
} from "./core.js";

import {
    tableTemplate,
} from "./templates.js";

let data = getInventoryData();

// Initialize Sample Data
if (data === null) {
    data = {}
    data['items'] = [
        new InventoryItem('Item1', 'Category1', 3),
        new InventoryItem('Item2', 'Category 2', 5),
        new InventoryItem('Item3', 'Category 2', 2, 4)
    ]

    // Store the data object
    storeInventoryData(data);
}

let app = new InventoryComponent(
    '#app',
    {
        data: data,
        template: tableTemplate
    }
);

app.render();


// ========================================= Event Handlers

function addInventoryCallback(obj) {
    let shadowRoot = obj.shadowRoot;

    let name = shadowRoot.querySelector('[name="name"]').value;
    let category = shadowRoot.querySelector('[name="category"]').value;
    let qty = shadowRoot.querySelector('[name="qty"]').value;
    let price = shadowRoot.querySelector('[name="price"]').value;

    let newInventoryItem = new InventoryItem(
        name,
        category,
        parseFloat(qty),
        isNaN(price) || price === null ? null : parseFloat(price)
    );

    app.data.items.push(newInventoryItem);
    app.render();
    storeInventoryData(app.data)
}

function onUpdateInventoryBtnClicked(event) {
    let tbody = document.querySelector('tbody');

    Array.from(tbody.children).forEach(tr => {
        const itemId = tr.id;
        const [
            tdName,
            tdCategory,
            tdQty,
            tdPrice
        ] = tr.children;

        // Recreate the Inventory Item
        let recreatedItem = new InventoryItem(
            tdName.textContent,
            tdCategory.textContent,
            parseFloat(tdQty.textContent),
            tdPrice.textContent.trim() === '' ? null : parseFloat(tdPrice.textContent)
        );

        // (re-)Set the Inventory Item UID
        recreatedItem.uid = itemId

        // Get the item from app.data.items by the uid
        let idx = app.data.items.findIndex(x => x.uid === itemId);
        if (idx === -1) {
            console.warn(`Item ${itemId} does not exist in app.data.items`)
            return undefined
        }

        // Replace the old inventory item with (possibly) the new one
        app.data.items[idx] = recreatedItem
        app.render();
    });

    storeInventoryData(app.data);
}

function onItemDeleted(event) {
    if (event.target.matches('[alt="Delete"]')) {
        let obj = event.target;
        let tr = obj.parentElement.parentElement;
        let itemId = tr.id;

        console.info("Deleting Item with ID =", itemId);

        // Delete the inventory item from data.
        let idx = app.data.items.findIndex(elem => elem.uid === itemId)
        if (idx === -1) {
            console.warn(`Deleting non-existent inventory item (id=${itemId})`)
            return undefined;
        }

        app.data.items.splice(idx, 1);  // Remove inventory item using splice()

        // Store the latest state of data to local storage
        storeInventoryData(app.data);

        // Update the dom
        app.render();
    }
}

// ========================================= Event Listeners
document.addEventListener('DOMContentLoaded', function (event) {
    let addModalForm = document.querySelector('[btn-label="Add"]');
    addModalForm.buttonCallback = addInventoryCallback;
});

document.querySelector('#btn-update-item').addEventListener('click', onUpdateInventoryBtnClicked);

document.addEventListener('click', onItemDeleted);