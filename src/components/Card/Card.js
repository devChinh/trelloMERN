import React from 'react'
import './Card.scss'

function Card(props) {

  const {card} = props



  const handleDeleteCard = () => {
    
  }

  return (
    <div className="card-item">
       {card.cover &&
        <img 
        src={card.cover} 
        className="card-cover" 
         alt="trello"
         onMouseDown={e => e.preventDefault()}
        />
        }
         <span>{card.title}</span>
         {/* <i onClick = {handleDeleteCard} className = "fa fa-trash icon" /> */}
    </div >
    
  )
}

export default Card
