CREATE DATABASE ai_wildlife_national_park_db;
USE ai_wildlife_national_park_db;

-- Phần 1: đăng ký/đăng nhập và vai trò người dùng

-- roles of user
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,

    role_name VARCHAR(50) NOT NULL UNIQUE,

    description VARCHAR(255),

    is_system BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO roles(role_name, description)
VALUES
('Admin','System Administrator'),
('User','Normal User'),
('Park Manager','National Park Manager'),
('Researcher','Wildlife Researcher'),
('Moderator','Content Moderator');

CREATE TABLE permissions (

    id INT AUTO_INCREMENT PRIMARY KEY,

    permission_name VARCHAR(100) UNIQUE,

    description VARCHAR(255)

);

INSERT INTO permissions(permission_name)
VALUES
('manage_users'),
('manage_parks'),
('manage_animals'),
('manage_reviews'),
('delete_reviews'),
('use_ai_recognition'),
('use_chatbot'),
('book_tour');

-- permission
CREATE TABLE role_permissions (

    role_id INT,

    permission_id INT,

    PRIMARY KEY(role_id, permission_id),

    FOREIGN KEY(role_id)
        REFERENCES roles(id)
        ON DELETE CASCADE,

    FOREIGN KEY(permission_id)
        REFERENCES permissions(id)
        ON DELETE CASCADE
);

-- user
CREATE TABLE users (
    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),

    role_id INT NOT NULL,

    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,

    password_hash VARCHAR(255) NOT NULL,

    first_name VARCHAR(100),
    last_name VARCHAR(100),

    avatar VARCHAR(500),

    phone VARCHAR(20),

    country VARCHAR(100),

    status ENUM('active','inactive','banned') DEFAULT 'active',

    email_verified BOOLEAN DEFAULT FALSE,

    last_login TIMESTAMP NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_users_role
        FOREIGN KEY (role_id)
        REFERENCES roles(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);


-- Phần 2: sở thích và yêu thích
CREATE TABLE user_preferences (

    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),

    user_id CHAR(36) NOT NULL UNIQUE,

    preferred_region VARCHAR(100),

    preferred_climate ENUM(
        'Tropical',
        'Temperate',
        'Desert',
        'Mountain',
        'Cold'
    ),

    travel_season ENUM(
        'Spring',
        'Summer',
        'Autumn',
        'Winter',
        'Any'
    ) DEFAULT 'Any',

    preferred_animals JSON,

    preferred_activities JSON,

    budget_level ENUM(
        'Low',
        'Medium',
        'High'
    ) DEFAULT 'Medium',

    notify_new_parks BOOLEAN DEFAULT TRUE,

    notify_events BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_preferences_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE favorite_parks (

    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),

    user_id CHAR(36) NOT NULL,

    park_id CHAR(36) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_favorite_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_favorite_park
        FOREIGN KEY(park_id)
        REFERENCES national_parks(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_user_favorite
        UNIQUE(user_id, park_id)
);

-- Phần 3: Công viên hoặc sở thú
CREATE TABLE national_parks (

    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),

    park_name VARCHAR(150) NOT NULL,

    country VARCHAR(100) NOT NULL,

    province VARCHAR(100),

    latitude DECIMAL(10,7),

    longitude DECIMAL(10,7),

    description TEXT,

    entrance_fee DECIMAL(10,2),

    opening_time TIME,

    closing_time TIME,

    website VARCHAR(255),

    image_url VARCHAR(500),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE park_climate (

    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),

    park_id CHAR(36) NOT NULL,

    season ENUM(
        'Spring',
        'Summer',
        'Autumn',
        'Winter'
    ),

    climate_type ENUM(
        'Tropical',
        'Temperate',
        'Desert',
        'Mountain',
        'Cold'
    ),

    average_temperature DECIMAL(4,1),

    rainfall_mm DECIMAL(6,2),

    best_visit BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_climate_park
        FOREIGN KEY (park_id)
        REFERENCES national_parks(id)
        ON DELETE CASCADE
);

CREATE TABLE park_facilities (

    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),

    park_id CHAR(36) NOT NULL,

    facility_name VARCHAR(100) NOT NULL,

    description TEXT,

    available BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_facility_park
        FOREIGN KEY (park_id)
        REFERENCES national_parks(id)
        ON DELETE CASCADE
);

CREATE TABLE safari_types (

    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),

    safari_name VARCHAR(100) UNIQUE NOT NULL,

    description TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO safari_types
(safari_name)
VALUES

('Jeep Safari'),

('Walking Safari'),

('Night Safari'),

('Bird Watching'),

('Photography Safari'),

('Boat Safari');

