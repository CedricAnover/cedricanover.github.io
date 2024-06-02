/* Task Item View Template */
const taskItemView = `
<li class="flex items-center mb-2">
<input id="{{taskId}}" type="checkbox" name="done" value="{{taskId}}" {{inputChecked}}>
<p class="ml-2">{{taskName}}{{taskDescription}}</p>
<img class="ml-2 w-[15px] h-auto" src="https://cdn-icons-png.freepik.com/512/6861/6861362.png" alt="Delete">
</li>
`;

/* Task Collection View Template */
const taskCollectionView = `
<ul id="task-collection" 
    class="list-none list-inside p-4 rounded">
    {{taskList}}
</ul>
`;

/* Task Collection HTML Renderer */
let taskCollectionRenderer = function (tasks) {
    // <li>...</li><li>...</li><li>...</li>
    let taskListHtml = tasks.map(function (task) {
        return taskItemView
            .replaceAll(`{{taskId}}`, task.uid)
            .replace('{{taskName}}', task.name)
            .replace('{{inputChecked}}', task.done ? 'checked' : '')
            .replace('{{taskDescription}}', task.description === null || task.description.trim() === '' ? '' : ` - ${task.description}`);
    }).join('');

    let tempHTML = taskCollectionView.replace('{{taskList}}', taskListHtml);

    // If checked, add strike-through
    const parser = new DOMParser();  // Create a new DOMParser
    const doc = parser.parseFromString(tempHTML, 'text/html');  // Parse the HTML string
    const taskListElem = doc.body;

    taskListElem.querySelectorAll('li').forEach(li => {
        let input = li.querySelector('input');
        if (input.checked) {
            // Add the paragraph inside strikethrough <s>
            let p = li.querySelector('p');  // Paragraph element inside the list item
            let s = document.createElement('s');  // Create strikethrough element
            s.className = p.className;  // Pass the tailwind class
            p.className = '';
            s.innerHTML = p.outerHTML;
            p.replaceWith(s);
        }
    });

    return taskListElem.innerHTML;
}


export {
    taskCollectionRenderer
};