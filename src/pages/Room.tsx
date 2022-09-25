import { RoomCode } from "../components/RoomCode";
import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FormEvent, useState } from "react";

import "../styles/room.scss";
import { Button } from "../components/Button";
import { database } from "../services/firebase";
import { Comment } from "../components/Comment";
import { useRoom } from "../hooks/useRoom";

type RoomParams = {
  id: string;
};

export function Room() {
  const { user, signInWithGoogle, signOut } = useAuth();
  const [newComment, setNewComment] = useState("");
  const params = useParams<RoomParams>();
  const roomId = params.id as string;
  const { title, comments, videoUrl } = useRoom(roomId);

  async function handleSendComment(event: FormEvent) {
    event.preventDefault();
    if (newComment.trim() === "") {
      return;
    }
    if (!user) {
      throw new Error("You must be logged in");
    }

    const comment = {
      content: newComment,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswered: false,
    };
    await database.ref(`rooms/${roomId}/comments`).push(comment);

    setNewComment("");
  }

  async function handleLikeComment(
    commentId: string,
    likeId: string | undefined
  ) {
    if (likeId) {
      await database
        .ref(`rooms/${roomId}/comments/${commentId}/likes/${likeId}`)
        .remove();
    } else {
      await database.ref(`rooms/${roomId}/comments/${commentId}/likes`).push({
        authorId: user?.id,
      });
    }
  }

  return (
    <div id='page-room'>
      <header>
        <div className='content'>
          <h2>CommentFlix</h2>
          <div>
            <RoomCode code={roomId} />
            <Button onClick={signOut}>Sair</Button>
          </div>
        </div>
      </header>

      <main className='content'>
        <div className='room-title'>
          <h1>{title}</h1>
          {comments.length > 0 && <span>{comments.length} Comentário(s)</span>}
        </div>

        <section className='video-frame'>
          <iframe
            width='720'
            height='405'
            src={`https://www.youtube.com/embed/${videoUrl}`}
            title='YouTube video player'
            frameBorder='0'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
          ></iframe>
        </section>

        <form onSubmit={handleSendComment}>
          <textarea
            placeholder='No que você está pensando?'
            onChange={(event) => setNewComment(event.target.value)}
            value={newComment}
          />
          <div className='form-footer'>
            {user ? (
              <div className='user-info'>
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>
                <button onClick={signInWithGoogle}>Login</button> para comentar.
              </span>
            )}

            <Button type='submit' disabled={!user}>
              Postar
            </Button>
          </div>
        </form>

        <section className='comments-list'>
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
                  <button
                    className={`like-button ${comment.likeId ? "liked" : ""}`}
                    type='button'
                    aria-label='Like'
                    onClick={() =>
                      handleLikeComment(comment.id, comment.likeId)
                    }
                  >
                    {comment.likeCount > 0 && (
                      <span>{comment.likeCount}</span>
                    )}
                    <svg
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z'
                        stroke='#737380'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </button>
                )}
              </Comment>
            );
          })}
        </section>
      </main>
    </div>
  );
}
