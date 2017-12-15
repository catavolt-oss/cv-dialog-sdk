
import {PersistentClient} from "./persistence";

console.log('I loaded');

self.addEventListener('install', function(event) {

        // Perform install steps
        const client:PersistentClient = new PersistentClient();
        console.log("I installed.  Time to service, etc.....")
});

