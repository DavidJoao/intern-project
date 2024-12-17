import React from 'react'
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import { useForm } from 'react-hook-form'
import { useAuth } from '@/app/hooks/useAuth';
import { createComment } from '@/app/actions/comments';
import ReactTimeago from 'react-timeago';

const CreateComment = ({ template, loadComments }) => {
    
    const user = useAuth();
    const { register, setValue, reset, handleSubmit, formState: { errors } } = useForm();

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
      }
    }
    
    return (
    <form className='flex flex-row items-center justify-center gap-2' onSubmit={handleSubmit(postComment)}>
        <input required className='input resize-none' placeholder='Post a comment...' {...register("content")} />
        <button type='submit' className='blue-button w-auto p-2'><IoArrowForwardCircleOutline/></button>
    </form>
  )
}

export default CreateComment