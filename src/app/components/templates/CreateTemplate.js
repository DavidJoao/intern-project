'use client'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { createTemplate, fetchTopics, uploadImage } from '@/app/actions/templates';
import { useForm } from 'react-hook-form';
import imageCompression from 'browser-image-compression';
import Image from 'next/image';
import { navigate } from '@/app/lib/redirect';

const CreateTemplate = ({ userId }) => {

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
            const imageUrl = await uploadImage(image);
            if (imageUrl) {
                data.imageUrl = imageUrl;
                data.creatorId = userId;
                const response = await createTemplate(data);
                if (response.status === 201) {
                    reset();
                    navigate(`/pages/template/${response.data.template.id}`);
                }
    
                return response;
            }
        } catch (error) {
            return error
        }
    }

  return (
    <div className='h-full w-[30%] hidden md:flex flex-col items-center p-3'>
        <p className='font-bold'>{t("create-template")}</p>
        <form className='border-[3px] border-slate-200 w-full h-full p-3 rounded shadow-lg bg-white' onSubmit={handleSubmit(submitForm)}>
            <div className='p-2'>
                <p className='text-xs text-gray-400'>Topic</p>
                <select className='input w-full' onChange={(e) => setValue("topic", e.target.value)}>
                    <option>Choose Topic</option>
                    { topics?.map((topic, index) => {
                        return (
                            <option key={index}>{topic}</option>
                        )
                    }) }
                </select>
            </div>
            
            <div className='p-2'>
                <p className='text-xs text-gray-400'>Other Topic</p>
                <input className='input w-full' {...register("topic")}  onChange={(e) => setValue("topic", e.target.value)}/>
            </div>
                    
            <div className='p-2'>
                <p className='text-xs text-gray-400'>Name</p>
                <input required className='input w-full' {...register("name", { required: true })}/>
            </div>

            <div className='p-2'>
                <p className='text-xs text-gray-400'>Description</p>
                <textarea required className='input w-full resize-none' {...register("description", { required: true })}/>
            </div>

            <div className='p-2'>
                <p className='text-xs text-gray-400'>Image</p>
                <input type='file' className='input w-full' onChange={handleImageUpload}/>
            </div>

            <div className='p-2 flex items-center justify-center'>
                {image ? (
                    <Image alt='image' src={image} width={150} height={150}/>
                ) : <></>}
            </div>

            <div className='p-2'>
                <p className='text-xs text-gray-400'>After creating your template with this initial configuration you will be able to add queestions, tags and change the image.</p>
            </div>

            <button className="blue-button w-full" type='submit'>Post and go to Template</button>
        </form>
    </div>
  )
}

export default CreateTemplate