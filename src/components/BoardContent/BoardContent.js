import Column from '../../components/Column/Column'
import React, { useState , useEffect } from 'react'
import './BoardContent.scss'
import {initialData} from '../../actions/initialData'
import {mapOrder} from '../../utillities/sorts'
import {isEmpty} from 'lodash'

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
    console.log('============= dropResult',dropResult)
  }

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
              <Column column ={column} />
            </Draggable>
        ))}
        </Container>
      {/* <Column /> */}
  </div>
  )
}

export default BoardContent