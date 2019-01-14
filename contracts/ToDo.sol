pragma solidity ^0.5.0;

contract ToDo {
    
    enum ToDoStatus {initial, toDo, inProgress, done}
    mapping (string => ToDoStatus) toDoList;
    
    function addToDo(string memory _toDo) public {
        require(uint(toDoList[_toDo]) == uint(ToDoStatus.initial));
        toDoList[_toDo] = ToDoStatus.toDo;
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
    }
    
    function getToDoStatus(string memory _toDo) public view returns(string memory) {
        if(uint(toDoList[_toDo]) == 0) {
            return "This to do is not added to the list";
        }
        
        if(uint(toDoList[_toDo]) == 1) {
            return "to do";
        }
        
        if(uint(toDoList[_toDo]) == 2) {
            return "in progress";
        }
        
        if(uint(toDoList[_toDo]) == 3) {
            return "done";
        }
        
    }
    
    
}