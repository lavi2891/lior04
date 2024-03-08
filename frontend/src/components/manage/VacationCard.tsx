import React, { useState } from 'react'
import Axios from 'axios'
import './VacationCard.css'
import AreYouSure from './AreYouSure'

interface VacationCardProps {
    vacation: {
        vacation_id: number
        name: string
        start_date: Date
        end_date: Date
        followers_count: number
        is_following: boolean
        description: string
        destination: string
        image_file_name: string
        price: string
    }
    onFollowToggle: (id: number) => void
}

const VacationCard: React.FC<VacationCardProps> = ({
    vacation,
    onFollowToggle
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleDelete = () => {
        // Delete logic goes here
        console.log('Item deleted')
        setIsModalOpen(false)
    }
    const handleEdit = async () => {
        try {
            if (vacation.is_following) {
                await Axios.post(
                    `http://localhost:3001/api/followers/unfollow?vacation_id=${vacation.vacation_id}`
                )
            } else {
                await Axios.post(
                    `http://localhost:3001/api/followers/follow/${vacation.vacation_id}`
                )
            }

            // Update the UI or state to reflect the new follow status
            onFollowToggle(vacation.vacation_id)
        } catch (error) {
            console.error('Error toggling follow:', error)
        }
    }

    return (
        <div className='vacation-card'>
            <img
                src={`http://localhost:3001/api/vacations/image?path=uploads/${vacation.image_file_name.replace(
                    'uploads\\',
                    ''
                )}`}
                alt={vacation.description}
                style={{ width: '100px' }}
            ></img>
            <h3>{vacation.name}</h3>
            <p>
                {vacation.start_date
                    ? new Date(vacation.start_date).toDateString()
                    : 'N/A'}{' '}
                -{' '}
                {vacation.end_date
                    ? new Date(vacation.end_date).toDateString()
                    : 'N/A'}
            </p>
            <p>{vacation.description}</p>
            <p>Followers: {vacation.followers_count}</p>
            <button>{vacation.price + '$'}</button>
            {!!vacation.is_following && <p>following</p>}
            <button onClick={handleEdit}>Edit</button>
            <button onClick={() => setIsModalOpen(true)}>Delete</button>
            <AreYouSure
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDelete}
            />
        </div>
    )
}

export default VacationCard
