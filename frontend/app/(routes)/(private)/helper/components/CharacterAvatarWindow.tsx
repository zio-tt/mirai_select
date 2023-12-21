type CharacterProps = {
  name: string;
  avatar: string;
}

const CharacterAvatarWindow = ({ name, avatar }: CharacterProps) => {
  return (
    <div>
      <div className="flex flex-col">
        <img src={avatar} alt={name} />
        {name}
      </div>
    </div>
  );
}

export { CharacterAvatarWindow }