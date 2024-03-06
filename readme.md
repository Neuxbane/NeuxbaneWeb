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