CREATE TABLE users (
    user_id VARCHAR(50) PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    address TEXT,
    contact_number VARCHAR(20),
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('resident', 'collector', 'admin') NOT NULL
);
 

CREATE TABLE waste_categories (
    category_id VARCHAR(50) PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    description TEXT,
    examples TEXT
);

CREATE TABLE routes (
    route_id VARCHAR(50) PRIMARY KEY,
    collector_id VARCHAR(50),
    route_name VARCHAR(100) NOT NULL,
    area_covered TEXT,
    priority_order INT,
    FOREIGN KEY (collector_id) REFERENCES users(user_id)
);
 
CREATE TABLE collection_schedules (
    schedule_id VARCHAR(50) PRIMARY KEY,
    route_id VARCHAR(50),
    collector_id VARCHAR(50),
    collection_day VARCHAR(20),
    collection_time TIME,
    area TEXT,
    status VARCHAR(50),
    FOREIGN KEY (route_id) REFERENCES routes(route_id),
    FOREIGN KEY (collector_id) REFERENCES users(user_id)
);
 
CREATE TABLE reports (
    report_id VARCHAR(50) PRIMARY KEY,
    resident_id VARCHAR(50),
    category_id VARCHAR(50),
    description TEXT,
    photo_evidence TEXT,
    location TEXT,
    status VARCHAR(50),
    verified_by VARCHAR(50),
    FOREIGN KEY (resident_id) REFERENCES users(user_id),
    FOREIGN KEY (category_id) REFERENCES waste_categories(category_id),
    FOREIGN KEY (verified_by) REFERENCES users(user_id)
);
 
CREATE TABLE violations (
    violation_id VARCHAR(50) PRIMARY KEY,
    resident_id VARCHAR(50),
    violation_type VARCHAR(100),
    violation_date DATE,
    offense_count INT DEFAULT 1,
    remarks TEXT,
    recorded_by VARCHAR(50),
    FOREIGN KEY (resident_id) REFERENCES users(user_id),
    FOREIGN KEY (recorded_by) REFERENCES users(user_id)
);

CREATE TABLE notifications (
    notification_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50),
    message TEXT,
    notification_type VARCHAR(50),
    date_sent DATETIME,
    status VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE announcements (
    announcement_id VARCHAR(50) PRIMARY KEY,
    admin_id VARCHAR(50),
    title VARCHAR(255),
    content TEXT,
    date_posted DATETIME,
    FOREIGN KEY (admin_id) REFERENCES users(user_id)
);
 
CREATE TABLE records (
    record_id VARCHAR(50) PRIMARY KEY,
    admin_id VARCHAR(50),
    record_type VARCHAR(100),
    created_date DATETIME,
    details TEXT,
    FOREIGN KEY (admin_id) REFERENCES users(user_id)
);
 
CREATE TABLE credit_transactions (
    transaction_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50),
    transaction_type ENUM('earned', 'redeemed'),
    points INT NOT NULL,
    description TEXT,
    transaction_date DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
 
CREATE TABLE education_faqs (
    faq_id VARCHAR(50) PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL
);
 
CREATE TABLE education_tips (
    tip_id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255),
    content TEXT,
    category VARCHAR(100),
    date_posted DATETIME
);
 
CREATE TABLE user_education_progress (
    progress_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50),
    tip_id VARCHAR(50),
    completed BOOLEAN DEFAULT FALSE,
    score INT,
    completion_date DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (tip_id) REFERENCES education_tips(tip_id)
);
 
CREATE TABLE waste_search_terms (
    term_id VARCHAR(50) PRIMARY KEY,
    waste_name VARCHAR(100),
    category_id VARCHAR(50),
    disposal_method TEXT,
    FOREIGN KEY (category_id) REFERENCES waste_categories(category_id)
)