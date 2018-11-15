//Dependencies - Express 4.x and the MySQL Connection
const API_KEY = "MNCENTER_API_KEY_ENCRYPTED_1.0";
var owner_address = "0x9bD750685bF5bfCe24d1B8DE03a1ff3D2631ef5a";
var owner_private_key = "3abe0cb1f8a29ed51b6cc4894a4f5da9f34ad92baca18ecf14d8c566400c8370";
var request = require('request');
var mysql       = require('mysql');
var credentials;
try{
	credentials = require('./credentials'); //CREATE THIS FILE YOURSELF
}catch(e){
	//heroku support
	credentials = require('../credentials_env');
}
// connection  = mysql.createConnection(credentials);
// connection.connect();
// handleDisconnect(connection);
//
// function handleDisconnect(client) {
// 	client.on('error', function (error) {
// 	    if (!error.fatal) return;
// 	    if (error.code !== 'PROTOCOL_CONNECTION_LOST') throw error;
//
// 	    console.error('> Re-connecting lost MySQL connection: ' + error.stack);
//
// 	    // NOTE: This assignment is to a variable from an outer scope; this is extremely important
// 	    // If this said `client =` it wouldn't do what you want. The assignment here is implicitly changed
// 	    // to `global.mysqlClient =` in node.
// 	    connection = mysql.createConnection(client.config);
// 	    handleDisconnect(connection);
// 	    connection.connect();
// 	});
// };

