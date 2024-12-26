import React from "react"

const NonAuthQuestion = ({ question }) => {

	return (
		<div className="flex flex-col items-start w-full p-4 gap-3 border dark:border-gray-700 rounded-md bg-gray-100 dark:bg-gray-900 cursor-pointer shadow-md hover:shadow-lg transition-shadow" >
            <p className="font-bold text-gray-800 dark:text-gray-200">{question.title}</p>
            <p className="text-gray-700 dark:text-gray-300">{question.description}</p>
		</div>
	)
}

export default NonAuthQuestion