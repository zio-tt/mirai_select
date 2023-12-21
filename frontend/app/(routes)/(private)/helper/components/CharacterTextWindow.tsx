type ResponseProps = {
  response: string;
}

const CharacterResponseWindow = ({ response }: ResponseProps) => {
  return (
    <div className="character-response-window">
      <p>{response}</p>
    </div>
  );
}

export { CharacterResponseWindow }