const express = require('express');
const https = require('https');
const http = require('http');
const cors = require('cors');
const app = express();

const fs = require('fs');

if (!fs.existsSync('storage.json')) {
    fs.writeFileSync('storage.json', JSON.stringify({
        "auth": {},
        "bucket": {}
    }));
}

const options = {
	key: fs.readFileSync('private-key.pem'),
	cert: fs.readFileSync('ssl-certificate.pem')
};

const loadVariables = ()=>JSON.parse(fs.readFileSync('storage.json').toString());
const saveVariables = (auth, bucket)=>{
	console.log(auth, bucket)
	fs.writeFileSync('storage.json', JSON.stringify({
		auth,
		bucket
	}, null, 4));
};
const checkParameters = (req, parameters) => {
	for (const param of parameters) {
		if (!req.query[param]) {
			return {
				success: false,
				message: `Parameter ${param} is missing`
			};
		}
	} return {
		success: true,
		data: Object.fromEntries(parameters.map(param => [param, req.query[param]]))
	};
};

const request = {};

app.use(cors({
    origin: '*'
}));

app.use((req,res, next)=>{
	const ip = req.ip;
	if(!request[ip]) request[ip] = 0;
	console.log(ip)
	request[ip] += 1;
	setTimeout(() => {
		request[ip] -= 1;
	}, 1000);
	if(request[ip] > 1) {
		res.status(429).json({success: false, message: 'Request blocked due to high request activity' });
		return;
	}
	else next();
})

app.get('/neuxbane-the-cute-dolphin/hug-me', (req, res) => { //  Login
	const {auth, bucket} = loadVariables();
	let data = checkParameters(req, ['zl','ke']); // zl = email, ke = password
	if(!data.success) return res.json(data); data = data.data;
	// console.log(auth[data.zl].password, data.ke, auth[data.zl].password == data.ke)
	if(auth[data.zl]) if(auth[data.zl].password == data.ke) return res.json({ success: true, message: 'success', data: auth[data.zl].detail});
	return res.json({ success: false, message: 'invalid credentials' });
});

app.get('/neuxbane-the-cute-dolphin/hold-me', (req, res) => { // Sign in
	const {auth, bucket} = loadVariables();
	let data = checkParameters(req, ['mc','qw','le']); // mc = email, qw = password, le = detail
	if(!data.success) return res.json(data); data = data.data;
	if(auth[data.mc]) return res.json({ success: false, message: 'This E-mail already in use' });
	auth[data.mc] = {};
	auth[data.mc].password = data.qw;
	auth[data.mc].detail = JSON.parse(data.le);
	saveVariables(auth, bucket);
	return res.json({ success: true, message: 'success' });
});

app.get('/neuxbane-the-cute-dolphin/kisses-you', (req, res) => { // set bucket data
	const {auth, bucket} = loadVariables();
	let data = checkParameters(req,['qy','aw','ls','yz']); // qy = password, aw = email, ls = key, yz = value
	if(!data.success) return res.json(data); data = data.data;
	if(!auth[data.aw]) return res.json({ success: false, message: 'failed' });
	if(auth[data.aw].password != data.qy) return res.json({ success: false, message: 'failed' });
	if(bucket[data.aw] == undefined) bucket[data.aw] = {};
	bucket[data.aw][data.ls] = { data:data.yz, private: true};
	saveVariables(auth, bucket);
	return res.json({ success: true, message: 'success' });
});


app.get('/neuxbane-the-cute-dolphin/claping-hands', (req, res) => { // get bucket data
	const {auth, bucket} = loadVariables();
	let data = checkParameters(req, ['ux','wm','ze']); // ux = email, wm = password, ze = key
	if(!data.success) return res.json(data); data = data.data;
	if(!auth[data.ux]) return res.json({ success: false, message: 'failed' });
	if(auth[data.ux].password != data.wm) return res.json({ success: false, message: 'failed' });
	return res.json({ success: true, message: 'success', data: bucket[data.ze] });
});


app.use((err, req, res, next) => {
	console.error(err);
	return res.status(500).json({ success: false, message: 'There was an error when processing your request!' });
});

const server = http.createServer(options, app);

// Start server
const PORT = 2024;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});