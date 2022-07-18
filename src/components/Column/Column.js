import React from 'react'
import './Column.scss'
import Card from '../Card/Card'
import {mapOrder} from '../../utillities/sorts'
import { Container, Draggable } from "react-smooth-dnd";

function Column(props) {

  const {column} = props

  // sắp xếp vị trí của các card trong 1 column trong array cardOrder
  const cards = mapOrder(column.cards , column.cardOrder , 'id')

  const onCardDrop = (dropResultCard) => {
    console.log('============= dropResultCard',dropResultCard)
  }

  return (
    <div className="column">
      <header className="column-drag-handle">{column.title}</header>
      <div className="card-list">
      <Container
                    orientation="vertical"
                    groupName="col" // columns sẽ có chung class name để các card có thể di chuyển qua lại 
                    onDrop={onCardDrop}
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
      <footer>Add another board</footer>
    </div>
  )
}

export default Column