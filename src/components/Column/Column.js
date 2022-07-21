import React, { useEffect, useState } from 'react'
import './Column.scss'
import Card from '../Card/Card'
import {mapOrder} from '../../utillities/sorts'
import { Container, Draggable } from "react-smooth-dnd";
import Dropdown from 'react-bootstrap/Dropdown';
import ConfirmModal from '../Common/ComfirmModal';
import { MODAL_ACTION_CONFIRM} from '../../utillities/constant'
import Form from 'react-bootstrap/Form';

function Column(props) {

  // truyền props 
  const {column , onCardDrop , onUpdateColumn} = props

  const [showConfirmModal , setShowConfirmModal] = useState(false)
  const [columnTitle , setColumnTitle] = useState('')


// sắp xếp vị trí của các card trong 1 column trong array cardOrder
  const cards = mapOrder(column.cards , column.cardOrder , 'id')


  const toggleOpenNewColumnForm = () => setShowConfirmModal(!showConfirmModal)

  
  // click title column 
  const selectAllInlineText = (e) => {
    e.target.focus()
    e.target.select()
  }

  // nhập input titkle column
  const handleTitleColumnChange = (e) => {
    setColumnTitle(e.target.value)
  }

  // enter input 
  const saveContentAfterEnter = (e) => {
    if(e.key === 'Enter'){
      e.target.blur()
    }
  }

  
  useEffect(() => {
    setColumnTitle(column.title)
  }, [column.title])

  
  const onConfirmModalAction = (type) => {
    // remove column
    if(type === MODAL_ACTION_CONFIRM){
      const newColumns = {
        ...column,
        _destroy  : true,
      }
      onUpdateColumn(newColumns)
    }
     toggleOpenNewColumnForm()
  }

  const handleTitleColumnBlur = () => {
    // edit title column
      const newColumns = {
        ...column,
        title  : columnTitle,
      }
      onUpdateColumn(newColumns)
  }


  return (
    <div className="column">
      <header className="column-drag-handle">
        {/** INPUT TITLE */}
        <div  className="column-title">
        <Form.Control 
           type="text"
           placeholder="Enter column title ..."
           className = "trello-content-editable"
           value={columnTitle}
           spellCheck = "false"
           onClick={selectAllInlineText} // click
           onChange={handleTitleColumnChange}  // change title column value
           onBlur  = {handleTitleColumnBlur}  // blur
           onKeyDown = {saveContentAfterEnter} // enter
           onMouseDown = {e => e.preventDefault()} // drag drop
           />
        </div>

    {/** ALERT COMFIRM */}

        <div className="column-dropdown-actions">
        <Dropdown>
      <Dropdown.Toggle id="dropdown-basic" size="sm" className="dropdown-btn" />

      <Dropdown.Menu>
        <Dropdown.Item>Add Card ...</Dropdown.Item>
        <Dropdown.Item onClick = {toggleOpenNewColumnForm} >Remove column....</Dropdown.Item>
        <Dropdown.Item>Remove all card ...</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
        </div>
        
      </header>
      <div className="card-list">
      <Container
                    orientation="vertical"
                    groupName="col" // columns sẽ có chung class name để các card có thể di chuyển qua lại 
                    onDrop={dropResult => onCardDrop(column.id , dropResult)}
                    getChildPayload={index => cards[index]} // lấy dữ liệu của phần tử drag 
                    dragClass="card-ghost"
                    dropClass="card-ghost-drop"
                    dropPlaceholder={{                      
                      animationDuration: 150,
                      showOnTop: true,
                      className: 'card-drop-preview' 
                    }}
                    dropPlaceholderAnimationDuration={200}
                  >
                  {cards.map((card , index) => (
                    <Draggable key={index}>
                       <Card card={card}/>
                    </Draggable>  
                ))}

        </Container>
      </div>

      <footer>
        <div  className = "footer-actions">
                <i className="fa fa-plus icon " />
              Add another card
              </div>
      </footer>
        
      <ConfirmModal 
       show = {showConfirmModal}
       onAction = {onConfirmModalAction}
       title = 'Remove column'
       content = {`Are you sure want to remove <strong>${column.title}</strong> ! `}
      />
        

    </div>
  )
}

export default Column;