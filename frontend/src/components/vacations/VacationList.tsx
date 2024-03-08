import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import VacationCard from './VacationCard'
import './VacationList.css'

interface Vacation {
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

const initialVacations: Vacation[] = []

const VacationList: React.FC = () => {
    const [vacations, setVacations] = useState<Vacation[]>(initialVacations)
    const [showFollowingOnly, setShowFollowingOnly] = useState(false)
    const [showUpcomingOnly, setShowUpcomingOnly] = useState(false)
    const [showActiveOnly, setShowActiveOnly] = useState(false)
    const [page, setPage] = useState<number>(1) // Current page
    const pageSize = 10 // Number of items per page

    useEffect(() => {
        const fetchVacations = async () => {
            try {
                const response = await Axios.get(
                    `http://localhost:3001/api/vacations?page=${page}&pageSize=${pageSize}&onlyFollowing=${showFollowingOnly}`
                )
                setVacations(response.data)
            } catch (error) {
                console.error('Error fetching vacations:', error)
            }
        }

        fetchVacations()
    }, [page])

    // Handle previous page and next page button clicks
    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(page - 1)
        }
    }

    const handleNextPage = () => {
        setPage(page + 1)
    }

    const handleFollowToggle = (id: number) => {
        // Implement follow/unfollow logic and update state
    }

    useEffect(() => {
        // Fetch vacation data from your API and update the vacations state
        // You can use a library like Axios for API requests
    }, [])

    // Filter the vacations based on user selections
    let filteredVacations = [...vacations]

    if (showFollowingOnly) {
        filteredVacations = filteredVacations.filter(
            (vacation) => vacation.is_following
        )
    }

    if (showUpcomingOnly) {
        filteredVacations = filteredVacations.filter(
            (vacation) => vacation.start_date > new Date()
        )
    }

    if (showActiveOnly) {
        filteredVacations = filteredVacations.filter(
            (x) => x
            // Implement logic to filter active vacations
        )
    }

    // Implement pagination logic here if needed
    console.log(filteredVacations)
    return (
        <div>
            <div>
                <input
                    type='checkbox'
                    onChange={() => setShowFollowingOnly(!showFollowingOnly)}
                ></input>
                <span>Show only vacation you follows</span>
            </div>
            <div>
                <input
                    type='checkbox'
                    onChange={() => setShowUpcomingOnly(!showUpcomingOnly)}
                ></input>
                <span>Show only vacation not yet started</span>
            </div>
            <div>
                <input
                    type='checkbox'
                    onChange={() => setShowActiveOnly(!showActiveOnly)}
                ></input>
                <span>Show only ongoing vacation</span>
            </div>
            <button disabled={page === 1} onClick={() => handlePreviousPage()}>Previous</button>
            <button disabled={vacations.length === 0} onClick={() => handleNextPage()}>Next</button>
            <div className='vacation-list'>
                {/* Add filter buttons/checkboxes here */}
                {filteredVacations.map((vacation) => (
                    <VacationCard
                        key={vacation.vacation_id}
                        vacation={{
                            ...vacation,
                            vacation_id: vacation.vacation_id
                        }}
                        onFollowToggle={handleFollowToggle}
                    />
                ))}
                {/* Implement pagination controls here */}
            </div>
        </div>
    )
}

export default VacationList
