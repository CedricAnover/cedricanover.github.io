/* UID Generator */
function generateUID() {
    // Generate a part of the UID based on the current timestamp
    const timestamp = Date.now().toString(36);

    // Generate a random part of the UID
    const randomPart = Math.random().toString(36).substring(2, 15);

    // Combine the timestamp and random part to create the UID
    return timestamp + randomPart;
}

/* Model Representing a Task */
export class Task {
    constructor(name, description = null, done = false) {
        this.uid = generateUID();
        this.name = name;
        this.description = description;
        this.done = done;
    }

    static fromJSON(json) {
        const {uid, name, description, done} = json;
        let newTask = new Task(name, description, done);
        newTask.uid = uid;
        return newTask;
    }
}
