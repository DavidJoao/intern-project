'use client'
import { getTemplateById } from '@/app/actions/templates'
import Loading from '@/app/components/general/Loading'
import React, { useEffect, useState } from 'react'

const Template = (context) => {

  const { id } = context.params

  const [template, setTemplate] = useState(null)

  useEffect(() => {
    const initiateTemplate = async () => {
      if (id) {
        const { data } = await getTemplateById(id);
        setTemplate(data.foundTemplate);
      }
    }
    initiateTemplate()
  }, [])

  return (
    <>
    {template ? (
      <div>

      </div>
    ) : (
      <Loading />
    )}
    </>
  )
}

export default Template