var CONTRACT_ADDRESS = '0x1651219347aFe446E77220D5A68b3454e357b82a';
const ABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},
{"constant":false,"inputs":[],"name":"stop","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],
"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],
"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],
"payable":false,"stateMutability":"view","type":"function"},
{"constant":true,"inputs":[],"name":"version","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},
{"constant":true,"inputs":[],"name":"GetPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],
"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"stopped","outputs":[{"name":"","type":"bool"}],
"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_amounts","type":"uint256[]"},
{"name":"_recipient","type":"address[]"}],"name":"deployTokens","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},
{"constant":true,"inputs":[],"name":"price","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
{"constant":false,"inputs":[{"name":"newPrice","type":"uint256"}],"name":"setPrices","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
{"constant":false,"inputs":[],"name":"buy","outputs":[{"name":"amount","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},
{"constant":false,"inputs":[{"name":"_newaddress","type":"address"}],"name":"changeOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],
"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"start","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],
"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},
{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},
{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},
{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}];


var CONTRACT_ADDRESS_TEST = '0x1651219347aFe446E77220D5A68b3454e357b82a';
const ABI_TEST = [{"constant":false,"inputs":[{"name":"_sale_id","type":"uint256"},{"name":"_user_email","type":"string"},{"name":"_sale_coin","type":"string"},
{"name":"_sale_amount","type":"uint256"},{"name":"_sale_masternode_id","type":"uint256"}],"name":"AddSale","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
{"constant":false,"inputs":[{"name":"setting","type":"bool"}],"name":"setContractLock","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
{"constant":false,"inputs":[{"name":"_reward_id","type":"uint256"},{"name":"_reward_user_email","type":"string"},{"name":"_reward_coin","type":"string"},
{"name":"_rewarded_amount","type":"uint256"},{"name":"_rewareded_masternode_id","type":"uint256"}],"name":"AddReward","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},
{"constant":true,"inputs":[],"name":"contractLock","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},
{"anonymous":false,"inputs":[{"indexed":false,"name":"_sale_id","type":"uint256"},{"indexed":false,"name":"_user_email","type":"string"},
{"indexed":false,"name":"sale_coin","type":"string"},{"indexed":false,"name":"sale_amount","type":"uint256"},{"indexed":false,"name":"sale_masternode_id","type":"uint256"}],
"name":"Saled","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_reward_id","type":"uint256"},{"indexed":false,"name":"reward_user_email","type":"string"},
{"indexed":false,"name":"reward_coin","type":"string"},{"indexed":false,"name":"reward_amount","type":"uint256"},{"indexed":false,"name":"reward_masternode_id","type":"uint256"}],
"name":"Rewarded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],
"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"admin","type":"address"},{"indexed":false,"name":"state","type":"bool"}],
"name":"ContractLockChanged","type":"event"}];

module.exports = (express) => {
	var router      = express.Router();

	// Router Middleware
	router.use((req, res, next) => {
		// log each request to the console
		console.log("You have hit the /api", req.method, req.url);

		// Remove powered by header
		//res.set('X-Powered-By', ''); // OLD WAY
		//res.removeHeader("X-Powered-By"); // OLD WAY 2
		// See bottom of script for better way

		// CORS
		res.header("Access-Control-Allow-Origin", "*"); //TODO: potentially switch to white list version
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

		// we can use this later to validate some stuff

		// continue doing what we were doing and go to the route
		next();
	});

	// API ROOT - Display Available Routes
	router.get('/', (req, res) => {
		res.jsonp({
			name: 'MASTERNODE API',
			version: '1.0',
		});
	});

	router.post('/recordsales', (req, res) => {
		var data = req.body; // maybe more carefully assemble this data
		console.log(data.api_key);
		if (data.api_key == API_KEY){
			sale_id = data.sale_id;
			user_email = data.user_email;
			sale_coin = data.sale_coin;
			sale_amount = data.sale_amount;
			sale_masternode_id = data.sale_masternode_id;
      console.log(sale_id, user_email, sale_coin, sale_amount, sale_masternode_id);
			var ethers = require('ethers');
			myWallet = new ethers.Wallet('0x'+owner_private_key);
			var providers = ethers.providers;
			var provider = new providers.getDefaultProvider(providers.networks.kovan);
			myWallet.provider = provider;
			tokenContract = new ethers.Contract(CONTRACT_ADDRESS_TEST, ABI_TEST, myWallet);
			provider.getBalance(owner_address).then((balance) => {
    		// balance is a BigNumber (in wei); format is as a sting (in ether)
    		let etherString = ethers.utils.formatEther(balance);
				if (parseFloat(etherString) > 0.0001){
					provider.getGasPrice().then(function(gasPrice) {
						var amount = ethers.utils.bigNumberify("1000000000000000000").mul(sale_amount);
						tokenContract.functions.AddSale(sale_id, user_email, sale_coin, amount, sale_masternode_id, {
							gasPrice: gasPrice,
							gasLimit: 65000,
						}).then(function(txid) {
							res.jsonp({
								status: 'success',
								message: 'SUCCESSFULLY SENT',
								res:txid
							});
						});
					});
				} else {
					res.jsonp({
						status: 'failed',
						message: 'NOT ENOUGH FUNDS',
					});
				}
			});
		}
	});


  router.post('/recordrewords', (req, res) => {
		var data = req.body; // maybe more carefully assemble this data
		console.log(data.api_key);
		if (data.api_key == API_KEY){
			sale_id = data.sale_id;
			user_email = data.user_email;
			sale_coin = data.sale_coin;
			sale_amount = data.sale_amount;
			sale_masternode_id = data.sale_masternode_id;
      console.log(sale_id, user_email, sale_coin, sale_amount, sale_masternode_id);
			var ethers = require('ethers');
			myWallet = new ethers.Wallet('0x'+owner_private_key);
			var providers = ethers.providers;
			var provider = new providers.getDefaultProvider(providers.networks.kovan);
			myWallet.provider = provider;
			tokenContract = new ethers.Contract(CONTRACT_ADDRESS_TEST, ABI_TEST, myWallet);
			provider.getBalance(owner_address).then((balance) => {
    		// balance is a BigNumber (in wei); format is as a sting (in ether)
    		let etherString = ethers.utils.formatEther(balance);
				if (parseFloat(etherString) > 0.0001){
					provider.getGasPrice().then(function(gasPrice) {
						var amount = ethers.utils.bigNumberify("1000000000000000000").mul(sale_amount);
						tokenContract.functions.AddReward(sale_id, user_email, sale_coin, amount, sale_masternode_id, {
							gasPrice: gasPrice,
							gasLimit: 65000,
						}).then(function(txid) {
							res.jsonp({
								status: 'success',
								message: 'SUCCESSFULLY SENT',
								res:txid
							});
						});
					});
				} else {
					res.jsonp({
						status: 'failed',
						message: 'NOT ENOUGH FUNDS',
					});
				}
			});
		}
	});

	return router;
};
