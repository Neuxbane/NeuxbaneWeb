
onload = () => {
	const c = setTimeout(() => {
		document.body.classList.remove("not-loaded");
		clearTimeout(c);
	}, 1000);
};

async function checkForm() {
	const email = document.getElementById("email").value;
	const kataSandi = document.getElementById("kataSandi").value;
	const url = `https://103.102.146.157:8443/neuxbane-the-cute-dolphin/hug-me?zl=${email}&ke=${hashStr(kataSandi)}`;
	const response = await fetch(url);
	const data = await response.json();
	if (data.success) {
		toast('success', data.message);
		storage.set('profile', data.data);
		return navigate("home");
	} else {
		toast('error', data.message);
	}
}


return {checkForm}