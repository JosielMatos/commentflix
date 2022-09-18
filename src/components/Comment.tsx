import { ReactNode } from "react";

import "../styles/comment.scss";
import classNames from "classnames";

type CommentProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  children?: ReactNode;
  isAnswered?: boolean;
  isHighlighted?: boolean;
};

export function Comment({
  content,
  author,
  isAnswered = false,
  isHighlighted = false,
  children,
}: CommentProps) {
  return (
    <div
      className={classNames(
        "comment",
        { answered: isAnswered },
        { highlighted: isHighlighted && !isAnswered }
      )}
    >
      <p>{content}</p>
      <footer>
        <div className='user-info'>
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </div>
        <div>{children}</div>
      </footer>
    </div>
  );
}
