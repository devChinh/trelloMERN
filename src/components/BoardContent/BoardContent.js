import Column from '../../components/Column/Column'
import React, { useState , useEffect } from 'react'
import './BoardContent.scss'
import {initialData} from '../../actions/initialData'
import {mapOrder} from '../../utillities/sorts'

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
  if( Object.keys(board).length === 0){
    return <div className="not-found">Board not found</div>
  }

  console.log('============= board',board)
  console.log('============= ',columns)

  return (
    <div className="board-content">
      {
        columns.map((column, index) => <Column key={index} column ={column} />
        )
      }
      {/* <Column /> */}
  </div>
  )
}

export default BoardContent