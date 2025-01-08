import React, { useEffect, useRef } from 'react'
import TemplateThumbnail from './TemplateThumbnail';
import Link from 'next/link';
import { useDrag, useDrop } from "react-dnd";
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';

const DraggableTemplate = ({ index, template, moveTemplate }) => {
    
    const ref = useRef(null)
    const { t } = useTranslation("common")

    const ItemType = {
        TEMPLATE: "template",
    };

    const [, drag] = useDrag({
		type: ItemType.TEMPLATE,
		item: { index },
	})

    const [, drop] = useDrop({
		accept: ItemType.TEMPLATE,
		hover: draggedItem => {
			if (draggedItem.index !== index) {
				moveTemplate(draggedItem.index, index)
				draggedItem.index = index
			}
		},
	})

    drag(drop(ref))


    return (
    <div key={index} className='flex flex-col items-center justify-center gap-1 border p-2 rounded bg-gray-200 dark:bg-gray-800 dark:border-gray-600' ref={ref}>
        <TemplateThumbnail template={template} key={index} />
        <Link href={`/pages/template/${template?.id}/settings`} className='blue-button w-auto'>{t("settings")}</Link>
    </div>
  )
}

export default DraggableTemplate