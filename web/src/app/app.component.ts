declare let require: any;
declare var web3: any;
declare let window: any;
import { Component } from '@angular/core';
const etherlime = require('etherlime');
const ethers = require('ethers');
const ToDo = require('../../../build/ToDoManager.json');
const Web3 = require('web3');


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  title = 'My Decentralized App';

  public state: string;
  public myModel: string;
  public contractInstance: any;
  public networkProvider: any;
  private blockChainNetwork = 'http://localhost:8545';
  public wallet: any;
  public pk = '0x7ab741b57e8d94dd7e1a29055646bafde7010f38a900f55bbd7647880faa6ee8';
  public contractAddress = '0x418427BFb621154400cE6a154389a46d360ECDCb';
  public connectedContract: any;
  public toDoStatus: any;
  public inProgressStatus: any;
  public doneStatus: any;

  constructor() {
    
  }

  private async getToDoIndex(_toDo) {
    const indexCounter = await this.contractInstance.indexCounter();
    for(let i = 0; i < indexCounter.toNumber(); i++) {
      let toDo = await this.contractInstance.getToDoByIndex(i);
        if(toDo === _toDo){
          return i
        }
    }
  }

  private async getSignerInstance() {
    const provider = new ethers.providers.Web3Provider(web3.currentProvider);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(this.contractAddress, ToDo.abi, provider)
      const instance = await contract.connect(signer);
      return instance
  }

  public async setContract() {
    try{
      this.contractInstance = await etherlime.ContractAt(ToDo, this.contractAddress)
      this.myModel = "The contract has been set and is ready to interact with it!"
    } catch(e) {
      this.myModel = e.message
    }
  }

  public async addToDo() {
    try {
      await this.contractInstance.addToDo(this.state)
      this.myModel = "ToDo has been added!"
    } catch (e) {
      this.myModel = `Transaction failed. Are you sure you hadn't already added this ToDo! ${e.message}`
    }

  }

  public async assignToDo() {
    try {
      const instance = await this.getSignerInstance();
      await instance.assignToDo(this.state);
      this.myModel = "ToDo was assigned to you!"
    } catch (e) {
      this.myModel = `${e.message}. You can not assign to a ToDo if it is not added the list first!`
    }
  }

  public async changeToDoStatus() {
    try {
      const instance = await this.getSignerInstance();
      const index = await this.getToDoIndex(this.state);
      await instance.changeToDoStatus(index)
      this.myModel = "Status has been changed!"
    } catch (e) {
      this.myModel = `You can not change ToDo's status if it is not assigned to you! ${e.message}`
    }


  }

  public async removeToDo() {
    try {
      const index = await this.getToDoIndex(this.state);
      await this.contractInstance.removeToDo(index)
      this.myModel = "ToDo has been removed!"
    } catch (e) {
      this.myModel = "ToDo not found to be removed. Add it first!"
    }

  }

  public async getToDoStatus() {
    let result = await this.contractInstance.getToDoStatus(this.state)
    if (result) {
      this.myModel = result
    }
  }


  public async getToDoStatuses () {
    try {
      let indexLength = await this.contractInstance.indexCounter();
      for(let i = 0; i < indexLength.toNumber(); i++) {
        let toDo = await this.contractInstance.getToDoByIndex(i)
        let status = await this.contractInstance.getToDoStatus(toDo);
        if(status === 1) {
          this.toDoStatus.push(toDo)
        } else if(status === 2) {
          this.inProgressStatus.push(toDo)
        } else if(status === 3) {
          this.doneStatus.push(toDo)
        }
      }
    } catch (e) {
      this.myModel = e.message
    }
  }


  public async getToDo() {
    let toDoArray = [];
    try {
      let indexLength = await this.contractInstance.indexCounter();
      for(let i = 0; i < indexLength.toNumber(); i++) {
        let toDo = await this.contractInstance.getToDoByIndex(i)
        let status = await this.contractInstance.getToDoStatus(toDo);
        if(status == 1) {
          toDoArray.push(toDo)
        }
      }

      this.myModel = `${toDoArray}`;
      
    } catch (e) {
      this.myModel = `Some error occur. ${e.message}`
    }
  }

  public async getInProgress() {
    let inProgressArray = [];
    try {
      let indexLength = await this.contractInstance.indexCounter();
      for(let i = 0; i < indexLength.toNumber(); i++) {
        let toDo = await this.contractInstance.getToDoByIndex(i)
        let status = await this.contractInstance.getToDoStatus(toDo);
        if(status == 2) {
          inProgressArray.push(toDo)
        }
      }

      this.myModel = `${inProgressArray}`;
      
    } catch (e) {
      this.myModel = `Some error occur. ${e.message}`
    }
  }

  public async getDone() {
    let doneArray = [];
    try {
      let indexLength = await this.contractInstance.indexCounter();
      for(let i = 0; i < indexLength.toNumber(); i++) {
        let toDo = await this.contractInstance.getToDoByIndex(i)
        let status = await this.contractInstance.getToDoStatus(toDo);
        if(status == 3) {
          doneArray.push(toDo)
        }
      }

      this.myModel = `${doneArray}`;
      
    } catch (e) {
      this.myModel = `Some error occur. ${e.message}`
    }
  }


}
