import {getRelativeRoot} from "../assets/js/project_paths.js";

customElements.define(
    "project-card",
    class extends HTMLElement {
        constructor() {
            super();

            /* Custom HTML Attributes */
            let rootDir = getRelativeRoot();
            let btnHref = this.getAttribute('src');
            let btnText = this.getAttribute('btn-label');
            let cardTitle = this.getAttribute('title');

            fetch(`${rootDir}templates/project-card-template.html`)
                .then(async response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch');
                    }
                    return await response.text();
                })
                .then(htmlString => {
                    const parser = new DOMParser();
                    const dom = parser.parseFromString(htmlString, 'text/html');

                    let template = dom.getElementById("project-card-template");
                    if (!template) {
                        throw new Error('Template not found');
                    }
                    let templateContent = template.content;

                    const shadowRoot = this.attachShadow({mode: "open"});
                    shadowRoot.appendChild(templateContent.cloneNode(true));

                    // Set Card Button Attributes
                    let btn = shadowRoot.querySelector('#button');  // Get the Card Button
                    btn.href = btnHref;  // Set the HTMLElement href attribute
                    btn.textContent = btnText;  // Set the Button Label

                    // Set Card Title
                    let title = shadowRoot.querySelector('#title');
                    title.textContent = cardTitle;

                    // Add Site Style with Relative Path
                    let style = shadowRoot.querySelector('style');
                    style.innerText = `@import url('${rootDir}assets/css/site.css');`;

                })
                .catch(error => {
                    console.error('Error fetching or parsing base.html template:', error);
                });
        }
    },
);