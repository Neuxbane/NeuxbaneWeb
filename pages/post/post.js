const upload = ()=>{
	if (!document.getElementById('titlepost').value || !document.getElementById('imagepost').value || !document.getElementById('captionpost').value) {
		toast('warning','Failed to upload post\nPlease fill in all required input');
		return;
	}
	navigate('home');
}

return {upload}