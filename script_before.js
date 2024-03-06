console.log("before")

document.addEventListener('mousemove', function(e) {
	document.documentElement.style.setProperty('--pointer-x', e.clientX + 'px');
	document.documentElement.style.setProperty('--pointer-y', e.clientY + 'px');
});