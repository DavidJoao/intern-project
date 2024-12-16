'use client'
import React, { useState } from 'react'

const AddQuestion = () => {

    const [isDisplayed, setIsDisplayed] = useState(true)

    return (
    <div className='p-2'>
        <form className='p-1 flex flex-col gap-1'>
            <label className='font-bold'>Question Type</label>
            <select className='input'>
                <option>Choose Option</option>
                <option>Single Line</option>
                <option>Multiple Line</option>
                <option>Checkbox</option>
                <option>Number</option>
            </select>
            <label className='font-bold'>Question Title:</label>
            <input className='input'/>
            <label className='font-bold'>Description:</label>
            <textarea className='input resize-none' />
            <div className='flex flex-row gap-2 justify-evenly'>
                <label className='font-bold'>Display In Form?</label>
                <input type='checkbox' defaultChecked={true} onChange={(e) => setIsDisplayed(e.target.checked)}/>
                <p>{ isDisplayed ? 'Yes' : 'No' }</p>
            </div>
            <button className='blue-button mx-auto'>Add Question</button>
        </form>
    </div>
  )
}

export default AddQuestion