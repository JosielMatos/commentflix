import copyImg from "../assets/images/copy.svg";

import "../styles/room-code.scss";

type RoomCodeProps = {
  code: string;
};

export function RoomCode({ code }: RoomCodeProps) {
  function copyCodeToClipboard() {
    navigator.clipboard.writeText(code);
  }

  return (
    <button className='room-code' onClick={copyCodeToClipboard}>
      <div>
        <img src={copyImg} alt='copy room code' />
      </div>
      <span>Sala #{code}</span>
    </button>
  );
}
