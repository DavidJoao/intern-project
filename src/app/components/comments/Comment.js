import React, { useState, useEffect } from 'react'
import ReactTimeago from 'react-timeago'
import { FaTrash } from "react-icons/fa";
import { MdModeEditOutline } from "react-icons/md";
import { useAuth } from '@/app/hooks/useAuth';
import { deleteCommentById, editCommentById } from '@/app/actions/comments';
import { socket } from '@/app/lib/socket';

const Comment = ({ comment, loadComments, templateId }) => {

  const user = useAuth();

  const [isEditing, setIsEditing] = useState(false)
  const [newContent, setNewContent] = useState(comment.content)

  useEffect(() => {
    socket.on("Update Comments", () => {
      loadComments(templateId);
    });

    return () => {
      socket.off("Update Comments");
    };
  }, [comment, loadComments]);

  const handleEditComment = async () => {
    await editCommentById(comment.id, newContent)
    await loadComments(templateId);
    setIsEditing(false);
    socket.emit("update comments");
  }

  const handleDeleteComment = async () => {
    await deleteCommentById(comment?.id);
    await loadComments(templateId);
    socket.emit("update comments");
  }

  return (
    <div className='border rounded bg-slate-100 pl-2 pr-2'>
        <div className='flex items-center justify-between'>
          <p className='font-bold'>{comment.userName}</p>
          <div className='flex gap-3'>
            { comment.userId === user?.user?.id ||  user?.user?.role === 'admin' ? (
              <>
              <button className='text-blue-500' onClick={() => {
                setNewContent(comment.content)
                setIsEditing(!isEditing)
                }}><MdModeEditOutline/></button>
              <button className='text-red-500' onClick={handleDeleteComment}><FaTrash/></button>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
        { isEditing ? (
          <div className='flex flex-row gap-2'>
            <input className='input' value={newContent} onChange={(e) => setNewContent(e.target.value)}/>
            <button className='blue-button w-auto' onClick={handleEditComment}>Edit</button>
            <button className='blue-button w-auto' onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        ) : (
          <p>{comment.content}</p>
        ) }
        <ReactTimeago className="text-slate-400 text-xs" date={comment.createdAt} />
    </div>
  )
}

export default Comment