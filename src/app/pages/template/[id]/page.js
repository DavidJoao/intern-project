'use client'
import { getCommentsByTemplate } from '@/app/actions/comments';
import { getTemplateById } from '@/app/actions/templates'
import Loading from '@/app/components/general/Loading'
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import Like from '@/app/components/templates/Like';
import { getQuestionsByTemplate } from '@/app/actions/questions';
import QuestionsSection from '@/app/components/questions/QuestionsSection';
import { useAuth } from '@/app/hooks/useAuth';
import { CiSettings } from 'react-icons/ci';
import { logSession } from '@/app/actions/session';
import { navigate } from '@/app/lib/redirect';
import { useTranslation } from 'react-i18next';
import RoleBasedComponent from '@/app/components/general/RoleBasedComponent';
import Comment from '@/app/components/comments/Comment';
import dynamic from 'next/dynamic';

const Template = context => {

	const CreateComment = dynamic(() => import("@/app/components/comments/CreateComment"))
	const AddQuestion = dynamic(() => import("@/app/components/questions/AddQuestion"))

	const user = useAuth()
	const { t } = useTranslation("common")
	const { id } = context.params

	const [template, setTemplate] = useState(null)
	const [comments, setComments] = useState(null)
	const [questions, setQuestions] = useState(null)
	const [session, setSession] = useState(null)

	useEffect(() => {
		const fetchSession = async () => {
			const session = await logSession()
			if (session) {
				setSession(session)
			} else {
				navigate(`/pages/nonauth/template/${id}`)
			}
		}
		fetchSession()
	}, [])

	useEffect(() => {
		const initiateTemplate = async () => {
			if (id) {
				const { data } = await getTemplateById(id)
				await loadComments(id)
				await loadQuestions(id)
				setTemplate(data.foundTemplate)
			}
		}
		initiateTemplate()
	}, [])

	const loadComments = async id => {
		const comments = await getCommentsByTemplate(id)
		setComments(comments.data.comments)
	}

	const loadQuestions = async id => {
		const questions = await getQuestionsByTemplate(id)
		setQuestions(questions.data.questions)
	}

	if (!template || !user) {
		return <Loading />
	}

	return (
		<>
			<div className="w-screen min-h-screen h-auto flex flex-col pt-[50px] bg-slate-200 dark:bg-gray-800 dark:text-white">
				<header className="w-full h-[20%] flex flex-row bg-center relative isolate p-3">
					<div
						className="absolute inset-0 bg-cover bg-center filter brightness-50 -z-10"
						style={{ backgroundImage: `url('${template?.imageUrl}')` }}></div>
					<div className="w-[50%] flex flex-col justify-center">
						<h1 className="font-bold text-3xl text-white ">{template.title}</h1>
						<p className="text-white text-sm">Posted By: {template?.creator?.name}</p>
						<p className="text-white text-sm">{template.description}</p>
						<p>
							{template?.tags.map(tag => {
								return `#${tag} `
							})}
						</p>
					</div>

					<div className="w-[50%] flex flex-col items-end justify-evenly gap-3">
						<Like template={template} />
						<Link
							href={`/pages/template/${template.id}/forms`}
							className="new-theme-button w-[100px]">
							{t("forms")}
							<IoArrowForwardCircleOutline />{" "}
						</Link>
						<RoleBasedComponent
							condition={user =>
								user.role === "admin" || template.creatorId === user.id
							}
							user={user?.user}>
							<Link
								href={`/pages/template/${template.id}/settings`}
								className="new-theme-button w-[100px]">
								{" "}
								{t("settings")} <CiSettings />{" "}
							</Link>
						</RoleBasedComponent>
					</div>
				</header>

				<main className="w-full h-full flex flex-col md:flex-row gap-2">
					<section className="flex flex-col w-full md:w-[70%] h-auto sm:h-[70%] md:h-full p-3 border-[1px] border-slate-200 dark:border-gray-700 rounded-lg gap-2">
						<div className="flex flex-col items-center w-auto gap-4 border-3 rounded-lg p-4 lg:h-full lg:max-h-[600px] overflow-auto dark:bg-gray-800 bg-white border-gray-300 dark:border-gray-600">
							<QuestionsSection
								questions={questions}
								setQuestions={setQuestions}
								template={template}
								loadQuestions={loadQuestions}
								session={session}
							/>
							<RoleBasedComponent
								condition={user =>
									user?.role === "admin" || template.creatorId === user?.id
								}
								user={user?.user}>
								<AddQuestion
									template={template}
									loadQuestions={loadQuestions}
									questions={questions}
								/>
							</RoleBasedComponent>
						</div>
					</section>

					<section className="w-full md:w-[30%] h-[30%] md:h-full border border-slate-200 p-3 rounded-lg dark:bg-gray-800 dark:border-gray-700">
						<p className="font-bold text-black text-center dark:text-white">
							{t("comments")}
						</p>
						<div className="border h-[90%] max-h-[500px] flex flex-col gap-2 p-2 w-full overflow-auto bg-white dark:bg-gray-900 dark:border-gray-600 rounded-lg">
							{comments ? (
								comments.map((comment, index) => {
									return (
										<Comment
											key={index}
											comment={comment}
											loadComments={loadComments}
											templateId={id}
											session={session}
										/>
									)
								})
							) : (
								<p className="text-center text-gray-500 dark:text-gray-400">
									{t("no-comments")}
								</p>
							)}
						</div>
						<div className="border-t h-[10%] p-2 flex items-center justify-center bg-white dark:bg-gray-900 dark:border-gray-600 rounded-b-lg">
							<CreateComment template={template} loadComments={loadComments} />
						</div>
					</section>
				</main>
			</div>
		</>
	)
}

export default Template