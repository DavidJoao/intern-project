import React from 'react'
import ReactTimeago from 'react-timeago'

const Comment = ({ comment }) => {
  return (
    <div>
        <p className='font-bold'>{comment.userName}</p>
        <p>{comment.content}</p>
        <ReactTimeago date={comment.createdAt} />
    </div>
  )
}

export default Comment