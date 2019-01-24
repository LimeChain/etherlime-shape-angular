pragma solidity ^0.5.0;

contract ToDoManager {
    
    enum Status {Initial, ToDo, InProgress, Done}
    mapping (uint => string) todoByIndex;
    // mapping (string => Status) statusOf;
    mapping (uint => Status) statusOf;
    uint public indexCounter;
    // mapping (string => address) assignedToDo; 
    mapping (uint => address) assignedToDo;
    
    modifier onlyAssignee(uint _index) {
        require(msg.sender == assignedToDo[_index]);
        _;
    }
    
    function addToDo(string memory _toDo) public {
        todoByIndex[indexCounter] = _toDo;
        statusOf[indexCounter] = Status.ToDo;
        indexCounter ++;
    }

    function assignToDo(uint _index) public {
        require(uint(statusOf[_index]) == 1);
        require(assignedToDo[_index] == address(0));
        assignedToDo[_index] = msg.sender;
    }
    
    function changeToDoStatus(uint _index) onlyAssignee(_index) public {
        uint currentStatus = uint(statusOf[_index]);
        require(currentStatus < 3);
        statusOf[_index] = Status(currentStatus + 1);
    }
    
    function removeToDo(uint _index) public {
        require(uint(statusOf[_index]) != uint(Status.Initial));
        statusOf[_index] = Status.Initial;
        assignedToDo[_index] = address(0);
        todoByIndex[_index] = "empty";
    }

    function getToDoByIndex(uint _index) public view returns (string memory) {
        return todoByIndex[_index];
    }

    function getToDoStatus(uint _index) public view returns(Status) {
        return statusOf[_index];
    }

    function getAssignee(uint _index) public view returns (address) {
        return assignedToDo[_index];
    }
    
    
}