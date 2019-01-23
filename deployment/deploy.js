const etherlime = require('etherlime');
const ToDo = require('../build/ToDoManager.json');

let pk = '0x7ab741b57e8d94dd7e1a29055646bafde7010f38a900f55bbd7647880faa6ee8'
const defaultConfigs = {
    gasPrice: 20000000000,
    gasLimit: 4700000
}

const deploy = async (network, secret) => {

	const deployer = new etherlime.JSONRPCPrivateKeyDeployer(pk, 'http://localhost:8545/', defaultConfigs);
	const contract = await deployer.deploy(ToDo);
	
};

module.exports = {
	deploy
};