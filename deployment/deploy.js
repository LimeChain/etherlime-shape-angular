const etherlime = require('etherlime');
const ToDo = require('../build/ToDo.json');

const deploy = async (network, secret) => {

	const deployer = new etherlime.EtherlimeGanacheDeployer();
	const contract = await deployer.deploy(ToDo);
	
};

module.exports = {
	deploy
};