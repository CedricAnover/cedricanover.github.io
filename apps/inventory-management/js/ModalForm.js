import { getRelativeRoot } from "../../../assets/js/project_paths.js";

const _htmlTemplate = /*html*/`
<template id="modal-form-template">
<style>
.modal {
    display: none;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0,0,0);
    background-color: rgba(0,0,0,0.4);
    padding-top: 60px;
}

.modal-content {
    background-color: #fefefe;
    margin: 5% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
    max-width: 500px;
    border-radius: 10px;
}

.close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
}

.close:hover,
.close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
}
</style>

<button id="openModalBtn" class="{{ modalBtnStyle }}">{{ modalBtnLabel }}</button>

<div id="myModal" class="modal">
    <div class="modal-content">
        <span class="close">&times;</span>
        <h2 class="text-xl font-bold mb-5">
            {{ formTitle }}
        </h2>
        <form id="modalForm" class="flex flex-col gap-4">
            <label for="formName" class="font-semibold">Name:</label>
            <input class="text-base border border-gray-300 rounded-lg p-2" 
                type="text" id="formName" name="name" required>

            <label for="formCategory" class="font-semibold">Category:</label>
            <input class="text-base border border-gray-300 rounded-lg p-2" 
                type="text" id="formCategory" name="category">

            <label for="formQuantity" class="font-semibold">Qty:</label>
            <input class="text-base border border-gray-300 rounded-lg p-2" 
                type="number" min="0" id="formQuantity" name="qty" required>

            <label for="formPrice" class="font-semibold">Price:</label>
            <input class="text-base border border-gray-300 rounded-lg p-2" 
                type="text" id="formPrice" name="price">

            <button type="submit" class="cursor-pointer">{{ btnLabel }}</button>
        </form>
    </div>
</div>

</template>
`;

class ModalForm extends HTMLElement {
    constructor() {
        super();

        this.formTitle = this.getAttribute('form-title');
        this.modalBtnLabel = this.getAttribute('modal-btn-label');
        this.modalBtnStyle = this.getAttribute('modal-btn-style');
        this.btnLabel = this.getAttribute('btn-label');

        this.rootDir = getRelativeRoot();
    }

    connectedCallback() {
        let htmlTemplate =
            _htmlTemplate
                .replace('{{ modalBtnLabel }}', this.modalBtnLabel)
                .replace('{{ modalBtnStyle }}', this.modalBtnStyle !== null ? this.modalBtnStyle : '')
                .replace('{{ formTitle }}', this.formTitle)
                .replace('{{ btnLabel }}', this.btnLabel);

        const parser = new DOMParser();
        const dom = parser.parseFromString(htmlTemplate, 'text/html');
        let template = dom.querySelector("#modal-form-template");
        let templateContent = template.content;
        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.appendChild(templateContent.cloneNode(true));

        let style = shadowRoot.querySelector('style');
        style.innerText = `@import url('${this.rootDir}assets/css/site.css');` + '\n' + style.innerText;

        document.addEventListener('DOMContentLoaded', (event) => {
            const modal = shadowRoot.querySelector('#myModal');
            const btn = shadowRoot.querySelector('#openModalBtn');
            const span = shadowRoot.querySelector('.close');

            btn.onclick = () => {
                modal.style.display = 'block'
            };

            span.onclick = () => {
                modal.style.display = 'none'
            };

            window.onclick = (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            };

            shadowRoot.querySelector('#modalForm').onsubmit = () => {
                // event.preventDefault();
                try {
                    this.buttonCallback(this);
                } catch (err) {
                    alert(err);
                    console.error(err);
                } finally {
                    modal.style.display = 'none';
                }
            };
        });
    }

    buttonCallback(obj) {
        throw new Error('No implementation for buttonCallback()');
    }
}

customElements.define('modal-form', ModalForm);