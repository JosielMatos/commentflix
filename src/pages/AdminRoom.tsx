import { RoomCode } from '../components/RoomCode';
import { useHistory, useParams } from 'react-router-dom';
import { database } from '../services/firebase';
import { useRoom } from '../hooks/useRoom';

import '../styles/room.scss'
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';
import { Question } from '../components/Question';
import { Button } from '../components/Button';

type RoomParams = {
    id: string;
}

export function AdminRoom() {
    const history = useHistory();
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const { title, questions } = useRoom(roomId);

    async function handleMarkAsAnswered(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true,
        })
    }

    async function handleHighlightQuestion(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true,
        })
    }

    async function handleDeleteQuestion(questionId: string) {
        if (window.confirm('Are you sure you want to delete this question?')) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
        }
    }

    async function handleCloseRoom() {
        await database.ref(`rooms/${roomId}`).update({
            closedAt: new Date(),
        })
        history.push('/')
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <h2>CommentFlix</h2>
                    <div>
                        <RoomCode code={roomId} />
                        <Button isOutlined onClick={handleCloseRoom}>Fechar sala</Button>
                    </div>
                </div>
            </header>

            <main className="content">
                <div className="room-title">
                    <h1>{title}</h1>
                    { questions.length > 0 && <span>{questions.length} Comentário(s)</span> }
                </div>

                <div className="questions-list">
                    { questions.map(question => {
                        return(
                            <Question 
                            key={question.id}
                            content={question.content}
                            author={question.author}
                            isAnswered={question.isAnswered}
                            isHighlighted={question.isHighlighted}
                            >
                                {!question.isAnswered && (
                                    <>
                                        <button
                                        type="button"
                                        onClick={() => handleMarkAsAnswered(question.id)}
                                        >
                                            <img src={checkImg} alt="mark as answered" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleHighlightQuestion(question.id)}
                                        >
                                            <img src={answerImg} alt="highlight question" />
                                        </button>
                                    </>
                                )}
                                <button
                                    type="button"
                                    onClick={() => handleDeleteQuestion(question.id)}
                                >
                                    <img src={deleteImg} alt="delete question" />
                                </button>
                            </Question>
                        );
                    }) }
                </div>
            </main>
        </div>
    );
}