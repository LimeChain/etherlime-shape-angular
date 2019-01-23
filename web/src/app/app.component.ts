declare let require: any;
declare var web3: any;
declare let window: any;
import { Component } from '@angular/core';
const etherlime = require('etherlime');
const ethers = require('ethers');
const ToDo = require('../../../build/ToDoManager.json');
// const Web3 = require('web3');


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  title = 'My Decentralized App';

  public state: string;
  public successMessage: string;
  public infoMessage: string;
  public errorMessage: string;
  public contractInstance: any;
  public networkProvider: any;
  private blockChainNetwork = 'http://localhost:8545';
  public wallet: any;
  public pk = '0x7ab741b57e8d94dd7e1a29055646bafde7010f38a900f55bbd7647880faa6ee8';
  public contractAddress = '0xaa803cEA17746d29493a6a44E203376479023D2F';
  public connectedContract: any;
  public toDoStatus: any;
  public inProgressStatus: any;
  public doneStatus: any;
  public inactiveButton;

  constructor() {
    console.log('HERE CONSTRUCTOR');
    this.toDoStatus = [];
    this.inProgressStatus = [];
    this.doneStatus = [];

    etherlime.ContractAt(ToDo, this.contractAddress).then((result) => {
      this.contractInstance = result;
      this.successMessage = 'The contract has been set and is ready to interact with it!';
      this.getToDoStatuses();
    }).catch((e) => {
      this.errorMessage = e.message;
    });

  }

  private async getToDoIndex(_toDo) {
    const indexCounter = await this.contractInstance.indexCounter();
    for (let i = 0; i < indexCounter.toNumber(); i++) {
      let toDo = await this.contractInstance.getToDoByIndex(i);
      if (toDo === _toDo) {
        return i
      }
    }
  }

  private async getSignerInstance() {
    const provider = new ethers.providers.Web3Provider(web3.currentProvider);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(this.contractAddress, ToDo.abi, provider)
    const instance = await contract.connect(signer);
    return instance;
  }

  // public async setContract() {
  //   try {
  //     this.contractInstance = await etherlime.ContractAt(ToDo, this.contractAddress)
  //     this.infoMessage = "The contract has been set and is ready to interact with it!"
  //   } catch (e) {
  //     this.infoMessage = e.message
  //   }
  // }

  public async addToDo(todo) {
    try {
      this.inactiveButton = true;
      await this.contractInstance.addToDo(todo.value);
      this.addInfoMessage('ToDo has been added!');
      this.toDoStatus.push(todo.value);
      this.inactiveButton = false;
    } catch (e) {
      this.addInfoMessage(`Transaction failed. Are you sure you hadn't already added this ToDo! ${e.message}`);
      this.inactiveButton = false;
    }
  }

  public async assignToDo(assignedTodo) {
    try {
      const instance = await this.getSignerInstance();
      await instance.assignToDo(assignedTodo);
      this.addInfoMessage('ToDo was assigned to you!')
    } catch (e) {
      this.addInfoMessage(`${e.message}. You can not assign to a ToDo if it is not added the list first!`)
    }
  }

  public async changeToDoStatus(todo, destination) {
    try {
      const instance = await this.getSignerInstance();
      const index = await this.getToDoIndex(todo);
      await instance.changeToDoStatus(index);

      this.changeCurrentStatus(todo, destination);
      this.addInfoMessage('Status has been changed!');
    } catch (e) {
      this.addInfoMessage(`You can not change ToDo's status if it is not assigned to you! ${e.message}`);
    }
  }

  public async removeToDo(todo, destination) {
    try {
      const index = await this.getToDoIndex(todo);
      await this.contractInstance.removeToDo(index);
      this.cleanCurrentTodo(todo, destination);
      this.infoMessage = "ToDo has been removed!"
    } catch (e) {
      this.infoMessage = "ToDo not found to be removed. Add it first!"
    }
  }

  public async getToDoStatus() {
    let result = await this.contractInstance.getToDoStatus(this.state)
    if (result) {
      this.infoMessage = result
    }
  }


  public async getToDoStatuses() {
    try {
      let indexLength = await this.contractInstance.indexCounter();
      for (let i = 0; i < indexLength.toNumber(); i++) {
        let toDo = await this.contractInstance.getToDoByIndex(i)
        let status = await this.contractInstance.getToDoStatus(toDo);
        if (status === 1) {
          this.toDoStatus.push(toDo);
        } else if (status === 2) {
          this.inProgressStatus.push(toDo);
        } else if (status === 3) {
          this.doneStatus.push(toDo);
        }

        console.log(this.inProgressStatus)
      }
    } catch (e) {
      this.infoMessage = e.message
    }
  }


  public async getToDo() {
    let toDoArray = [];
    try {
      let indexLength = await this.contractInstance.indexCounter();
      for (let i = 0; i < indexLength.toNumber(); i++) {
        let toDo = await this.contractInstance.getToDoByIndex(i)
        let status = await this.contractInstance.getToDoStatus(toDo);
        if (status == 1) {
          toDoArray.push(toDo)
        }
      }

      this.infoMessage = `${toDoArray}`;

    } catch (e) {
      this.infoMessage = `Some error occur. ${e.message}`
    }
  }

  public async getInProgress() {
    let inProgressArray = [];
    try {
      let indexLength = await this.contractInstance.indexCounter();
      for (let i = 0; i < indexLength.toNumber(); i++) {
        let toDo = await this.contractInstance.getToDoByIndex(i)
        let status = await this.contractInstance.getToDoStatus(toDo);
        if (status == 2) {
          inProgressArray.push(toDo)
        }
      }

      this.infoMessage = `${inProgressArray}`;

    } catch (e) {
      this.infoMessage = `Some error occur. ${e.message}`
    }
  }

  public async getDone() {
    let doneArray = [];
    try {
      let indexLength = await this.contractInstance.indexCounter();
      for (let i = 0; i < indexLength.toNumber(); i++) {
        let toDo = await this.contractInstance.getToDoByIndex(i)
        let status = await this.contractInstance.getToDoStatus(toDo);
        if (status == 3) {
          doneArray.push(toDo)
        }
      }

      this.infoMessage = `${doneArray}`;

    } catch (e) {
      this.infoMessage = `Some error occur. ${e.message}`
    }
  }

  public addInfoMessage(message: string) {
    this.infoMessage = message;
    this.clearInfoMessage();
  }

  public async clearInfoMessage() {
    setTimeout(() => {
      this.infoMessage = '';
    }, 5000);
  }

  public changeCurrentStatus(todo, destination) {
    if (destination === 'progress') {
      this.toDoStatus.splice(this.toDoStatus.indexOf(todo), 1);
      this.inProgressStatus.push(todo);
    } else if (destination === 'done') {
      this.inProgressStatus.splice(this.inProgressStatus.indexOf(todo), 1);
      this.doneStatus.push(todo);
    }
  }

  public cleanCurrentTodo(todo, destination) {
    if (destination === 'todo') {
      this.toDoStatus.splice(this.toDoStatus.indexOf(todo), 1);
    } else if (destination === 'progress') {
      this.inProgressStatus.splice(this.inProgressStatus.indexOf(todo), 1);
    } else if (destination === 'done') {
      this.doneStatus.splice(this.doneStatus.indexOf(todo), 1);
    }
  }

}
