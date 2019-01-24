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
  public toDos: any;
  public inactiveButton;
  public provider: any;

  constructor() {

  }

  async ngOnInit() {
    this.toDos = {
      toDo: [],
      inProgress: [],
      done: []
    }
    try {
      this.provider = new ethers.providers.Web3Provider(web3.currentProvider);
      this.contractInstance = await new ethers.Contract(this.contractAddress, ToDo.abi, this.provider)
      this.successMessage = 'The contract has been set and is ready to interact with it!';
      await this.getToDoStatuses();

    } catch (e) {
      this.errorMessage = e.message;
    }
  }

  private async getToDoIndex(_toDo) {
    const indexCounter = await this.contractInstance.indexCounter();
    const counter = indexCounter.toNumber();
    for (let i = 0; i < indexCounter; i++) {
      let toDo = await this.contractInstance.getToDoByIndex(i);
      if (toDo === _toDo) {
        return i
      }
    }
  }

  private async connectWithSigner() {
    const signer = await this.provider.getSigner();
    this.contractInstance = await this.contractInstance.connect(signer);
  }

  public async addToDo(todo) {

    try {
      await this.connectWithSigner()
      this.inactiveButton = true;
      await this.contractInstance.addToDo(todo.value);
      this.addInfoMessage('ToDo has been added!');
      this.toDos.toDo.push(todo.value);
      this.inactiveButton = false;
    } catch (e) {
      this.addInfoMessage(`Transaction failed. Are you sure you hadn't already added this ToDo! ${e.message}`);
      this.inactiveButton = false;
    }
  }

  public async assignToDo(assignedTodo) {
    try {
      await this.connectWithSigner()
      let index = await this.getToDoIndex(assignedTodo);
      await this.contractInstance.assignToDo(index);
      this.addInfoMessage('ToDo was assigned to you!')
    } catch (e) {
      this.addInfoMessage(`${e.message}. You can not assign to a ToDo if it is not added the list!`)
    }
  }

  public async changeToDoStatus(todo, destination) {
    try {
      const index = await this.getToDoIndex(todo);
      await this.contractInstance.changeToDoStatus(index);
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
      let indexCounter = await this.contractInstance.indexCounter();
      let index = indexCounter.toNumber();
      for (let i = 0; i < index; i++) {
        let toDo = await this.contractInstance.getToDoByIndex(i)
        let status = await this.contractInstance.getToDoStatus(i);
        if (status === 1) {
          this.toDos.toDo.push(toDo);
        } else if (status === 2) {
          this.toDos.inProgress.push(toDo);
        } else if (status === 3) {
          this.toDos.done.push(toDo);
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

  public async moveToInProgress(todo) {

    try {
      await this.connectWithSigner()
      const index = await this.getToDoIndex(todo);
      await this.contractInstance.changeToDoStatus(index);
      this.toDos.toDo.splice(this.toDos.toDo.indexOf(todo), 1);
      this.toDos.inProgress.push(todo);
      this.addInfoMessage('Status has been changed!');
    } catch (e) {
      this.addInfoMessage(`You can not change ToDo's status if it is not assigned to you! ${e.message}`);
    }
  }

  public async moveToDone(todo) {

    try {
      await this.connectWithSigner()
      const index = await this.getToDoIndex(todo);
      await this.contractInstance.changeToDoStatus(index);
      this.toDos.inProgress.splice(this.toDos.inProgress.indexOf(todo), 1);
      this.toDos.done.push(todo);
      this.addInfoMessage('Status has been changed!');
    } catch (e) {
      this.addInfoMessage(`You can not change ToDo's status if it is not assigned to you! ${e.message}`);
    }

  }

  private cleanCurrentTodo(todo, destination) {
    if (destination === 'todo') {
      this.toDos.toDo.splice(this.toDos.toDo.indexOf(todo), 1);
    } else if (destination === 'progress') {
      this.toDos.inProgress.splice(this.toDos.inProgress.indexOf(todo), 1);
    } else if (destination === 'done') {
      this.toDos.done.splice(this.toDos.done.indexOf(todo), 1);
    }
  }

}
