pragma solidity ^0.5.0;

contract ToDoManager {
    
    enum Status {initial, toDo, inProgress, done}
    mapping (uint => string) indexToDo;
    mapping (string => Status) toDoStatus;
    uint public indexCounter;
    mapping (string => address) assignedToDo; 
    
    modifier onlyAssignee(uint _index) {
        string memory _toDo = indexToDo[_index];
        require(msg.sender == assignedToDo[_toDo]);
        _;
    }
    
    function addToDo(string memory _toDo) public {
        require(uint(toDoStatus[_toDo]) == uint(Status.initial));
        toDoStatus[_toDo] = Status.toDo;
        indexToDo[indexCounter] = _toDo;
        indexCounter ++;
    }

    function assignToDo(string memory _toDo) public {
        require(uint(toDoStatus[_toDo]) == 1);
        require(assignedToDo[_toDo] == address(0));
        assignedToDo[_toDo] = msg.sender;
    }
    
    function changeToDoStatus(uint _index) onlyAssignee(_index) public {
        string memory _toDo = indexToDo[_index];
        uint currentStatus = uint(toDoStatus[_toDo]);
        require(uint(currentStatus) <= 3);
        toDoStatus[_toDo] = Status(currentStatus + 1);
    }
    
    function removeToDo(uint _index) public {
        string memory _toDo = indexToDo[_index];
        require(uint(toDoStatus[_toDo]) != uint(Status.initial));
        toDoStatus[_toDo] = Status.initial;
        assignedToDo[_toDo] = address(0);
        indexToDo[_index] = "empty";
    }

    function getToDoByIndex(uint _index) public view returns (string memory) {
        return indexToDo[_index];
    }

    function getToDoStatus(string memory _toDo) public view returns(Status) {
        return toDoStatus[_toDo];
    }

    function getAssignee(string memory _toDo) public view returns (address) {
        return assignedToDo[_toDo];
    }
    
    
}