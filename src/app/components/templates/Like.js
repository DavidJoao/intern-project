'use client'
import { getLikeInfo, likeTemplate } from '@/app/actions/likes';
import { useAuth } from '@/app/hooks/useAuth'
import React, { useEffect, useState, useCallback } from 'react'
import { FcLike, FcDislike } from 'react-icons/fc';
import Loading from '../general/Loading';
import { socket } from '@/app/lib/socket';


const Like = ({ template }) => {

    const user = useAuth();
    const [likeData, setLikeData] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        socket.on("Liked Template", () => {
            fetchLikeInfo()
        });
    
        return () => {
          socket.off("Liked Template", fetchLikeInfo);
        };
      }, [likeData]);

      
      const fetchLikeInfo = useCallback(async () => {
          if (user?.user?.id && template?.id) {
              const { data } = await getLikeInfo(user?.user?.id, template.id);
              setLikeData(data);
            }
        }, [user?.user?.id, template?.id]);
        
        const handleLikeTemplate = async () => {
            const response = await likeTemplate(user?.user?.id, template.id)
            console.log(response);
            await fetchLikeInfo();
            socket.emit("liked template");
        }
        
        useEffect(() => {
          if (user?.user?.id && template?.id) {
              fetchLikeInfo();
              socket.on("Liked Template", fetchLikeInfo);
              return () => socket.off("Liked Template", fetchLikeInfo);
          }
      }, [fetchLikeInfo]);
      
    return (
        <>
        { isLoading ? (
            <Loading />
        ) : (
            <button className='border blue-button w-[100px] gap-1 flex items-center justify-between text-sm' onClick={handleLikeTemplate}>{likeData.isLiked ? "Dislike" : "Like"} {likeData.isLiked ? <FcDislike/> : <FcLike/>} ({likeData.likes})</button>
        ) }
        </>
  )
}

export default Like