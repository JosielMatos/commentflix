import { RoomCode } from "../components/RoomCode";
import { useNavigate, useParams } from "react-router-dom";
import { database } from "../services/firebase";
import { useRoom } from "../hooks/useRoom";

import "../styles/room.scss";
import deleteImg from "../assets/images/delete.svg";
import checkImg from "../assets/images/check.svg";
import answerImg from "../assets/images/answer.svg";
import { Comment } from "../components/Comment";
import { Button } from "../components/Button";

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  const navigate = useNavigate();
  const params = useParams<RoomParams>();
  const roomId = params.id as string;
  const { title, comments } = useRoom(roomId);

  async function handleMarkAsAnswered(commentId: string) {
    await database.ref(`rooms/${roomId}/comments/${commentId}`).update({
      isAnswered: true,
    });
  }

  async function handleHighlightComment(commentId: string) {
    await database.ref(`rooms/${roomId}/comments/${commentId}`).update({
      isHighlighted: true,
    });
  }

  async function handleDeleteComment(commentId: string) {
    if (window.confirm("Tem certeza que quer deletar este comentário?")) {
      await database.ref(`rooms/${roomId}/comments/${commentId}`).remove();
    }
  }

  async function handleCloseRoom() {
    await database.ref(`rooms/${roomId}`).update({
      closedAt: new Date(),
    });
    navigate("/");
  }

  return (
    <div id='page-room'>
      <header>
        <div className='content'>
          <h2>CommentFlix</h2>
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleCloseRoom}>
              Fechar sala
            </Button>
          </div>
        </div>
      </header>

      <main className='content'>
        <div className='room-title'>
          <h1>{title}</h1>
          {comments.length > 0 && <span>{comments.length} Comentário(s)</span>}
        </div>

        <div className='comments-list'>
          {comments.map((comment) => {
            return (
              <Comment
                key={comment.id}
                content={comment.content}
                author={comment.author}
                isAnswered={comment.isAnswered}
                isHighlighted={comment.isHighlighted}
              >
                {!comment.isAnswered && (
                  <>
                    <button
                      type='button'
                      onClick={() => handleMarkAsAnswered(comment.id)}
                    >
                      <img src={checkImg} alt='mark as answered' />
                    </button>
                    <button
                      type='button'
                      onClick={() => handleHighlightComment(comment.id)}
                    >
                      <img src={answerImg} alt='highlight comment' />
                    </button>
                  </>
                )}
                <button
                  type='button'
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  <img src={deleteImg} alt='delete comment' />
                </button>
              </Comment>
            );
          })}
        </div>
      </main>
    </div>
  );
}
