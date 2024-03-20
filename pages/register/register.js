
onload = () => {
	const c = setTimeout(() => {
		document.body.classList.remove("not-loaded");
		clearTimeout(c);
	}, 1000);
};

const convertBase64 = (file) => {
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader();
		fileReader.readAsDataURL(file);

		fileReader.onload = () => {
			resolve(fileReader.result);
		};

		fileReader.onerror = (error) => {
			reject(error);
		};
	});
};


async function checkForm() {
	const namaDepan = document.getElementById("namaDepan");
	const namaBelakang = document.getElementById("namaBelakang");
	const email = document.getElementById("email");
	const tanggalLahir = document.getElementById("tanggalLahir");
	const laki = document.getElementById("laki");
	const perempuan = document.getElementById("perempuan");
	const alamat = document.getElementById("alamat");
	const foto = document.getElementById("foto");
	const telepon = document.getElementById("telepon");
	const kataSandi = document.getElementById("kataSandi");
	const konfirmasiKataSandi = document.getElementById("konfirmasiKataSandi");

	if (namaDepan.value.length < 3) {
		toast('error',"Nama Depan minimal 3 karakter");
		return;
	}
	if (namaBelakang.value.length < 3) {
		toast('error',"Nama Belakang minimal 3 karakter");
		return;
	}
	if (!email.value.match(
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	)) {
		toast('error',"Format email salah");
		return;
	}
	if (!tanggalLahir.value.match(/^\d{4}-\d{2}-\d{2}$/)) {
		toast('error',"Format tanggal lahir salah");
		return;
	}
	if (!laki.checked && !perempuan.checked) {
		toast('error',"Jenis kelamin belum dipilih");
		return;
	}
	if (!alamat.value) {
		toast('error',"Alamat belum diisi");
		return;
	}
	if (!foto.files.length) {
		toast('error',"Foto profil belum diupload");
		return;
	}
	if (!telepon.value.match(/^[0-9]{12}$/)) {
		toast('error',"Format nomor telepon salah");
		return;
	}
	if (kataSandi.value.length < 8) {
		toast('error',"Kata sandi minimal 8 karakter");
		return;
	}
	if (kataSandi.value !== konfirmasiKataSandi.value) {
		toast('error',"Konfirmasi kata sandi tidak sama");
		return;
	}
	const fotoBase64 = await convertBase64(foto.files[0])
	console.log("OK")
	const response = await API.register(email.value, hashStr(kataSandi.value), JSON.stringify({
		namaDepan: namaDepan.value,
		namaBelakang: namaBelakang.value,
		tanggalLahir: tanggalLahir.value,
		gender: laki.checked ? "L" : "P",
		alamat: alamat.value,
		telepon: telepon.value,
		// foto: fotoBase64
	}))
	if (response.success) {
		toast('success',"Registrasi berhasil")
		return navigate('login')
	} else {
		toast('error',response.message)
	}
}

return { checkForm }