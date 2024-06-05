const _tableItemTemplate = /*html*/`
<tr class="py-3" id="{{ itemId }}">
    <td class="py-3 border text-center  p-4" contenteditable="true">{{ itemName }}</td>
    <td class="py-3 border text-center  p-4" contenteditable="true">{{ itemCategory }}</td>
    <td class="py-3 border text-center  p-4" contenteditable="true">{{ itemQty }}</td>
    <td class="py-3 border text-center  p-4" contenteditable="true">{{ itemPrice }}</td>
    <td class="py-3 border text-center  p-4" contenteditable="false">
        <img class="ml-2 w-[15px] h-auto" src="https://cdn-icons-png.freepik.com/512/6861/6861362.png" alt="Delete">
    </td>
</tr>
`;

const _tableTemplate = /*html*/`
<div class="relative overflow-hidden shadow-md ">
    <table class="table-auto w-full text-left">
        <thead class="uppercase bg-[#a921ed] text-[#e5e7eb]" style="background-color: #a921ed; color: #e5e7eb;">
            <tr>
                <td class="py-2 border text-center font-bold p-4" contenteditable="false">Name</td>
                <td class="py-2 border text-center font-bold p-4" contenteditable="false">Category</td>
                <td class="py-2 border text-center font-bold p-4" contenteditable="false">Qty</td>
                <td class="py-2 border text-center font-bold p-4" contenteditable="false">Price</td>
                <td class="py-2 border text-center font-bold p-4" contenteditable="false"></td>
            </tr>
        </thead>
        <tbody class="bg-white text-gray-500 bg-[#FFFFFF] text-[#6b7280]" style="background-color: #FFFFFF; color: #6b7280;">
            {{ tableData }}
        </tbody>
    </table>
</div>
`;

export function tableTemplate(props) {
    // Note: `props` here is the data object with `data.items`.
    let html = _tableTemplate;
    let items = props.items;  // [<InventoryItem>, <InventoryItem>, ...]

    // ['itemHtml', 'itemHtml', ...]
    let htmlItems = items.map(function (item) {
        return _tableItemTemplate
            .replace('{{ itemId }}', item.uid)
            .replace('{{ itemName }}', item.name)
            .replace('{{ itemCategory }}', item.category)
            .replace('{{ itemQty }}', item.quantity)
            .replace('{{ itemPrice }}', item.price)
            ;
    }).join('');

    return html.replace('{{ tableData }}', htmlItems);
}