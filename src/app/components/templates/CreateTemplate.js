'use client'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { createTemplate, fetchTopics, getMatchingTagsAPI, uploadImage } from '@/app/actions/templates';
import { useForm } from 'react-hook-form';
import imageCompression from 'browser-image-compression';
import Image from 'next/image';
import { navigate } from '@/app/lib/redirect';
import { useAppContext } from '../context/provider';
import { FaTrash } from 'react-icons/fa';

const CreateTemplate = ({ userId }) => {

    const { loadAllTemplates } = useAppContext();
    const { t } = useTranslation('common');
    const { register, setValue, handleSubmit, watch, formState: { errors }, reset } = useForm();

    const [topics, setTopics] = useState([])
    const [image, setImage] = useState(null)
    const [tags, setTags] = useState([])
    const [currentTag, setCurrentTag] = useState("")
    const [matchingTags, setMatchingTags] = useState([]); 

    useEffect(() => {
        const fetchTags = async () => {
            if (currentTag.trim() === '') {
                setMatchingTags([]);
                return;
            }
            try {
                const { data } = await getMatchingTagsAPI(currentTag);
                console.log(data)
                setMatchingTags(data.tags || []);
            } catch (error) {
                console.log("Error fetching Tags:", error);
                setMatchingTags([]);
            }
        };
        fetchTags();
    }, [currentTag]);

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
                data.tags = tags; 
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
   
    const handleDeleteTag = (e, tag) => {
        setTags((prevTags) => prevTags.filter((t) => t !== tag));
    }

  return (
    <div className="h-full w-full flex flex-col items-center p-3 flex-grow">
        <p className='font-bold text-center text-lg dark:text-white'>{t("create-template")}</p>
        <form id='create-template' className="border-2 border-slate-200 dark:border-gray-600 w-full h-auto md:min-h-[550px] md:max-w-[75%] p-4 rounded-lg shadow-md bg-white dark:bg-gray-800 grid gap-4" onSubmit={handleSubmit(submitForm)}>
            
            <div className="flex flex-col">
                <p className="text-sm text-gray-600 dark:text-gray-300">{t("topic")}</p>
                <select className="input w-full dark:bg-gray-700 dark:text-white dark:border-gray-600 p-2" onChange={(e) => setValue("topic", e.target.value)}>
                    <option>{t("choose-topic")}</option>
                    { topics?.map((topic, index) => {
                        return (
                            <option key={index}>{topic}</option>
                        )
                    }) }
                </select>
            </div>
            
            <div className="flex flex-col">
                <p className="text-sm text-gray-600 dark:text-gray-300">{t("other-topic")}</p>
                <input required className="input w-full dark:bg-gray-700 dark:text-white dark:border-gray-600" {...register("topic")}  onChange={(e) => setValue("topic", e.target.value)}/>
            </div>
                    
            <div className="flex flex-col">
                <p className="text-sm text-gray-600 dark:text-gray-300">{t("title")}</p>
                <input required className="input w-full dark:bg-gray-700 dark:text-white dark:border-gray-600" {...register("name", { required: true })}/>
            </div>

            <div className="flex flex-col">
                <p className="text-sm text-gray-600 dark:text-gray-300">{t("template-description")}</p>
                <textarea required className="input w-full dark:bg-gray-700 dark:text-white dark:border-gray-600 resize-none" {...register("description", { required: true })}/>
            </div>

            <div className="flex flex-col">
                <p className="text-sm text-gray-600 dark:text-gray-300">{t("image")}</p>
                <input type='file' className="input w-full dark:bg-gray-700 dark:text-white dark:border-gray-600" onChange={handleImageUpload}/>
            </div>

            <div className="flex flex-col">
                {image ? (
                    <Image alt='image' src={image} width={150} height={150}/>
                ) : <></>}
            </div>

            <div className="flex flex-col dark:text-white">
                    <p className="text-sm text-gray-600 dark:text-gray-300">{t("tags")}</p>
                    <input className="input w-full dark:bg-gray-700 dark:text-white dark:border-gray-600" value={currentTag} onChange={(e) => setCurrentTag(e.target.value)}/>
                    <button className='new-theme-button mt-1' onClick={(e) => {
                        e.preventDefault();
                        if (!tags.includes(currentTag) && currentTag !== '') {
                            setTags((prevTags) => [...prevTags, currentTag]);
                            setCurrentTag("")
                        }
                    }}>{t("add-tag")}</button>
            </div>

                { tags && tags.map((tag, index) => {
                return (
                    <div key={index} className="flex flex-col gap-1 dark:text-white">
                        <div key={index} className='flex flex-row items-center justify-between dark:text-white gap-2 border-b dark:border-b-gray-600 p-1'>
                            <p>{tag}</p>
                            <button className='new-theme-red-button' onClick={(e) => handleDeleteTag(e, tag)}><FaTrash /></button>
                        </div>
                    </div>
                    )
                }) }

                {Array.isArray(matchingTags) && matchingTags.length > 0 && currentTag !== '' && (
                    <ul className="top-full w-[200px] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg p-1 flex flex-col gap-1">
                        <li className='new-theme-gray-button cursor-pointer' onClick={() => {
                            if (!tags.includes(currentTag) && currentTag !== '') {
                                setTags((prevTags) => [...prevTags, currentTag]);
                                setCurrentTag("")
                            }
                        }}>{currentTag}...</li>

                        {matchingTags.map((tag, index) => (
                            <li key={index} onClick={async () => {
                                if (!tags.includes(tag) && tag !== '') {
                                    setTags((prevTags) => [...prevTags, tag]);
                                    setCurrentTag("")
                                }
                            }} className='new-theme-gray-button cursor-pointer'> {tag} </li>
                        ))}
                    </ul>
                )}

            <div className='p-2 flex flex-col gap-1'>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">{t("creation-note")}</p>
                <button className="new-theme-button mx-auto" type='submit'>{t("post-n-go")}</button>
            </div>
        </form>
    </div>
  )
}

export default CreateTemplate