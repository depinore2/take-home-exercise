import { message, environmentName, backEndUrl as backendUrl } from './constants.js';
import { BaseWebComponent } from '../ts_modules/@depinore/wclibrary/BaseWebComponent.js'
import { default as routie } from '../node_modules/@prepair/routie/lib/index.js';

console.log(`Message from the world: ${message}  You are running the ${environmentName} build.`);

export class AppComponent extends BaseWebComponent
{
    router: any = null;
    constructor() {
        super(`
        h2 {
            color: red; 
        }
        `);
    }
    connectedCallback() {
        routie({
            '': () => this.render(`<depinore-it-works></depinore-it-works>`),
            '/view2/:myParameter': myParameter => this.render(`<depinore-step-2 data-value='${this.sanitize(myParameter)}'></depinore-step-2>`)
        })
    }   
    disconnectedCallback() {
        // Delete the element from DOM to see this get triggered.
        alert('The element got removed from the DOM.');
    }
}
customElements.define('depinore-app', AppComponent);


const defaultUserInput = 'nothing so far...';

customElements.define('depinore-it-works', class extends BaseWebComponent {
    userInput: string = '';

    constructor() {
        super(``,`
            <h1>If you see this, it works!</h1>
            <form>
                Try out this form:
                <input type='text' id='userInputText' placeholder='Type something here.'/>

                <p>You typed in: <span id='userInput'>${defaultUserInput}</span></p>

                <input type='submit' id='submit' value='Submit' />
            </form>
        `)
    }
    async connectedCallback() {
        if(this.shadowRoot) {
            this.configureUserInput(this.shadowRoot);
            this.configureSubmission(this.shadowRoot);

            console.log(`Testing CORS...`);

            var httpResult = await fetch(`${backendUrl}/api/values`, {
                method: 'POST',
                body: JSON.stringify("Hello world!"),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            console.log(await httpResult.text());
        }
    }
    private configureUserInput(shadowRoot: ShadowRoot) {
        const userInputText = shadowRoot.querySelector('#userInputText') as HTMLInputElement | null;
            
        if(userInputText) {
            userInputText.addEventListener('input', (event: any) => {
                this.userInput = event.target.value || defaultUserInput;
                this.render(this.sanitize(this.userInput), '#userInput');
            })
        }
        else
            throw new Error('User input control or span are missing.');
    }
    private configureSubmission(shadowRoot: ShadowRoot) {
        const form = shadowRoot.querySelector('form');

        if(form) {
            form.addEventListener('submit', e => {
                e.preventDefault();
                location.hash = `/view2/${this.sanitize(this.userInput)}`;
            });
        }
    }
})
customElements.define('depinore-step-2', class extends BaseWebComponent {
    constructor() {
        super('', `
            You submitted <span id='submittedValue'></span>.
            <a href='#'>&larr; Go back</a>
        `);
    }
    connectedCallback() {
        this.render(this.sanitize(this.getAttribute('data-value') || ''), '#submittedValue');
    }
})