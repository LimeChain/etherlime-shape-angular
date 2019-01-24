# etherlime-shape-angular
This project presents ready to use dApp with predefined Angular front-end framework and Etherlime integration.
The provided boilerplate code contains all modules and settings needed to facilitate its usage - basic AG modules, a simple Solidity smart contract and scripts for deployment on the Blockchain.
It gives a helpful code scaffolding for further etherlime project's development and shows examples how to read and record a data to the Blockchain through the browser.
The dApp represents a smart contract that manages a ToDo List and enables interaction with each ToDo's status. It uses a local ganache and web3Provider to sign transactions with MetaMask 


# Let's start
First you need to build a local ganache and to deploy ToDoManager.sol smart contract.
```
    etherlime ganache
    etherlime deploy
```
When your deployment is finished successfully copy the address of the contract that is shown on the console and assign its value to `contractAddress` variable declared in `web/src/app/app.component.ts` file. Now we are ready to run the dApp.

```
    cd web
    ng serve --open
```
If everything goes well now MyToDo dApp is welcoming you!

# Metamask connection
Get Metamask extension to your browser or if you currently have just log in. To use local ganache's accounts you need to import them (or a few ot them) by coping their private keys. Then connect Metamask to the private network - Localhost 8545. And we are ready to fill up our ToDo list.


# Smart contract interaction
After adding a new ToDo it automatically goes in the list bellow.
To change its status first you need to assign to this ToDo. This is the moment when Metamask (if using) ask you to confirm transaction and the ToDo will be assigned to the current account. Then you can change its status to the next level.
:point_up: (If using Metamask) It won't let you change the status from another account that has not been assigned to this ToDo.

# Run tests
MyToDo dApp includes tests. To test the smart contract run `etherlime test`.
