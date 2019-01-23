const etherlime = require('etherlime');
const ToDoManager = require('../build/ToDoManager.json');
let toDoInstance;
async function getToDoIndex(_toDo) {
    let index = await toDoInstance.indexCounter();
    for(let i = 0; i < index.toNumber(); i++){
        let toDo = await toDoInstance.getToDoByIndex(i);
        if(toDo == _toDo){
          return i
        }
    }
}

describe('Example', () => {
    let aliceAccount = accounts[3];
    let deployer;

    let shoppingToDo = "go shopping";

    before(async () => {
        // const defaultConfigs = {
        //     gasPrice: 20000000000,
        //     gasLimit: 8000000,
        //     chainId: 0 // Suitable for deploying on private networks like Quorum
        // }
        
        deployer = new etherlime.EtherlimeGanacheDeployer(aliceAccount.secretKey);
        toDoInstance = await deployer.deploy(ToDoManager);

        await toDoInstance.addToDo(shoppingToDo)
    });

    it('should add new ToDo', async () => {
        let toDoStatus = await toDoInstance.getToDoStatus(shoppingToDo)
        assert.equal(toDoStatus, 1)
    })

    it('should revert if ToDo was already added', async () => {
        await assert.revert(toDoInstance.addToDo(shoppingToDo))
    })

    it('should assign ToDo', async () => {
        await toDoInstance.assignToDo(shoppingToDo);
        let assignedToDo = await toDoInstance.getAssignee(shoppingToDo);
        assert.equal(assignedToDo, aliceAccount.wallet.address)
    })

    it('should revert if ToDo was already assigned', async () => {
        await assert.revert(toDoInstance.assignToDo(shoppingToDo))
    })

    it('should revert if ToDo was not added to the list', async () => {
        await assert.revert(toDoInstance.assignToDo('buy lemonade'))
    })

    it('should change ToDo status', async () => {
        let index = await getToDoIndex(shoppingToDo)
        await toDoInstance.changeToDoStatus(index)
        let toDoStatus = await toDoInstance.getToDoStatus(shoppingToDo)
        assert.equal(toDoStatus, 2)
    });

    it('should revert if non assignee tries to change status', async () => {
        let bobsAccount = accounts[1];
        let index = await getToDoIndex(shoppingToDo)
        await assert.revert(toDoInstance.from(bobsAccount).changeToDoStatus(index))
    })

    it('should revert if ToDo has been already done', async () => {
        let index = await getToDoIndex(shoppingToDo)
        await toDoInstance.changeToDoStatus(index)
        await assert.revert(toDoInstance.changeToDoStatus(index))
    })


    it('should remove ToDo', async () => {
        let index = await getToDoIndex(shoppingToDo)
        await toDoInstance.removeToDo(index)
        let toDoStatus = await toDoInstance.getToDoStatus(shoppingToDo);
        assert.equal(toDoStatus, 0)
    })
});