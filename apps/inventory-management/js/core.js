function generateUID() {
    // Generate a part of the UID based on the current timestamp
    const timestamp = Date.now().toString(36);

    // Generate a random part of the UID
    const randomPart = Math.random().toString(36).substring(2, 15);

    // Combine the timestamp and random part to create the UID
    return timestamp + randomPart;
}


/*
* Example:
* let item = new InventoryItem(...);
* item.category;  // Output: "root.node.node.[...].leaf"
* */
export function createCategory(name, ...subcategories) {
    if (subcategories.length === 0) return name;
    return subcategories.reduce((accumulator, subcategory) => `${accumulator}.${subcategory}`, name)
}


export function InventoryItem(name, category, qty, price = null) {
    if (isNaN(qty) || qty === null || qty === undefined) {
        throw new Error(`The given quantity ${qty} is invalid.`);
    }

    if (price !== null) {
        if (typeof price !== 'number') throw new Error(`The given price ${price} is invalid.`);
    }

    this.uid = generateUID();

    this.name = name;
    this.category = category;
    this.quantity = qty;
    this.price = price;
}

/*
* In this mini application, the properties of data are:
* data.items = [<InventoryItem>, <InventoryItem>, ...]
* */
export function InventoryComponent(selector, options) {
    this.element = document.querySelector(selector);
    this.data = options.data;
    this.template = options.template;
}

/*
* Attach the render method to prototype
* */
InventoryComponent.prototype.render = function () {
    this.element.innerHTML = this.template(this.data);
};

/*
* Get the inventory data from local storage. Returns the data object or null.
* */
export const getInventoryData = () => {
    const dataStr = localStorage.getItem('app-inventory-data');
    return dataStr !== null ? JSON.parse(dataStr) : null;
};

/*
* Store the latest state of inventory data
* */
export const storeInventoryData = (currentData) => {
    localStorage.setItem('app-inventory-data', JSON.stringify(currentData));
};