import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="card text-center">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="mt-2">There is nothing at this address.</p>
      <Link to="/" className="btn btn-primary mt-6">Back to home</Link>
    </div>
  );
}
