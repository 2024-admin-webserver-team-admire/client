import React from 'react'

const ProfileImage = ({ name }: { name: string }) => {
  return (
    <div className="relative inline-flex size-10 items-center justify-center overflow-hidden rounded-full bg-gray-100 dark:bg-gray-600">
      <span className="font-medium text-gray-600 dark:text-gray-300">
        {name.slice(0, 2)}
      </span>
    </div>
  )
}

export default ProfileImage
