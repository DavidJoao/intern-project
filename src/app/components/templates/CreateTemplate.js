'use client'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { createTemplate, fetchTopics, uploadImage } from '@/app/actions/templates';
import { useForm } from 'react-hook-form';
import imageCompression from 'browser-image-compression';
import Image from 'next/image';
import { navigate } from '@/app/lib/redirect';
import { useAppContext } from '../context/provider';

const CreateTemplate = ({ userId }) => {

    const { loadAllTemplates } = useAppContext();
    const { t } = useTranslation('common');
    const { register, setValue, handleSubmit, watch, formState: { errors }, reset } = useForm();

    const [topics, setTopics] = useState([])
    const [image, setImage] = useState(null)

    useEffect(() => {
        const initiateTopics = async () => {
            const { data } = await fetchTopics();
            setTopics(Object.keys(data.topics))
        }
        initiateTopics()
    }, [])

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        try {
            const compressedImage = await imageCompression(file, {
                maxSizeMB: 0.5,
                maxWidthOrHeight: 1200,
                useWebWorker: true,
            });
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result);
            };
            reader.onerror = (error) => {
                console.error("Error reading file:", error);
            };
            reader.readAsDataURL(compressedImage);
        } catch (error) {
            console.error("Error compressing image:", error);
        }
    }

    const submitForm = async (data) => {
        try {
            let finalUrl;
            if (image !== null) {
                const imageUrl = await uploadImage(image);
                finalUrl = imageUrl;
            } else {
                finalUrl = 'https://st4.depositphotos.com/14953852/24787/v/450/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg'
            }

            if (finalUrl) {
                data.imageUrl = finalUrl;
                data.creatorId = userId;
                const response = await createTemplate(data);
                if (response.status === 201) {
                    await navigate(`/pages/template/${response.data.template.id}`);
                    await loadAllTemplates();
                    reset();
                }
    
                return response;
            }
        } catch (error) {
            return error
        }
    }

  return (
    <div className="h-full w-full md:w-[25%] flex flex-col items-center p-3 flex-grow">
        <p className='font-bold text-center text-lg dark:text-white'>{t("create-template")}</p>
        <form id='create-template' className="border-2 border-slate-200 dark:border-gray-600 w-full h-auto md:min-h-[550px] max-w-lg p-4 rounded-lg shadow-md bg-white dark:bg-gray-800 grid gap-4" onSubmit={handleSubmit(submitForm)}>
            
            <div className="flex flex-col">
                <p className="text-sm text-gray-600 dark:text-gray-300">Topic</p>
                <select className="input w-full dark:bg-gray-700 dark:text-white dark:border-gray-600 p-2" onChange={(e) => setValue("topic", e.target.value)}>
                    <option>Choose Topic</option>
                    { topics?.map((topic, index) => {
                        return (
                            <option key={index}>{topic}</option>
                        )
                    }) }
                </select>
            </div>
            
            <div className="flex flex-col">
                <p className="text-sm text-gray-600 dark:text-gray-300">Other Topic</p>
                <input required className="input w-full dark:bg-gray-700 dark:text-white dark:border-gray-600" {...register("topic")}  onChange={(e) => setValue("topic", e.target.value)}/>
            </div>
                    
            <div className="flex flex-col">
                <p className="text-sm text-gray-600 dark:text-gray-300">Name</p>
                <input required className="input w-full dark:bg-gray-700 dark:text-white dark:border-gray-600" {...register("name", { required: true })}/>
            </div>

            <div className="flex flex-col">
                <p className="text-sm text-gray-600 dark:text-gray-300">Description</p>
                <textarea required className="input w-full dark:bg-gray-700 dark:text-white dark:border-gray-600 resize-none" {...register("description", { required: true })}/>
            </div>

            <div className="flex flex-col">
                <p className="text-sm text-gray-600 dark:text-gray-300">Image</p>
                <input type='file' className="input w-full dark:bg-gray-700 dark:text-white dark:border-gray-600" onChange={handleImageUpload}/>
            </div>

            <div className="flex flex-col">
                {image ? (
                    <Image alt='image' src={image} width={150} height={150}/>
                ) : <></>}
            </div>

            <div className='p-2 flex flex-col'>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">After creating your template with this initial configuration you will be able to add questions, tags and change the image.</p>
                <button className="new-theme-button mx-auto" type='submit'>Post and go to Template</button>
            </div>
        </form>
    </div>
  )
}

export default CreateTemplate