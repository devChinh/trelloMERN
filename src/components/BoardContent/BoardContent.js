import Column from '../../components/Column/Column'
import React, { useState , useEffect } from 'react'
import './BoardContent.scss'
import {initialData} from '../../actions/initialData'
import {mapOrder} from '../../utillities/sorts'
import {isEmpty} from 'lodash'
import { applyDrag } from '../../utillities/dragDrop'

import { Container, Draggable } from "react-smooth-dnd";

function BoardContent() {

  const [board , setBoard] = useState({})
  const [columns , setColumns] = useState([])

  useEffect(() => {
    const boardFromDB = initialData.boards.find(board => board.id === 'board-1')
    if(boardFromDB){
      setBoard(boardFromDB)

      //sort columns
      // hàm sort đế sắp xếp thử tự của phần tử 

      // setColumns(mapOrder(boardFromDB.columns , boardFromDB.columnOrder , 'id'))
      setColumns(mapOrder(boardFromDB.columns , boardFromDB.columnOrder , 'id'))
    }
  }, [])

  // check xem có column hay khong
  // if( Object.keys(board).length === 0){
  //   return <div className="not-found">Board not found</div>
  // }
  if(isEmpty(board)){
    return <div className="not-found">Board not found</div>
  }

  console.log('============= board',board)
  console.log('============= ',columns)

   const onColumnDrop = (dropResult) => {
    // hàm applyDrag giúp thay thế các column với nhau 
    let newColumns = [...columns]
    newColumns = applyDrag(newColumns, dropResult)

    // set lại columnsOrder khi columns thay đổi vị trí 
    let newBoard = {...board}
    newBoard.columnOrder = newColumns.map(c => c.id)
    newBoard.columns = newColumns

    console.log('============= newColumns',newColumns)
    console.log('============= newBoard',newBoard)

    setColumns(newColumns)
    setBoard(newBoard)
  }

  const onCardDrop = (columnId , dropResultCard) => {
     if(dropResultCard.removedIndex !== null ||  dropResultCard.addedIndex !== null){
      let newColumns = [...columns]

      let currentColumn = newColumns.find(c => c.id === columnId)
      currentColumn.cards = applyDrag(currentColumn.cards , dropResultCard)
      currentColumn.cardOrder = currentColumn.cards.map(i => i.id)

      setColumns(newColumns)
  }}




  return (
    <div className="board-content">
        <Container // phần content đc bọc cả để gán các sự kiện cho drag 
          orientation="horizontal"
          onDrop={onColumnDrop}
          getChildPayload = { index => columns[index]} // thể hiện thằng vừa kéo 
          dragHandleSelector=".column-drag-handle" // chỉ có phần có class là column-drag-handle mới có thể kéo thả đc
          dropPlaceholder={{ // là một đường viền bao quanh ở chỗ đang kéo 
            animationDuration: 150,
            showOnTop: true,
            className: 'columns-drop-preview'
          }}
        >
          {columns.map((column, index) => ( // ngoặc nhọn thì phải có return 
            <Draggable key={index}>
              <Column onCardDrop = {onCardDrop} column ={column} />
            </Draggable>
        ))}
        </Container>
       <div className="add-new-column">
       <i className="fa fa-plus icon " />
              Add another board
       </div>
  </div>
  )
}

export default BoardContent