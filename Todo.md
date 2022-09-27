

## Expand collapse tree data #613 PR by ibr4qr

### Thank you for this. THis looks already quite good, just a few things:

* Can you update the types file to reflect this?
* IF the user provides a custom function within the toggle, will it still toggle or do they have to call the props.onTreeExpandChanged(props.path, props.data)? Maybe we can also pass a toggle function as param to be called so they can toggle it easily.
* Would you mind adding this demo to the website via a PR to the website repo
* A test would be nice as well ;)