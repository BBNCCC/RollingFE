import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to BNCC Frontend</p>
      <Link to="/login">Go to Login</Link>
    </div>
  )
}

export default HomePage
