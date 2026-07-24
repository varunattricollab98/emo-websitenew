import { Link } from 'react-router-dom'

export default function Logo() {
  return (
    <Link to="/" className="flex items-center" aria-label="EaseMyOffice home">
      <img
        src="/emo-logo.webp"
        alt="EaseMyOffice"
        width="800"
        height="200"
        className="h-9 w-auto sm:h-10"
      />
    </Link>
  )
}
