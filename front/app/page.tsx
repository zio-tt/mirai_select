import Link from 'next/link';

const HomePage: React.FC = () => (
  <div>
    <h1>Welcome to the Auth Test App</h1>
    <Link href="/auth/signin">
      <button>Sign In</button>
    </Link>
  </div>
);

export default HomePage;
