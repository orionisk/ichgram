import { useModal } from '@/contexts/ModalContext'

import { Link } from 'wouter'

function Footer() {
  const { openModal } = useModal()

  const handleClick = (
    e: React.MouseEvent,
    modalType: 'search' | 'notifications',
  ) => {
    e.preventDefault()
    openModal(modalType)
  }

  return (
    <footer className="mt-auto w-full py-5 text-xs max-sm:pb-16 lg:py-10">
      <nav className="mb-4 flex justify-center gap-11 max-md:hidden">
        <Link to="/" className="text-gray-600 hover:text-gray-900">
          Home
        </Link>
        <button
          className="text-gray-600 hover:text-gray-900"
          onClick={e => handleClick(e, 'search')}
        >
          Search
        </button>
        <Link to="/explore" className="text-gray-600 hover:text-gray-900">
          Explore
        </Link>
        <Link to="/messages" className="text-gray-600 hover:text-gray-900">
          Messages
        </Link>
        <button
          className="text-gray-600 hover:text-gray-900"
          onClick={e => handleClick(e, 'notifications')}
        >
          Notifications
        </button>
        <Link to="/create" className="text-gray-600 hover:text-gray-900">
          Create
        </Link>
      </nav>
      <div className="text-center text-xs text-gray-500 sm:mt-5 lg:mt-11">
        ©
        {' '}
        {new Date().getFullYear()}
        {' '}
        ICHgram
      </div>
    </footer>
  )
}

export default Footer
