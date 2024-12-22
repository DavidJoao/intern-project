import React, { useEffect } from 'react'
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import { useForm } from 'react-hook-form'
import { useAuth } from '@/app/hooks/useAuth';
import { createComment } from '@/app/actions/comments';
import { socket } from '@/app/lib/socket';

const CreateComment = ({ template, loadComments }) => {
    
    const user = useAuth();
    const { register, setValue, reset, handleSubmit, formState: { errors } } = useForm();
    
    useEffect(() => {
      socket.on("Update Comments", () => {
        loadComments(template?.id);
      });

      return () => {
        socket.off("Update Comments");
      };
    }, [template, loadComments]);

    const postComment = async (data) => {
      if (user && template) {
        const commentData = {
          content: data.content,
          userId: user?.user?.id,
          templateId: template?.id,
        };
    
        await createComment(commentData);
        await loadComments(template?.id);
        reset();

        socket.emit("update comments");
      }
    }
    
    return (
    <form className="flex flex-row items-center justify-center gap-2 p-2 border-gray-200 dark:border-gray-600 rounded-b-lg" onSubmit={handleSubmit(postComment)}>
        <input required className='input resize-none' placeholder='Post a comment...' {...register("content")} />
        <button type='submit' className="new-theme-button"><IoArrowForwardCircleOutline/></button>
    </form>
  )
}

export default CreateComment