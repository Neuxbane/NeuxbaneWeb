# How to run
using Python
```bash
python3 -m http.server 
```
or

using Nodejs `http-server`
```bash
http-server
```

before running the API service please re-configure the endpoint API in `script_after.js` at line 134;
```js
const APIendpoint = 'http://localhost:2024/'
```

Then, run the API by using:
```bash
# Go to the API Service directory
cd server

# run the API Service
node main.js
```

## Documentation

### To navigate
```
navigate("page")
```
### example of config.json
```json
{
	"name": "Register",
	"menu": [
		{"text":"Login", "path":"login"}
	],
	"transitionIn": "NameOfTransition",
	"transitionInDuration": "1s",
	"transitionOut": "NameOfTransition",
	"transitionOutDuration": "1s"
}
```
The name of transition is on the `transition.css`