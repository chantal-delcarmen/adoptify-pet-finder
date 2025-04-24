import React, { useState } from 'react';

function FilterPets({ pets, onFilter }) {
    const [filter, setFilter] = useState({
        pet_type: '',
        gender: '',
        adoption_status: '',
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        const updatedFilter = {
            ...filter,
            [name]: value,
        };
        setFilter(updatedFilter);

        // Apply the filter and pass the filtered pets to the parent
        const filteredPets = pets.filter((pet) => {
            return (
                (updatedFilter.pet_type === '' || pet.pet_type === updatedFilter.pet_type) &&
                (updatedFilter.gender === '' || pet.gender === updatedFilter.gender) &&
                (updatedFilter.adoption_status === '' || pet.adoption_status === updatedFilter.adoption_status)
            );
        });

        onFilter(filteredPets);
    };

    return (
        <div className="filters">
            <div className="filter-group">
                <label htmlFor="pet_type">Pet Type:</label>
                <select
                    id="pet_type"
                    name="pet_type"
                    value={filter.pet_type}
                    onChange={handleFilterChange}
                >
                    <option value="">All</option>
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Bird">Bird</option>
                    <option value="Rabbit">Rabbit</option>
                </select>
            </div>

            <div className="filter-group">
                <label htmlFor="gender">Gender:</label>
                <select
                    id="gender"
                    name="gender"
                    value={filter.gender}
                    onChange={handleFilterChange}
                >
                    <option value="">All</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
            </div>

            <div className="filter-group">
                <label htmlFor="adoption_status">Adoption Status:</label>
                <select
                    id="adoption_status"
                    name="adoption_status"
                    value={filter.adoption_status}
                    onChange={handleFilterChange}
                >
                    <option value="">All</option>
                    <option value="Available">Available</option>
                    <option value="Pending">Pending</option>
                    <option value="Adopted">Adopted</option>
                </select>
            </div>
        </div>
    );
}

export default FilterPets;