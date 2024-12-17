'use client'
import { getCommentsByTemplate } from '@/app/actions/comments';
import { getTemplateById } from '@/app/actions/templates'
import CreateComment from '@/app/components/comments/CreateComment';
import Loading from '@/app/components/general/Loading'
import AddQuestion from '@/app/components/questions/AddQuestion';
import Comment from '@/app/components/comments/Comment';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { FcLike, FcDislike } from "react-icons/fc";
import { IoArrowForwardCircleOutline } from "react-icons/io5";



const Template = (context) => {

  const { id } = context.params

  const [template, setTemplate] = useState(null)
  const [comments, setComments] = useState(null)
  const [currentQuestionForm, setCurrentQuestionForm] = useState(null)

  useEffect(() => {
    const initiateTemplate = async () => {
      if (id) {
        const { data } = await getTemplateById(id);
        await loadComments(id)
        setTemplate(data.foundTemplate);
      }
    }
    initiateTemplate()
  }, [])

  const loadComments = async (id) => {
    const comments = await getCommentsByTemplate(id);
    setComments(comments.data.comments);
  }

  return (
		<>
			{template ? (
				<div className="w-screen h-screen flex flex-col pt-[50px] border-[1px] border-black">
                    
					<header className="w-full h-[20%] flex flex-row bg-center relative isolate p-3">
						<div className="absolute inset-0 bg-cover bg-center filter brightness-50 -z-10" style={{ backgroundImage: `url('${template.imageUrl}')` }}></div>
						<div className="w-[50%] flex flex-col justify-center">
							<h1 className="font-bold text-3xl text-white ">{template.title}</h1>
                            <p className='text-white text-sm'>{template.description}</p>
						</div>

						<div className="w-[50%] flex flex-col items-end justify-evenly">
                            <button className='border blue-button w-auto gap-1 flex items-center'>Like <FcLike/></button>
                            <Link href={`/pages/template/${template.id}/forms`} className='border blue-button w-auto gap-1 flex items-center'>Forms <IoArrowForwardCircleOutline/> </Link>
                        </div>
					</header>

					{/* MAIN CONTAINER */}
					<main className="w-full h-full flex flex-col md:flex-row gap-2">
						{/* Questions */}
						<section className="flex flex-col w-full md:w-[70%] h-[70%] md:h-full p-3 border-[1px] border-slate-200 gap-2">
                            { template.questions ? (
                                <p></p>
                            ) : (<p className='text-center'>No questions at the moment</p>) }
                            <div className='flex flex-row flex-col items-center w-auto gap-2 border-[3px] rounded'>
                                <p className='font-bold'>Add Question</p>
                                <AddQuestion />
                            </div>
                        </section>

						{/* Comments */}
						<section className="w-full md:w-[30%] h-[30%] md:h-full border-[1px] border-slate-200 p-3">
                            <div className='border h-[90%] p-2 w-ful;'>
                                <p className='font-bold text-black text-center'>Comments</p>
                                { comments ? (
                                    comments.map((comment, index) => {
                                        return (
                                            <Comment key={index} comment={comment}/>
                                        )
                                    })
                                ) : (
                                    <p>No comments available</p>
                                ) }
                            </div>
                            <div className='border h-[10%] p-2 flex items-center justify-center'>
                                <CreateComment template={template} loadComments={loadComments}/>
                            </div>
                        </section>
					</main>
				</div>
			) : (
				<Loading />
			)}
		</>
  )
}

export default Template