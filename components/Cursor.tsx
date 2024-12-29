
// components/Cursor.tsx
interface User {
  cursor: {
    x: number;
    y: number;
  };
  name: string;
}

export default function Cursor({ user }: { user: User }) {
    return (
      <div
        className="absolute pointer-events-none"
        style={{
          left: user.cursor.x,
          top: user.cursor.y,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <div className="text-2xl">👆</div>
        <div className="text-sm">{user.name}</div>
      </div>
    )
  }