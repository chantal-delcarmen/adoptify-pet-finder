-- Create a table for pets
CREATE TABLE pet (
    petID INT AUTO_INCREMENT PRIMARY KEY, -- Primary key
    name VARCHAR(255) NOT NULL,           -- Pet name
    gender VARCHAR(50),                   -- Gender of the pet
    petImage VARCHAR(255),                -- URL or path to the pet's image
    domesticated BOOLEAN,                 -- Whether the pet is domesticated
    age INT,                              -- Age of the pet
    adoptionStatus VARCHAR(50),           -- Adoption status (e.g., "Available", "Adopted")
    petType VARCHAR(50),                  -- Type of pet (e.g., "Dog", "Cat")
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp for record creation
);

-- Insert seed data
INSERT INTO pet (name, gender, petImage, domesticated, age, adoptionStatus, petType)
VALUES
('Buddy', 'Male', 'images/buddy.jpg', TRUE, 3, 'Available', 'Dog'),
('Mittens', 'Female', 'images/mittens.jpg', TRUE, 2, 'Available', 'Cat'),
('Charlie', 'Male', 'images/charlie.jpg', TRUE, 4, 'Adopted', 'Dog'),
('Luna', 'Female', 'images/luna.jpg', TRUE, 1, 'Available', 'Cat');