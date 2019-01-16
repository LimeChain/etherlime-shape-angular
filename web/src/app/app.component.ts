declare let require: any;
import { Component } from '@angular/core';
// import * as etherlime from 'etherlime';
const etherlime = require('etherlime');
const ToDo = require('../../../build/ToDo.json');


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'My Decentralized App';

  public todo: string;
  public myModel: string;
  public contractInstance: any;
  public contractAdr: string;
  

  constructor() {
    this.contractAdr = '0x45B99A699a46C8860B78b2c3Afd8cdf4813537fd'
  }

  public async setContract() {
    this.contractInstance = await etherlime.ContractAt(ToDo, this.contractAdr)
  }

  public async addToDoPress() {
    try {
      await this.contractInstance.addToDo(this.todo)
      this.myModel = "ToDo has been added!"
    }catch (e) {
      this.myModel = "Transaction faild. Are you sure you hadn't already added this ToDo!"
    }
    
  }

  public async changeToDoStatus() {
    try{
      await this.contractInstance.changeToDoStatus(this.todo)
      this.myModel = "Status has been changed!"
    } catch (e) {
      this.myModel = "This ToDo is not added to list or it has already been done!"
    }
    
    
  }

  public async removeToDo() {
    try {
      await this.contractInstance.removeToDo(this.todo)
      this.myModel = "ToDo has been removed!"
    } catch (e) {
      this.myModel = "ToDo not found to be removed. Add it first!"
    }
    
  }

  public async getToDoStatus() {
    let result = await this.contractInstance.getToDoStatus(this.todo)
    if(result) {
      this.myModel = result
    }
  }

  public async getAllToDos() {
     let result = await this.contractInstance.getAllToDos()
     this.myModel = result
  }
}
