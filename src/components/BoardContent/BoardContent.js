import Column from "../../components/Column/Column";
import React, { useState, useEffect , useRef } from "react";
import "./BoardContent.scss";
import { initialData } from "../../actions/initialData";
import { mapOrder } from "../../utillities/sorts";
import { isEmpty } from "lodash";
import { applyDrag } from "../../utillities/dragDrop";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Container as ColumnContainer , Draggable } from "react-smooth-dnd";
import Form from 'react-bootstrap/Form';

const BoardContent = () => {
  const [board, setBoard] = useState({});
  const [columns, setColumns] = useState([]);
  const inputElement = useRef();
  const [openNewColumnForm , setOpenNewColumnForm] = useState(false);
  const [newColumnTitle , setNewColumnTitle] = useState('');


  useEffect(() => {
    if(openNewColumnForm === true) {
      inputElement.current.focus()
    }
  } , [openNewColumnForm])

  useEffect(() => {
    const boardFromDB = initialData.boards.find(
      (board) => board.id === "board-1"
    );
    if (boardFromDB) {
      setBoard(boardFromDB);

      //sort columns
      // hàm sort đế sắp xếp thử tự của phần tử

      // setColumns(mapOrder(boardFromDB.columns , boardFromDB.columnOrder , 'id'))
      setColumns(mapOrder(boardFromDB.columns, boardFromDB.columnOrder, "id"));
    }
  }, []);

  // check xem có column hay khong
  // if( Object.keys(board).length === 0){
  //   return <div className="not-found">Board not found</div>
  // }
  if (isEmpty(board)) {
    return <div className="not-found">Board not found</div>;
  }


  const onColumnDrop = (dropResult) => {
    console.log('============= dropResult',dropResult)
    // hàm applyDrag giúp thay thế các column với nhau
    let newColumns = [...columns];
    newColumns = applyDrag(newColumns, dropResult);

    // set lại columnsOrder khi columns thay đổi vị trí
    let newBoard = { ...board };
    newBoard.columnOrder = newColumns.map((c) => c.id);
    newBoard.columns = newColumns;

    setColumns(newColumns);
    setBoard(newBoard);
  };

  const onCardDrop = (columnId, dropResultCard) => {
    if (
      dropResultCard.removedIndex !== null ||
      dropResultCard.addedIndex !== null
    ) {
      let newColumns = [...columns];

      let currentColumn = newColumns.find((c) => c.id === columnId);
      currentColumn.cards = applyDrag(currentColumn.cards, dropResultCard);
      currentColumn.cardOrder = currentColumn.cards.map((i) => i.id);

      setColumns(newColumns);
    }
  };

  // check open new column
  const toggleOpenNewColumnForm = () => {
        setOpenNewColumnForm(!openNewColumnForm)
  }

  // nhập input 
  const onNewColumnTitleChange = (e) => {
    setNewColumnTitle(e.target.value)
  }

  // add new column 
  const addNewColumn = () => {
    if(!newColumnTitle){
      inputElement.current.focus()
      return
    } 
    
    const newColumnToAdd = {
      id : Math.random.toString(36).substring(2,5),
      boardId  : board.id , 
      title  : newColumnTitle.trim(),
      cardOrder : [],
      cards : []
   }

   let newColumns = [...columns];
   newColumns.push(newColumnToAdd)

   let newBoard = { ...board };

   newBoard.columnOrder = newColumns.map((c) => c.id);
   newBoard.columns = newColumns;

   setColumns(newColumns);
   setBoard(newBoard);

   setNewColumnTitle('')
   toggleOpenNewColumnForm(!openNewColumnForm)
  }

  // enter input add 
   const handleEnter = (e) => {
     if(e.key === 'Enter') {
      addNewColumn()
     }
   }

   // edit title end remove column
   const onUpdateColumn = (newColumnToUpdate) => {
    const columnIdToUpdate = newColumnToUpdate.id

    let newColumns = [...columns];

    const columnIndexToUpdate = newColumns.findIndex(i  => i.id === columnIdToUpdate)
    console.log('============= columnIndexToUpdate',columnIndexToUpdate)

    if(newColumnToUpdate._destroy){
      // xoá 
      newColumns.splice(columnIndexToUpdate, 1)
    }else{
      console.log('============= newColumnToUpdate',newColumnToUpdate)
      // edit title 
      newColumns.splice(columnIndexToUpdate , 1 , newColumnToUpdate)
    }

    let newBoard = { ...board };
    // tìm và cập nhật lại columnOrder
   newBoard.columnOrder = newColumns.map((c) => c.id);
   // gán lại columns
   newBoard.columns = newColumns;

   setColumns(newColumns);
   setBoard(newBoard);

   }


   // add cards 
   const addNewCardToColumns = (newColumn) => {
    
   }
   
  return (
    <div className="board-content">
      <ColumnContainer // phần content đc bọc cả để gán các sự kiện cho drag
        orientation="horizontal"
        onDrop={onColumnDrop}
        getChildPayload={(index) => (
          columns[index] //dropResult 
        )} // thể hiện thằng vừa kéo
        dragHandleSelector=".column-drag-handle" // chỉ có phần có class là column-drag-handle mới có thể kéo thả đc
        dropPlaceholder={{
          // là một đường viền bao quanh ở chỗ đang kéo
          animationDuration: 150,
          showOnTop: true,
          className: "columns-drop-preview",
        }}
      >
        {columns.map(
          (
            column,
            index // ngoặc nhọn thì phải có return
          ) => (
            <Draggable key={index}>
              <Column 
              onCardDrop={onCardDrop} 
              board={board} 
              onUpdateColumn={onUpdateColumn} 
              column={column}  
              addNewCardToColumns ={addNewCardToColumns}
              />
            </Draggable>
          )
        )}
      </ColumnContainer>
 
     {/* ADD COLUMN*/}
      <Container className="trello-add-container">
        {!openNewColumnForm && 
            <Row className="row">
              <Col onClick= {toggleOpenNewColumnForm} className="add-new-column">
              <i className="fa fa-plus icon " />
              Add another board
            </Col>
            </Row>
        }
        
         {openNewColumnForm &&
          <Row>
          <Col className="enter-new-column">
          <Form.Control 
           type="text"
           placeholder="Enter column title ..."
           className = "input-enter-new-column"
           ref={inputElement}
           value={newColumnTitle}
           onChange={onNewColumnTitleChange}
           onKeyDown={e => handleEnter(e) }
           />
            <Button onClick={addNewColumn} variant="primary">Add Column</Button>
            <span onClick= {toggleOpenNewColumnForm} className="cancel-new-column">
              <i className="fa fa-trash icon"/>
            </span>
          </Col> 
        </Row>
        }
      </Container>

    </div>
  )
}


export default BoardContent;