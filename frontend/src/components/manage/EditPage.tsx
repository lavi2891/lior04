import React, { useState } from 'react';

interface Vacation {
    vacation_id: number;
    name: string;
    start_date: Date;
    end_date: Date;
    followers_count: number;
    is_following: boolean;
    description: string;
    destination: string;
    image_file_name: string;
    price: string;
}

const EditPage: React.FC = () => {
    const [vacation, setVacation] = useState<Vacation>({
        vacation_id: 0,
        name: '',
        start_date: new Date(),
        end_date: new Date(),
        followers_count: 0,
        is_following: false,
        description: '',
        destination: '',
        image_file_name: '',
        price: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVacation({
            ...vacation,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <form>
            <label>
                Name:
                <input type="text" name="name" value={vacation.name} onChange={handleChange} />
            </label>
            {/* Repeat for other fields... */}
            <input type="submit" value="Submit" />
        </form>
    );
};

export default EditPage;
