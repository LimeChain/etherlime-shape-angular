pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract ToDo {
    
    enum ToDoStatus {initial, toDo, inProgress, done}
    mapping (string => ToDoStatus) toDoList;
    string[] public toDos;
    
    function addToDo(string memory _toDo) public {
        require(uint(toDoList[_toDo]) == uint(ToDoStatus.initial));
        toDoList[_toDo] = ToDoStatus.toDo;
        toDos.push(_toDo);
    }
    
    function changeToDoStatus(string memory _toDo) public {
        require(uint(toDoList[_toDo]) >= 1);
        require(uint(toDoList[_toDo]) <= 3);
        uint currentStatus = uint(toDoList[_toDo]);
        toDoList[_toDo] = ToDoStatus(currentStatus + 1);
    }
    
    function removeToDo(string memory _toDo) public {
        require(uint(toDoList[_toDo]) != uint(ToDoStatus.initial));
        toDoList[_toDo] = ToDoStatus.initial;
        for(uint8 i; i < toDos.length; i++){
            if(uint(keccak256(abi.encodePacked(toDos[i]))) == uint(keccak256(abi.encodePacked(_toDo)))){
                delete toDos[i];
            }
        }
    }

    function getAllToDos() public view returns (string[] memory) {
        return toDos;
    }
    
    function getToDoStatus(string memory _toDo) public view returns(string memory) {
        if(uint(toDoList[_toDo]) == 0) {
            return "This to do is not added to the list";
        }
        
        if(uint(toDoList[_toDo]) == 1) {
            return "To do";
        }
        
        if(uint(toDoList[_toDo]) == 2) {
            return "In progress";
        }
        
        if(uint(toDoList[_toDo]) == 3) {
            return "Done";
        }
        
    }
    
    
}