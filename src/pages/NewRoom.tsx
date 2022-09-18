import { FormEvent, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link, useHistory } from "react-router-dom";
import { database } from "../services/firebase";

import "../styles/auth.scss";
import illustrationImg from "../assets/images/illustration.svg";
import { Button } from "../components/Button";

export function NewRoom() {
  const { user } = useAuth();
  const [newRoom, setNewRoom] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const history = useHistory();

  async function handleCreateRoom(event: FormEvent) {
    //prevent html default refresh behavior
    event.preventDefault();

    if (newRoom.trim() === "") {
      alert("A sala precisa ter um nome");
      return;
    }

    if (newVideoUrl.trim() === "" || newVideoUrl.length < 11) {
      alert("Insira uma url do youtube válida");
      return;
    }

    const roomRef = database.ref("rooms");
    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
      videoUrl: newVideoUrl.slice(-11),
    });

    history.push(`/rooms/${firebaseRoom.key}`);
  }

  return (
    <div id='page-auth'>
      <aside>
        <img src={illustrationImg} alt='illustration' />
        <strong>Crie salas de interação</strong>
        <p>Assista a videos e interaja em tempo real</p>
      </aside>
      <main>
        <div className='main-content'>
          <h1 className='home-title'>CommentFlix</h1>
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input
              type='text'
              placeholder='Nomeie sua sala'
              onChange={(event) => setNewRoom(event.target.value)}
              value={newRoom}
            />
            <input
              type='text'
              placeholder='URL do vídeo'
              onChange={(event) => setNewVideoUrl(event.target.value)}
              value={newVideoUrl}
            />
            <Button type='submit'>Criar sala</Button>
          </form>
          <p>
            Quer entrar numa sala já existente? <Link to='/'>Clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
