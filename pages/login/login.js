
onload = () => {
	const c = setTimeout(() => {
		document.body.classList.remove("not-loaded");
		clearTimeout(c);
	}, 1000);
};

async function checkForm() {
	const email = document.getElementById("email").value;
	const kataSandi = document.getElementById("kataSandi").value;
	const data = await API.login(email, kataSandi);
	if (data.success) {
		toast('success', data.message);
		storage.set('profile', data.data);
		return navigate("home");
	} else {
		toast('error', data.message);
	}
}


return {checkForm}