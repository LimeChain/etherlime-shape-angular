declare let require: any;
declare var web3: any;
import { Component } from '@angular/core';
const etherlime = require('etherlime');
const ethers = require('ethers');
const ToDo = require('../../../build/ToDoManager.json');


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  title = 'My Decentralized App';

  public successMessage: string;
  public infoMessage: string;
  public errorMessage: string;
  public contractInstance: any;
  public contractAddress = '0xc9707E1e496C12f1Fa83AFbbA8735DA697cdBf64';
  public toDoStatus: any;
  public inProgressStatus: any;
  public doneStatus: any;
  public inactiveButton;

  constructor() {
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
      this.addInfoMessage(`${e.message}. You can not assign to a ToDo if it is not added the list!`)
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
      this.addInfoMessage("ToDo has been removed!")
    } catch (e) {
      this.addInfoMessage("ToDo not found to be removed. Add it first!")
    }
  }


  private async getToDoStatuses() {
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
      }
    } catch (e) {
      this.addInfoMessage(e.message)
    }
  }

  private addInfoMessage(message: string) {
    this.infoMessage = message;
    this.clearInfoMessage();
  }

  private async clearInfoMessage() {
    setTimeout(() => {
      this.infoMessage = '';
    }, 5000);
  }

  private changeCurrentStatus(todo, destination) {
    if (destination === 'progress') {
      this.toDoStatus.splice(this.toDoStatus.indexOf(todo), 1);
      this.inProgressStatus.push(todo);
    } else if (destination === 'done') {
      this.inProgressStatus.splice(this.inProgressStatus.indexOf(todo), 1);
      this.doneStatus.push(todo);
    }
  }

  private cleanCurrentTodo(todo, destination) {
    if (destination === 'todo') {
      this.toDoStatus.splice(this.toDoStatus.indexOf(todo), 1);
    } else if (destination === 'progress') {
      this.inProgressStatus.splice(this.inProgressStatus.indexOf(todo), 1);
    } else if (destination === 'done') {
      this.doneStatus.splice(this.doneStatus.indexOf(todo), 1);
    }
  }

}