CREATE TABLE park_safari (

    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),

    park_id CHAR(36) NOT NULL,

    safari_id CHAR(36) NOT NULL,

    price DECIMAL(10,2),

    duration_hours DECIMAL(4,1),

    availability ENUM(
        'Available',
        'Unavailable',
        'Seasonal'
    ) DEFAULT 'Available',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_ps_park
        FOREIGN KEY (park_id)
        REFERENCES national_parks(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_ps_safari
        FOREIGN KEY (safari_id)
        REFERENCES safari_types(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_park_safari
        UNIQUE(park_id,safari_id)
);

-- Phần 4: động vật 
CREATE TABLE animals (

    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),

    common_name VARCHAR(150) NOT NULL,

    scientific_name VARCHAR(200) UNIQUE,

    kingdom VARCHAR(50),

    phylum VARCHAR(50),

    animal_class VARCHAR(50),

    animal_order VARCHAR(100),

    family VARCHAR(100),

    genus VARCHAR(100),

    species VARCHAR(100),

    conservation_status ENUM(
        'Least Concern',
        'Near Threatened',
        'Vulnerable',
        'Endangered',
        'Critically Endangered',
        'Extinct in the Wild',
        'Extinct'
    ),

    habitat TEXT,

    diet ENUM(
        'Carnivore',
        'Herbivore',
        'Omnivore'
    ),

    average_lifespan VARCHAR(50),

    average_weight VARCHAR(50),

    average_height VARCHAR(50),

    description TEXT,

    fun_fact TEXT,

    image_url VARCHAR(500),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE park_animals (

    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),

    park_id CHAR(36) NOT NULL,

    animal_id CHAR(36) NOT NULL,

    population_estimate INT,

    best_viewing_season ENUM(
        'Spring',
        'Summer',
        'Autumn',
        'Winter',
        'All Year'
    ),

    endangered_in_park BOOLEAN DEFAULT FALSE,

    notes TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_pa_park
        FOREIGN KEY (park_id)
        REFERENCES national_parks(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_pa_animal
        FOREIGN KEY (animal_id)
        REFERENCES animals(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_park_animal
        UNIQUE(park_id, animal_id)
);

CREATE TABLE animal_recognitions (

    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),

    user_id CHAR(36) NOT NULL,

    detected_animal_id CHAR(36),

    uploaded_image VARCHAR(500) NOT NULL,

    confidence_score DECIMAL(5,2),

    recognition_status ENUM(
        'Success',
        'Failed',
        'Pending'
    ) DEFAULT 'Pending',

    ai_model VARCHAR(100),

    recognition_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    notes TEXT,


    CONSTRAINT fk_recognition_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,


    CONSTRAINT fk_recognition_animal
        FOREIGN KEY(detected_animal_id)
        REFERENCES animals(id)
        ON DELETE SET NULL

);

CREATE TABLE animal_images (

    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),

    animal_id CHAR(36) NOT NULL,

    image_url VARCHAR(500) NOT NULL,

    image_title VARCHAR(200),

    image_type ENUM(
        'Primary',
        'Gallery',
        'Training'
    ) DEFAULT 'Gallery',

    image_source VARCHAR(255),

    photographer VARCHAR(150),

    image_description TEXT,

    is_primary BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_animal_images
        FOREIGN KEY (animal_id)
        REFERENCES animals(id)
        ON DELETE CASCADE
);

CREATE TABLE recognition_results (

    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),

    recognition_id CHAR(36) NOT NULL,

    animal_id CHAR(36) NOT NULL,

    confidence_score DECIMAL(5,2) NOT NULL,

    prediction_rank INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_rr_recognition
        FOREIGN KEY (recognition_id)
        REFERENCES animal_recognitions(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_rr_animal
        FOREIGN KEY (animal_id)
        REFERENCES animals(id)
        ON DELETE CASCADE
);

-- Phần 5: ChatBox
CREATE TABLE chat_sessions (
    session_id CHAR(36) NOT NULL DEFAULT(UUID()) PRIMARY KEY,

    user_id CHAR(36) NOT NULL,

    session_title VARCHAR(255),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_chat_session_user
    FOREIGN KEY(user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE chat_messages (

    message_id CHAR(36) NOT NULL DEFAULT(UUID()) PRIMARY KEY,

    session_id CHAR(36) NOT NULL,

    sender ENUM('user','assistant'),

    message_content TEXT NOT NULL,

    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    CONSTRAINT fk_message_session
    FOREIGN KEY(session_id)
    REFERENCES chat_sessions(session_id)
    ON DELETE CASCADE

);

CREATE TABLE wildlife_news (

    news_id CHAR(36) NOT NULL DEFAULT(UUID()) PRIMARY KEY,

    animal_id CHAR(36),

    title VARCHAR(255) NOT NULL,

    summary TEXT,

    content LONGTEXT,

    image_url VARCHAR(500),

    source VARCHAR(255),

    published_date DATE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    CONSTRAINT fk_news_animal

    FOREIGN KEY(animal_id)

    REFERENCES animals(id)

    ON DELETE SET NULL

);


