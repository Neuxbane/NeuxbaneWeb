console.log("after")
let global = {};
let prevObj = {};

const loadIcons = ()=>{
	// Load all icons and replace <nx-icon> with svg
	const iconElements = document.getElementsByClassName("nx-icon");
	for (const element of iconElements) {
		let iconSvg = new XMLHttpRequest();
		iconSvg.open("GET", `./assets/icons/${element.innerHTML}.svg`, true);
		iconSvg.onload = function () {
			const parser = new DOMParser();
			const doc = parser.parseFromString(iconSvg.responseText, "image/svg+xml");
			const svgElement = doc.getElementsByTagName("svg")[0];
			if (svgElement) {
				if(element.attributes.style) svgElement.setAttribute('style', element.attributes.style.nodeValue);
				element.parentNode.replaceChild(svgElement, element);
			}
		};
		iconSvg.send();
	}
};

function parseTime(timeString) {
    if (timeString.includes('ms')) {
        return parseFloat(timeString);
    } else if (timeString.includes('s')) {
        return parseFloat(timeString) * 1000;
    }
}


const hashStr = (str, length=32)=>{
	let n=0; let res=""; const char = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	for(let c of str.split('').map(x=>x.charCodeAt(0))) n = Math.sin(c * (n-1)*(n+1))*c;
	for(let i=1;i<=length;i++) {
		n = Math.sin(i * (n-1)*(n+1))*i; let p = n*n;
		res += char[Math.round(p*100)%char.length];
	} return res;
}



const delay = (ms)=>new Promise(resolve => setTimeout(resolve, ms));
const toastData = {};
function toast(type, text, choices=[]) {
	if(!['info', 'success', 'warning', 'error'].includes(type)) throw new Error('type must be one of: info, success, warning, error');
	let id = `toast-${Math.random().toString(36).substr(2, 9)}`
	let fn = (c)=>JSON.stringify(`(${String(c.clicked)})('${c.value??c.text}');delete toastData['${id}']; reloadToast();`);
	const template = `
	<label>
		<div class="alert ${type}" style="position: relative;">
			<button onclick="delete toastData['${id}']; reloadToast();" style="height: 2em; width: 2em; position: absolute; padding: 0; top: -1; right: -1; border-radius: 0 5px;" class="form-field ${type}">X</button>
			<span class="alertText">${text}<br /></span>
			<div style="display: flex; margin-bottom: -1.5rem;">
			${choices.map(c => `<button class="form-field" onclick=${fn(c)}>${c.text}</button>`).join('<div style="width: 2rem;"></div>')}
			</div>
			<br class="clear"/>
		</div>
	</label>
	`;
	toastData[id] = template;
	document.getElementById('notification').innerHTML = Object.values(toastData).join('');
	loadIcons();
}

const storage = {
	get: (key)=> {
		return JSON.parse(localStorage.getItem(key)??"null");
	},
	set: (key, value) => {
		localStorage.setItem(key, JSON.stringify(value));
	},
}

const reloadToast = ()=>{document.getElementById('notification').innerHTML = Object.values(toastData).join('');};
async function navigate(pageName) {
	storage.set('lastPage', pageName);
	const html = (await(await fetch(`pages/${pageName}/${pageName}.html`)).text())
	const css = (await(await fetch(`pages/${pageName}/${pageName}.css`)).text())
	const config = (await(await fetch(`pages/${pageName}/config.json`)).text())
	const javascript = (await(await fetch(`pages/${pageName}/${pageName}.js`)).text())
	const data = JSON.parse(config);
	document.getElementById('pageName').innerText = data.name;
	const menu = document.getElementById('menus');
	menu.innerHTML = "";
	for(let x of data.menu){
		let icon = "";
		if(x.icon) icon = (await(await fetch(`./assets/icons/${x.icon}.svg`)).text())
		menu.innerHTML += `<div class='menu glowhover' style="cursor: pointer; display: flex;" onclick="navigate('${x.path}')">
			<div style="filter: invert(71%) sepia(8%) saturate(1730%) hue-rotate(201deg) brightness(98%) contrast(90%); width: 25px; height: 25px; margin-right: -0.5rem;"">${icon}</div>
			<p style="margin: auto .5rem">${x.text}</p>
		</div>`
	}
	
	document.getElementById('css').innerHTML = css;
	document.getElementById('content').innerHTML = html;
	document.getElementById('cssTransition').innerHTML = prevObj.css;
	document.getElementById('contentTransition').innerHTML = prevObj.html;

	const time = prevObj?.data?.transitionOutDuration ?? data?.transitionOutDuration ?? "1s";

	if(prevObj.data == undefined) prevObj = { data:{}, html:"", css:"", javascript:""};
	if (prevObj?.data?.transitionOutDuration == undefined) {
		prevObj.data.transitionOutDuration = "1s";
	}
	if (prevObj?.data?.transitionOut != undefined) {
		document.getElementById('contentTransition').style.animation = `${prevObj.data.transitionOut} ${prevObj.data.transitionOutDuration}`;
	} else {
		document.getElementById('contentTransition').style.animation = "";
	}

	if (data.transitionInDuration == undefined) {
		data.transitionInDuration = "1s";
	}
	if (data?.transitionIn != undefined) {
		// Apply transition on the next content element
		document.getElementById('content').style.animation = `${data.transitionIn} ${data.transitionInDuration}`;
	} else {
		document.getElementById('content').style.animation = "";
	}
	
	
	setTimeout(()=>{
		document.getElementById('cssTransition').innerHTML = "";
		document.getElementById('contentTransition').innerHTML = "";
		global = Function(javascript)();
		loadIcons();
	},parseTime(time))
	console.log(data, prevObj.data);
	prevObj = { data, html, css, javascript };
}

const APIendpoint = 'http://103.102.146.157:2024/'

const API = {
	login: async(email, password)=>{
		return (await fetch(`${APIendpoint}neuxbane-the-cute-dolphin/hug-me?${new URLSearchParams({zl:email,ke:hashStr(password)})}`)).json()
	},
	register: async(email, password, detail)=>{
		const url = APIendpoint+'neuxbane-the-cute-dolphin/hold-me?' + new URLSearchParams({mc:email, qw:password, le: detail})
		return (await fetch(url)).json()
	}
}

// Initially load the home page
navigate(storage.get('lastPage')??'intro')
// toast('info', 'test', [
// 	{ clicked: (val)=>{console.log(val)}, text:"yes"},
// 	{ clicked: (val)=>{console.log(val)}, text:"no"}
// ]);
loadIcons();