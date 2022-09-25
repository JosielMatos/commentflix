import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FormEvent, useState } from "react";
import { database } from "../services/firebase";

import "../styles/auth.scss";
import illustrationImg from "../assets/images/illustration.svg";
import googleIconImg from "../assets/images/google-icon.svg";
import { Button } from "../components/Button";

export function Home() {
  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth();
  const [roomCode, setRoomCode] = useState("");

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    }

    navigate("/rooms/new");
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if (roomCode.trim() === "") {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();
    if (!roomRef.exists()) {
      alert("Essa sala não existe.");
      return;
    }

    if (roomRef.val().closedAt) {
      alert("Sala já foi fechada.");
      return;
    }

    navigate(`/rooms/${roomCode}`);
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
          <button onClick={handleCreateRoom} className='create-room'>
            <img src={googleIconImg} alt='Google logo' />
            Crie sua sala com Google
          </button>
          <div className='separator'>Ou, entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type='text'
              placeholder='Insira o código da sala'
              onChange={(event) => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button type='submit'>Entrar</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
