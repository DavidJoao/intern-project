'use client'
import { getCommentsByTemplate } from '@/app/actions/comments';
import { getTemplateById } from '@/app/actions/templates'
import CreateComment from '@/app/components/comments/CreateComment';
import Loading from '@/app/components/general/Loading'
import AddQuestion from '@/app/components/questions/AddQuestion';
import Comment from '@/app/components/comments/Comment';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import Like from '@/app/components/templates/Like';
import { getQuestionsByTemplate } from '@/app/actions/questions';
import QuestionsSection from '@/app/components/questions/QuestionsSection';
import RoleBasedComponent from '@/app/components/general/RoleBasedComponent';
import { useAuth } from '@/app/hooks/useAuth';
import { CiSettings } from 'react-icons/ci';
import { logSession } from '@/app/actions/session';
import { navigate } from '@/app/lib/redirect';

const Template = (context) => {

  	const { id } = context.params

	const [template, setTemplate] = useState(null)
	const [comments, setComments] = useState(null)
	const [questions, setQuestions] = useState(null)
	const [session, setSession] = useState(null)

  useEffect(() => {
    const initiateTemplate = async () => {
      if (id) {
        const { data } = await getTemplateById(id);
        await loadComments(id)
        await loadQuestions(id)
        setTemplate(data.foundTemplate);
      }
    }
    initiateTemplate()
  }, [])

  const loadComments = async (id) => {
    const comments = await getCommentsByTemplate(id);
    setComments(comments.data.comments);
  }

  const loadQuestions = async (id) => {
    const questions = await getQuestionsByTemplate(id);
    setQuestions(questions.data.questions);
  }

  return (
		<>
			{template ? (
				<div className="w-screen min-h-screen h-auto flex flex-col pt-[50px] bg-slate-200 dark:bg-gray-800 dark:text-white">
					<header className="w-full h-[20%] flex flex-row bg-center relative isolate p-3">
						<div
							className="absolute inset-0 bg-cover bg-center filter brightness-50 -z-10"
							style={{ backgroundImage: `url('${template.imageUrl}')` }}></div>
						<div className="w-[50%] flex flex-col justify-center">
							<h1 className="font-bold text-3xl text-white ">{template.title}</h1>
							<p className="text-white text-sm">{template.description}</p>
						</div>
					</header>

					{/* MAIN CONTAINER */}
					<main className="w-full h-full flex flex-col md:flex-row gap-2">
						{/* Questions */}
						<section className="flex flex-col w-full md:w-[70%] h-auto sm:h-[70%] md:h-full p-3 border-[1px] border-slate-200 dark:border-gray-700 rounded-lg gap-2">
							<div className="flex flex-col items-center w-auto gap-4 border-3 rounded-lg p-4 lg:h-full lg:max-h-[600px] overflow-auto dark:bg-gray-800 bg-white border-gray-300 dark:border-gray-600">
								<QuestionsSection questions={questions} setQuestions={setQuestions} template={template} loadQuestions={loadQuestions} session={session}/>
							</div>
						</section>

						{/* Comments */}
						<section className="w-full md:w-[30%] h-[30%] md:h-full border border-slate-200 p-3 rounded-lg dark:bg-gray-800 dark:border-gray-700">
							<p className="font-bold text-black text-center dark:text-white">Comments</p>
							<div className="border h-[90%] max-h-[500px] flex flex-col gap-2 p-2 w-full overflow-auto bg-white dark:bg-gray-900 dark:border-gray-600 rounded-lg">
								{comments ? (
									comments.map((comment, index) => {
										return (
											<Comment key={index} comment={comment} loadComments={loadComments} templateId={id} session={session}/>
										)
									})
								) : (
									<p className="text-center text-gray-500 dark:text-gray-400">No comments available</p>
								)}
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