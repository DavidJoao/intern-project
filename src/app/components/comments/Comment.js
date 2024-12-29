import React, { useState, useEffect } from 'react'
import ReactTimeago from 'react-timeago'
import { FaTrash } from "react-icons/fa";
import { MdModeEditOutline } from "react-icons/md";
import { useAuth } from '@/app/hooks/useAuth';
import { deleteCommentById, editCommentById } from '@/app/actions/comments';
import { socket } from '@/app/lib/socket';
import RoleBasedComponent from '../general/RoleBasedComponent';
import { useTranslation } from 'react-i18next';

const Comment = ({ comment, loadComments, templateId, session }) => {

  const user = useAuth();
  const { t } = useTranslation('common');

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
    <div className="border dark:border-gray-700 rounded-lg bg-slate-100 dark:bg-gray-800 p-3 shadow-sm">
        <div className='flex items-center justify-between'>
          <p className="font-bold text-gray-800 dark:text-gray-200">{comment.userName}</p>
          <div className='flex gap-3'>
            { session &&
            <RoleBasedComponent condition={(user) => comment?.userId === user?.id ||  user?.role === 'admin'} user={user?.user}>
              <button className='new-theme-button' onClick={() => {
                setNewContent(comment.content)
                setIsEditing(!isEditing)
                }}><MdModeEditOutline/></button>
              <button className='text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors' onClick={handleDeleteComment}><FaTrash/></button>
            </RoleBasedComponent>
            }
          </div>
        </div>
        { isEditing ? (
          <div className='flex flex-col gap-2 mt-1'>
            <input className='input dark:text-black' value={newContent} onChange={(e) => setNewContent(e.target.value)}/>
            <button className='new-theme-button' onClick={handleEditComment}>{t("edit")}</button>
            <button className='new-theme-gray-button' onClick={() => setIsEditing(false)}>{t("cancel")}</button>
          </div>
        ) : (
          <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
        ) }
        <ReactTimeago className="text-xs text-gray-500 dark:text-gray-400 mt-2"  date={comment.createdAt} />
    </div>
  )
}

export default Comment