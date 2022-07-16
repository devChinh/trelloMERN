import React from 'react'
import './Column.scss'
import Card from '../Card/Card'
import {mapOrder} from '../../utillities/sorts'

function Column(props) {

  const {column} = props

  // sắp xếp vị trí của các card trong 1 column trong array cardOrder
  const cards = mapOrder(column.cards , column.cardOrder , 'id')

  return (
    <div className="column">
      <header>{column.title}</header>
      <ul className="card-list">
        {cards.map((card , index) => (
          <Card card={card} key={index}/>
        )
   )
        }
      </ul>
      <footer>Add another board</footer>
    </div>
  )
}

export default Column