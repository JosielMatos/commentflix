import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

type CommentType = {
    id: string,
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likeCount: number;
    likeId: string | undefined;
}

type FirebaseComments = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likes: Record<string, {
        authorId: string;
    }>
}>

export function useRoom(RoomId: string) {
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [comments, setComments] = useState<CommentType[]>([])

    useEffect(() => {
        const roomsRef = database.ref(`rooms/${RoomId}`);

        roomsRef.on('value', room => {
            const databaseRoom = room.val();
            const firebaseComments: FirebaseComments = databaseRoom.comments ?? {};
            const parsedComments = Object.entries(firebaseComments).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered,
                    likeCount: Object.values(value.likes ?? {}).length,
                    likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
                }
            })

            setTitle(databaseRoom.title)
            setVideoUrl(databaseRoom.videoUrl)
            setComments(parsedComments)
        })

        return () => {
            roomsRef.off('value');
        }
    }, [RoomId, user?.id])

    return { comments, title, videoUrl }
}